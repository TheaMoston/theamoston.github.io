

// --- State Management ---
let currentView = 'exhibitions';
let isDetailOpen = false;

// --- DOM Elements ---
const mainContent = document.getElementById('main-content');
const homeView = document.getElementById('home-view');
const galleryGrid = document.getElementById('gallery-grid');
const galleryTitle = document.getElementById('gallery-title');
const detailView = document.getElementById('detail-view');
const detailImageContainer = document.getElementById('detail-image-container');
const detailTextContent = document.getElementById('detail-text-content');
const detailBlogInner = document.getElementById('detail-blog-inner');
const navItems = document.querySelectorAll('.nav-item');
const body = document.body;

// --- Navigation Logic ---
function switchView(key) {
    if (key === 'about') {
        openAbout();
        return;
    }

    currentView = key;
    closeDetail();
    
    navItems.forEach(item => item.classList.remove('active'));
    const activeNav = document.getElementById(`nav-${key}`);
    if(activeNav) activeNav.classList.add('active');

    galleryTitle.innerText = key.charAt(0).toUpperCase() + key.slice(1);
    
    homeView.classList.remove('hidden');
    
    setNavMode('fixed');

    renderGallery(galleries[key]);
    window.scrollTo(0,0);
}

function openAbout() {
    currentView = 'about';
    navItems.forEach(item => item.classList.remove('active'));
    document.getElementById('nav-about').classList.add('active');
    
    homeView.classList.add('hidden');
    openDetail(aboutPage);
}

function renderGallery(projects) {
    galleryGrid.innerHTML = '';
    projects.forEach(project => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.onclick = () => openDetail(project);
        
        const img = document.createElement('img');
        const thumbSrc = project.images ? project.images[0] : "https://via.placeholder.com/600x400/333/fff?text=Blog+Post";
        img.src = thumbSrc;
        img.alt = project.title;
        img.loading = "lazy";

        const title = document.createElement('div');
        title.className = 'gallery-item-title';
        title.innerText = project.title;

        item.appendChild(img);
        item.appendChild(title);
        galleryGrid.appendChild(item);
    });
}

// --- Detail View Logic ---
function setNavMode(mode) {
    if (mode === 'fixed') {
        body.classList.remove('mode-scroll-nav');
        body.classList.add('mode-fixed-nav');
    } else {
        body.classList.remove('mode-fixed-nav');
        body.classList.add('mode-scroll-nav');
    }
}

function openDetail(project) {
    isDetailOpen = true;
    homeView.classList.add('hidden');
    mainContent.classList.add('hidden'); // Hide main container to prevent whitespace
    detailView.classList.add('active');
    
    detailView.classList.remove('layout-gallery', 'layout-blog');
    detailImageContainer.innerHTML = '';
    detailTextContent.innerHTML = '';
    detailBlogInner.innerHTML = '';

    if (project.type === 'gallery') {
        detailView.classList.add('layout-gallery');
        setNavMode('fixed');
        
        detailTextContent.innerHTML = project.description;
        project.images.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.alt = project.title;
            img.loading = "lazy";
            detailImageContainer.appendChild(img);
        });

    } else if (project.type === 'blog') {
        detailView.classList.add('layout-blog');
        setNavMode('scroll');
        
        detailBlogInner.innerHTML = project.content;
    }

    if (!body.classList.contains('mode-scroll-nav')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

function closeDetail() {
    isDetailOpen = false;
    detailView.classList.remove('active');
    mainContent.classList.remove('hidden'); // Show main container again
    homeView.classList.remove('hidden');
    document.body.style.overflow = 'auto';
    
    setNavMode('fixed');

    if (currentView === 'about') {
        currentView = 'exhibitions';
        navItems.forEach(item => item.classList.remove('active'));
        document.getElementById('nav-exhibitions').classList.add('active');
        galleryTitle.innerText = 'Exhibitions';
        renderGallery(galleries['exhibitions']);
    }
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    switchView('exhibitions');
});