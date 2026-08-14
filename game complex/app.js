// ========================================
// Game Complex - Ultimate Edition
// All logic safely inside DOMContentLoaded
// ========================================

(function() {
    'use strict';

    // --- Global State ---
    let allGames = [];
    let cart = [];
    let wishlist = [];
    let library = [];
    let currentUser = null;
    let currentView = 'all';
    let adminStats = { revenue: 0, orders: 0 };
    let filterState = { search: '', genre: 'all', maxPrice: 100, minRating: 0, sortBy: 'newest' };
    let carouselIndex = 0;
    let carouselInterval = null;
    let libraryState = {}; // Tracks install/play status: { id: 'owned'|'downloading'|'installed' }

    // --- Utility: Debounce ---
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    const THEMES = {
        blue:   '217, 91%, 60%',
        purple: '271, 91%, 65%',
        green:  '160, 84%, 39%',
        pink:   '330, 81%, 60%',
        orange: '38, 92%, 50%'
    };

    // --- Load from localStorage ---
    function loadState() {
        try {
            cart = JSON.parse(localStorage.getItem('gc_cart') || '[]');
            wishlist = JSON.parse(localStorage.getItem('gc_wishlist') || '[]');
            library = JSON.parse(localStorage.getItem('gc_library') || '[]');
            currentUser = JSON.parse(localStorage.getItem('gc_user') || 'null');
            adminStats = JSON.parse(localStorage.getItem('gc_admin_stats') || '{"revenue":0,"orders":0}');
            libraryState = JSON.parse(localStorage.getItem('gc_library_state') || '{}');
            var savedGames = localStorage.getItem('gc_all_games');
            if (savedGames) allGames = JSON.parse(savedGames);

            if (!Array.isArray(cart)) cart = [];
            if (!Array.isArray(wishlist)) wishlist = [];
            if (!Array.isArray(library)) library = [];
            if (!adminStats || typeof adminStats !== 'object') adminStats = { revenue: 0, orders: 0 };
            if (!libraryState || typeof libraryState !== 'object') libraryState = {};
            if (!Array.isArray(allGames)) allGames = [];
        } catch(e) {
            console.warn('Failed to load state from localStorage:', e);
            cart = []; wishlist = []; library = []; adminStats = { revenue: 0, orders: 0 }; libraryState = {}; allGames = [];
        }
    }

    // --- Helper: get element safely ---
    function $(id) { return document.getElementById(id); }

    // ====== INITIALIZATION ======
    document.addEventListener('DOMContentLoaded', function() {
        console.log('[GameComplex] Initializing...');
        
        loadState();
        if (allGames.length === 0) {
            allGames = generateMockGames();
            localStorage.setItem('gc_all_games', JSON.stringify(allGames));
        }

        // Apply saved theme
        var savedTheme = localStorage.getItem('gc_theme') || 'blue';
        setTheme(savedTheme, false);

        // Check login state
        if (localStorage.getItem('isLoggedIn') === 'true' && currentUser) {
            $('loginPage').classList.add('hidden');
            $('mainPage').classList.remove('hidden');
            initMainApp();
        } else {
            $('loginPage').classList.remove('hidden');
            $('mainPage').classList.add('hidden');
        }

        setupEventListeners();
        console.log('[GameComplex] Initialization complete.');
    });

    // ====== MAIN APP INIT ======
    function initMainApp() {
        updateHeaderAvatar();
        updateCartBadge();
        initCarousel();

        if (currentUser && currentUser.username === 'admin') {
            $('adminNavLink').classList.remove('hidden');
        } else {
            $('adminNavLink').classList.add('hidden');
        }
        switchView('all');
    }

    // ====== THEME ======
    function setTheme(colorName, notify) {
        var hsl = THEMES[colorName];
        if (hsl) {
            document.documentElement.style.setProperty('--theme-base', hsl);
            localStorage.setItem('gc_theme', colorName);
            if (notify) showToast('Theme updated to ' + colorName + '!', 'success');
        }
    }
    window.setTheme = setTheme; // expose globally for inline onclick

    // ====== TOAST ======
    function showToast(message, type) {
        type = type || 'success';
        var container = $('toastContainer');
        if (!container) return;
        var toast = document.createElement('div');
        toast.className = 'toast ' + type;
        var icon = type === 'success' ? '✔' : (type === 'error' ? '✖' : '⚠');
        toast.innerHTML = '<div style="width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid currentColor;font-size:10px;">' + icon + '</div> <span>' + message + '</span>';
        container.appendChild(toast);
        requestAnimationFrame(function() { toast.classList.add('show'); });
        setTimeout(function() {
            toast.classList.remove('show');
            setTimeout(function() { toast.remove(); }, 400);
        }, 3500);
    }
    window.showToast = showToast;

    // ====== AUTH ======
    function handleLogin(e) {
        e.preventDefault();
        var user = $('username').value.trim();
        if (!user) return;

        if (user === 'admin') {
            currentUser = { username: 'admin', fullName: 'Administrator', email: 'admin@gamecomplex.com', joinDate: 'System Start' };
        } else {
            currentUser = { username: user, fullName: user, email: user + '@example.com', joinDate: new Date().toLocaleDateString() };
        }
        localStorage.setItem('gc_user', JSON.stringify(currentUser));
        localStorage.setItem('isLoggedIn', 'true');

        $('loginPage').classList.add('hidden');
        $('mainPage').classList.remove('hidden');
        initMainApp();
        showToast('Authentication Successful', 'success');
        if (user === 'admin') switchView('admin');
    }

    // ====== REGISTER ======
    function handleRegister(e) {
        e.preventDefault();
        var fullName = $('regFullName').value.trim();
        var email = $('regEmail').value.trim();
        var username = $('regUsername').value.trim();
        if (!fullName || !email || !username) {
            showToast('Please fill in all required fields.', 'error');
            return;
        }
        currentUser = { username: username, fullName: fullName, email: email, joinDate: new Date().toLocaleDateString(), avatar: null };

        var preview = $('avatarPreview');
        if (preview && preview.src && preview.style.display !== 'none') {
            currentUser.avatar = preview.src;
        }
        localStorage.setItem('gc_user', JSON.stringify(currentUser));
        localStorage.setItem('isLoggedIn', 'true');

        $('registerPage').classList.add('hidden');
        $('mainPage').classList.remove('hidden');
        initMainApp();
        showToast('Account created! Welcome, ' + fullName, 'success');
    }

    // ====== LOGOUT ======
    function handleLogout() {
        localStorage.removeItem('isLoggedIn');
        $('mainPage').classList.add('hidden');
        $('loginPage').classList.remove('hidden');
        showToast('Logged out successfully', 'success');
    }

    // Stubs for initialization dependencies
    function generateMockGames() { return []; }
    function setupEventListeners() {}
    function updateHeaderAvatar() {}
    function updateCartBadge() {}
    function initCarousel() {}
    function switchView(viewId, data) {}

})();
