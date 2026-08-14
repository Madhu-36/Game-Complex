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

    function handleLogout() {
        localStorage.removeItem('isLoggedIn');
        $('mainPage').classList.add('hidden');
        $('loginPage').classList.remove('hidden');
        showToast('Logged out successfully', 'success');
    }

    // ====== VIEW ROUTER ======
    function switchView(viewId, data) {
        var allViewAliases = ['all', 'topSellers', 'newReleases', 'onSale'];
        var actualViewId = allViewAliases.indexOf(viewId) !== -1 ? 'all' : viewId;

        // Hide all sections first
        var sections = document.querySelectorAll('.content-section');
        for (var i = 0; i < sections.length; i++) {
            sections[i].classList.remove('active');
        }

        // Show the target section
        var target = $(actualViewId + 'View');
        if (target) {
            target.classList.add('active');
        }

        // Update nav
        var navLinks = document.querySelectorAll('.nav-link');
        for (var j = 0; j < navLinks.length; j++) {
            navLinks[j].classList.remove('active', 'theme-text');
        }
        var activeLink = document.querySelector('.nav-link[data-view="' + viewId + '"]') || document.querySelector('.nav-link[data-view="all"]');
        if (activeLink) activeLink.classList.add('active', 'theme-text');

        currentView = viewId;
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Close search dropdown
        var dd = $('searchDropdown');
        if (dd) dd.style.display = 'none';

        // Render the view content
        if (viewId === 'all') { filterState.genre = 'all'; $('mainGridTitle').textContent = 'Store Catalog'; renderFilteredGrid(); }
        else if (viewId === 'topSellers') { filterState.sortBy = 'rating_desc'; $('mainGridTitle').textContent = 'Top Sellers'; renderFilteredGrid(); }
        else if (viewId === 'newReleases') { filterState.sortBy = 'newest'; $('mainGridTitle').textContent = 'New Releases'; renderFilteredGrid(); }
        else if (viewId === 'onSale') { $('mainGridTitle').textContent = 'Special Offers'; renderFilteredGrid(allGames.filter(function(g) { return g.salePrice; })); }
        else if (viewId === 'gameDetail' && data) renderGameDetailView(data.id);
        else if (viewId === 'account') renderProfileView();
        else if (viewId === 'cart') renderCartView();
        else if (viewId === 'library') renderLibraryView();
        else if (viewId === 'admin') renderAdminView();
        else if (viewId === 'checkout') { /* checkout form is static */ }
    }
    window.switchView = switchView;

    // ====== HERO CAROUSEL ======
    function initCarousel() {
        var container = $('heroCarousel');
        var indContainer = $('heroIndicators');
        var featured = allGames.filter(function(g) { return g.featured; });
        if (!container || featured.length === 0) return;

        container.innerHTML = '';
        indContainer.innerHTML = '';
        featured.forEach(function(game, idx) {
            var slide = document.createElement('div');
            slide.className = 'hero-slide';
            slide.innerHTML =
                '<video autoplay muted loop playsinline style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.5;">' +
                    '<source src="' + game.videoUrl + '" type="video/mp4">' +
                '</video>' +
                '<div style="position:absolute;inset:0;background:linear-gradient(to top,rgb(17,24,39),transparent);"></div>' +
                '<div style="position:absolute;bottom:0;left:0;right:0;padding:3rem;z-index:10;">' +
                    '<div class="theme-bg" style="display:inline-block;color:white;font-size:10px;font-weight:900;letter-spacing:2px;padding:4px 8px;border-radius:4px;margin-bottom:16px;">FEATURED DROP</div>' +
                    '<h2 style="font-size:clamp(2rem,5vw,4.5rem);font-weight:900;color:white;margin-bottom:12px;letter-spacing:-2px;">' + game.name.toUpperCase() + '</h2>' +
                    '<p style="color:#d1d5db;max-width:600px;margin-bottom:32px;font-size:1.1rem;">' + game.description + '</p>' +
                    '<button class="btn-primary" style="padding:16px 40px;border-radius:12px;font-weight:900;font-size:1.1rem;" onclick="switchView(\'gameDetail\',{id:' + game.id + '})">EXPLORE NOW</button>' +
                '</div>';
            container.appendChild(slide);

            var ind = document.createElement('div');
            ind.style.cssText = 'width:48px;height:6px;border-radius:3px;cursor:pointer;transition:all 0.3s;background:' + (idx === 0 ? 'white' : 'rgba(255,255,255,0.2)');
            ind.onclick = function() { goToSlide(idx); };
            indContainer.appendChild(ind);
        });
        startCarousel();
    }

    function goToSlide(index) {
        var featured = allGames.filter(function(g) { return g.featured; });
        if (index < 0) index = featured.length - 1;
        if (index >= featured.length) index = 0;
        carouselIndex = index;

        $('heroCarousel').style.transform = 'translateX(-' + (index * 100) + '%)';
        var inds = $('heroIndicators').children;
        for (var i = 0; i < inds.length; i++) {
            inds[i].style.background = i === index ? 'white' : 'rgba(255,255,255,0.2)';
        }
        resetCarouselTimer();
    }
    function startCarousel() { carouselInterval = setInterval(function() { goToSlide(carouselIndex + 1); }, 7000); }
    function resetCarouselTimer() { clearInterval(carouselInterval); startCarousel(); }

    // ====== FILTERING & RENDERING ======
    function renderFilteredGrid(forcedData) {
        var grid = $('allGamesGrid');
        if (!grid) return;

        var result = forcedData || allGames.slice();
        if (filterState.search) {
            var s = filterState.search.toLowerCase();
            result = result.filter(function(g) { return g.name.toLowerCase().indexOf(s) !== -1 || g.genre.toLowerCase().indexOf(s) !== -1; });
        }
        if (filterState.genre !== 'all') result = result.filter(function(g) { return g.genre === filterState.genre; });
        result = result.filter(function(g) { return (g.salePrice || g.price) <= filterState.maxPrice && g.rating >= filterState.minRating; });

        if (filterState.sortBy === 'price_asc') result.sort(function(a, b) { return (a.salePrice || a.price) - (b.salePrice || b.price); });
        if (filterState.sortBy === 'price_desc') result.sort(function(a, b) { return (b.salePrice || b.price) - (a.salePrice || a.price); });
        if (filterState.sortBy === 'rating_desc') result.sort(function(a, b) { return b.rating - a.rating; });
        if (filterState.sortBy === 'newest') result.sort(function(a, b) { return b.releaseDate - a.releaseDate; });

        grid.innerHTML = '';
        if (result.length === 0) {
            grid.innerHTML = '<div class="col-span-full text-center py-20"><div style="font-size:3rem;margin-bottom:1rem;">🛸</div><h3 class="text-xl font-bold text-gray-400">No games found.</h3></div>';
            return;
        }
        var fragment = document.createDocumentFragment();
        result.forEach(function(game) { fragment.appendChild(createGameCard(game, 'store')); });
        grid.appendChild(fragment);
        attach3DTiltListeners();
    }

    function createGameCard(game, mode) {
        var li = document.createElement('li');
        li.className = 'game-card-wrapper';

        var isWished = wishlist.some(function(w) { return w.id === game.id; });
        var p = game.salePrice || game.price;
        var isOwned = library.some(function(l) { return l.id === game.id; });

        var bottomSection = '';
        if (mode === 'store') {
            if (isOwned) {
                bottomSection = '<button style="width:100%;background:#374151;color:#9ca3af;font-weight:bold;padding:8px;border-radius:8px;border:none;font-size:12px;cursor:not-allowed;">IN LIBRARY</button>';
            } else {
                bottomSection =
                    '<div style="display:flex;justify-content:space-between;align-items:center;padding-top:12px;border-top:1px solid rgba(255,255,255,0.08);">' +
                        '<span style="font-weight:900;color:white;font-size:1.1rem;">$' + p.toFixed(2) + (game.salePrice ? ' <span style="font-size:10px;color:#6b7280;text-decoration:line-through;">$' + game.price.toFixed(2) + '</span>' : '') + '</span>' +
                        '<button class="btn-primary" style="padding:8px 12px;border-radius:8px;font-weight:bold;font-size:13px;" data-add-cart="' + game.id + '">ADD 🛒</button>' +
                    '</div>';
            }
        } else if (mode === 'library') {
            var state = libraryState[game.id] || 'owned';
            if (state === 'owned') {
                bottomSection = '<div style="display:flex;justify-content:space-between;align-items:center;padding-top:12px;border-top:1px solid rgba(255,255,255,0.08);">' +
                    '<span style="font-size:12px;color:#9ca3af;font-weight:bold;">Ready</span>' +
                    '<button class="btn-secondary" style="padding:6px 16px;font-size:12px;border-radius:999px;" data-action-game="' + game.id + '" data-action="INSTALL">INSTALL ➔</button></div>';
            } else if (state === 'downloading') {
                bottomSection = '<div style="display:flex;justify-content:space-between;align-items:center;padding-top:12px;border-top:1px solid rgba(255,255,255,0.08);">' +
                    '<span style="font-size:12px;color:#3b82f6;font-weight:bold;width:100%;">Downloading... <div style="height:4px;background:#1e293b;border-radius:2px;margin-top:4px;overflow:hidden;"><div class="theme-bg" style="height:100%;width:50%;animation:loading 2s infinite;"></div></div></span></div>';
            } else {
                bottomSection = '<div style="display:flex;justify-content:space-between;align-items:center;padding-top:12px;border-top:1px solid rgba(255,255,255,0.08);">' +
                    '<span style="font-size:12px;color:#9ca3af;font-weight:bold;">Installed</span>' +
                    '<button class="play-btn" style="padding:6px 16px;font-size:12px;border-radius:999px;" data-action-game="' + game.id + '" data-action="PLAY">PLAY ➔</button></div>';
            }
        }

        li.innerHTML =
            '<div class="game-card-3d glass-panel rounded-2xl overflow-hidden flex flex-col cursor-pointer border border-gray-800" style="height:100%;" data-game-click="' + game.id + '">' +
                '<div class="card-glare"></div>' +
                '<div style="position:relative;height:192px;overflow:hidden;background:#111827;">' +
                    '<img src="' + game.imageUrl + '" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" alt="' + game.name + '">' +
                    (mode === 'store' ? '<button class="wishlist-btn' + (isWished ? ' active' : '') + '" data-wish="' + game.id + '">' + (isWished ? '♥' : '♡') + '</button>' : '') +
                    '<div class="preview-overlay">' +
                        '<p style="font-size:14px;color:#d1d5db;margin-bottom:8px;">' + game.description.substring(0, 80) + '...</p>' +
                        '<div style="display:flex;justify-content:space-between;font-size:10px;font-weight:900;letter-spacing:1px;">' +
                            '<span style="color:#fbbf24;background:rgba(0,0,0,0.5);padding:4px 8px;border-radius:4px;">★ ' + game.rating.toFixed(1) + '</span>' +
                            '<span class="theme-text" style="background:rgba(0,0,0,0.5);padding:4px 8px;border-radius:4px;text-transform:uppercase;">' + game.genre + '</span>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="card-content" style="padding:20px;display:flex;flex-direction:column;flex-grow:1;background:linear-gradient(to bottom,transparent,rgba(17,24,39,0.5));">' +
                    '<h3 style="font-weight:900;font-size:1.1rem;margin-bottom:4px;letter-spacing:-0.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + game.name + '</h3>' +
                    '<div style="margin-top:auto;">' + bottomSection + '</div>' +
                '</div>' +
            '</div>';
        return li;
    }

    // ====== 3D PARALLAX TILT ======
    function attach3DTiltListeners() {
        var cards = document.querySelectorAll('.game-card-3d');
        for (var i = 0; i < cards.length; i++) {
            (function(card) {
                if (card.dataset.tiltAttached) return;
                card.dataset.tiltAttached = 'true';

                card.addEventListener('mousemove', function(e) {
                    var rect = card.getBoundingClientRect();
                    var x = e.clientX - rect.left;
                    var y = e.clientY - rect.top;
                    var centerX = rect.width / 2;
                    var centerY = rect.height / 2;
                    var rotateX = ((y - centerY) / centerY) * -10;
                    var rotateY = ((x - centerX) / centerX) * 10;

                    card.classList.remove('resetting');
                    card.style.transform = 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02,1.02,1.02)';

                    var glare = card.querySelector('.card-glare');
                    if (glare) glare.style.background = 'radial-gradient(circle at ' + x + 'px ' + y + 'px, rgba(255,255,255,0.15) 0%, transparent 60%)';
                });

                card.addEventListener('mouseleave', function() {
                    card.classList.add('resetting');
                    card.style.transform = '';
                });
            })(cards[i]);
        }
    }

    // ====== SEARCH AUTOCOMPLETE ======
    const handleSearch = debounce(function(e) {
        var val = e.target.value.trim().toLowerCase();
        var dropdown = $('searchDropdown');
        if (!dropdown) return;

        if (val.length < 2) { dropdown.style.display = 'none'; return; }

        var matches = allGames.filter(function(g) {
            return g.name.toLowerCase().indexOf(val) !== -1 || g.genre.toLowerCase().indexOf(val) !== -1;
        }).slice(0, 5);

        if (matches.length === 0) {
            dropdown.innerHTML = '<div style="padding:16px;text-align:center;color:#6b7280;font-size:14px;">No matches found.</div>';
        } else {
            dropdown.innerHTML = matches.map(function(g) {
                return '<div class="ac-item" style="padding:12px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,0.05);" data-game-click="' + g.id + '">' +
                    '<img src="' + g.imageUrl + '" style="width:48px;height:32px;object-fit:cover;border-radius:4px;">' +
                    '<div><div style="font-weight:bold;font-size:14px;color:white;">' + g.name + '</div>' +
                    '<div class="theme-text" style="font-size:10px;text-transform:uppercase;font-weight:bold;">' + g.genre + '</div></div></div>';
            }).join('');
        }
        dropdown.style.display = 'flex';
        dropdown.style.flexDirection = 'column';
    }, 300);

    // ====== GAME DETAIL VIEW ======
    function renderGameDetailView(id) {
        var game = allGames.find(function(g) { return g.id === id; });
        if (!game) return;
        var isWished = wishlist.some(function(w) { return w.id === game.id; });
        var isOwned = library.some(function(l) { return l.id === game.id; });

        var actionBtn = isOwned ?
            '<button class="play-btn" style="width:100%;padding:16px;border-radius:12px;font-weight:900;font-size:1.1rem;margin-bottom:16px;" data-action-game="' + game.id + '" data-action="PLAY">PLAY NOW ➔</button>' :
            '<button class="btn-primary" style="width:100%;padding:16px;border-radius:12px;font-weight:900;font-size:1.1rem;margin-bottom:16px;" data-add-cart="' + game.id + '">ADD TO CART - $' + (game.salePrice || game.price).toFixed(2) + '</button>';

        $('gameDetailView').innerHTML =
            '<button style="margin-bottom:24px;color:#9ca3af;background:none;border:none;cursor:pointer;font-weight:bold;font-size:13px;text-transform:uppercase;letter-spacing:1px;" data-back-to-store>❮ Back to Store</button>' +
            '<div style="position:relative;height:500px;border-radius:1.5rem;overflow:hidden;margin-bottom:40px;box-shadow:0 25px 50px rgba(0,0,0,0.5);border:1px solid #1e293b;">' +
                '<video autoplay muted loop playsinline style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;"><source src="' + game.videoUrl + '" type="video/mp4"></video>' +
                '<div style="position:absolute;inset:0;background:linear-gradient(to top,#0f172a,rgba(15,23,42,0.6),transparent);"></div>' +
                '<div style="position:absolute;bottom:0;left:0;right:0;padding:40px;z-index:10;">' +
                    '<span class="theme-bg" style="display:inline-block;color:white;font-size:10px;font-weight:900;letter-spacing:2px;padding:4px 8px;border-radius:2px;margin-bottom:16px;">' + game.genre.toUpperCase() + '</span>' +
                    '<h1 style="font-size:clamp(2.5rem,5vw,4.5rem);font-weight:900;color:white;margin-bottom:8px;letter-spacing:-2px;">' + game.name + '</h1>' +
                    '<div style="display:flex;gap:12px;font-size:12px;font-weight:bold;letter-spacing:1px;">' +
                        '<span style="color:#fbbf24;background:rgba(0,0,0,0.6);padding:6px 12px;border-radius:8px;">★ ' + game.rating.toFixed(1) + '</span>' +
                        '<span style="color:#d1d5db;background:rgba(0,0,0,0.6);padding:6px 12px;border-radius:8px;">RELEASE: 2026</span>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="grid grid-cols-1 lg:grid-cols-3 gap-10">' +
                '<div class="lg:col-span-2" style="display:flex;flex-direction:column;gap:40px;">' +
                    '<section><h3 style="font-size:1.5rem;font-weight:900;margin-bottom:16px;letter-spacing:-0.5px;">About The Game</h3>' +
                    '<p style="color:#d1d5db;line-height:1.8;font-size:1.1rem;background:rgba(17,24,39,0.5);padding:24px;border-radius:1rem;border:1px solid #1e293b;">' + game.description + ' Experience seamless gameplay, stunning ultra-HD graphics, and a narrative that adapts to your choices. The Ultimate Edition includes all DLCs and a digital artbook.</p></section>' +
                    '<section><h3 style="font-size:1.5rem;font-weight:900;margin-bottom:16px;letter-spacing:-0.5px;">🖥️ System Requirements</h3>' +
                    '<div class="grid grid-cols-2 gap-4" style="background:rgba(17,24,39,0.5);padding:24px;border-radius:1rem;border:1px solid #1e293b;">' +
                        '<div style="padding:16px;background:rgba(30,41,59,0.5);border-radius:12px;"><span style="color:#6b7280;display:block;font-size:11px;font-weight:bold;text-transform:uppercase;margin-bottom:4px;">OS</span><span style="color:white;font-weight:900;">' + game.systemReq.os + '</span></div>' +
                        '<div style="padding:16px;background:rgba(30,41,59,0.5);border-radius:12px;"><span style="color:#6b7280;display:block;font-size:11px;font-weight:bold;text-transform:uppercase;margin-bottom:4px;">CPU</span><span style="color:white;font-weight:900;">' + game.systemReq.cpu + '</span></div>' +
                        '<div style="padding:16px;background:rgba(30,41,59,0.5);border-radius:12px;"><span style="color:#6b7280;display:block;font-size:11px;font-weight:bold;text-transform:uppercase;margin-bottom:4px;">RAM</span><span style="color:white;font-weight:900;">' + game.systemReq.ram + '</span></div>' +
                        '<div style="padding:16px;background:rgba(30,41,59,0.5);border-radius:12px;"><span style="color:#6b7280;display:block;font-size:11px;font-weight:bold;text-transform:uppercase;margin-bottom:4px;">GPU</span><span style="color:white;font-weight:900;">' + game.systemReq.gpu + '</span></div>' +
                    '</div></section>' +
                '</div>' +
                '<div>' +
                    '<div class="glass-panel" style="padding:32px;border-radius:1.5rem;position:sticky;top:96px;box-shadow:0 25px 50px rgba(0,0,0,0.3);">' +
                        actionBtn +
                        '<button class="btn-secondary" style="width:100%;padding:16px;border-radius:12px;font-weight:bold;margin-bottom:24px;" data-wish-toggle="' + game.id + '">' + (isWished ? '♥ REMOVE FROM WISHLIST' : '♡ ADD TO WISHLIST') + '</button>' +
                        '<div style="padding-top:24px;border-top:1px solid #1e293b;">' +
                            '<div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:12px;font-weight:bold;"><span style="color:#6b7280;">Developer</span><span style="color:white;">GC Studios</span></div>' +
                            '<div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:12px;font-weight:bold;"><span style="color:#6b7280;">Publisher</span><span style="color:white;">Game Complex</span></div>' +
                            '<div style="display:flex;justify-content:space-between;font-size:14px;font-weight:bold;"><span style="color:#6b7280;">Platform</span><span style="color:white;">PC, Cloud</span></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="glass-panel" style="margin-top:40px;padding:32px;border-radius:1.5rem;">' +
                '<h3 style="font-size:1.5rem;font-weight:900;margin-bottom:24px;border-bottom:1px solid #1e293b;padding-bottom:16px;">Player Reviews</h3>' +
                '<div id="reviewsContainer" style="display:flex;flex-direction:column;gap:16px;margin-bottom:24px;"></div>' +
                '<form id="reviewForm" data-game-id="' + game.id + '" style="display:flex;flex-direction:column;gap:12px;background:rgba(17,24,39,0.5);padding:24px;border-radius:1rem;">' +
                    '<h4 style="font-weight:bold;">Leave a Review</h4>' +
                    '<select id="reviewRating" class="input-field" required><option value="5">5 Stars - Amazing</option><option value="4">4 Stars - Great</option><option value="3">3 Stars - Good</option><option value="2">2 Stars - Okay</option><option value="1">1 Star - Poor</option></select>' +
                    '<textarea id="reviewText" class="input-field" placeholder="What did you think of the game?" required></textarea>' +
                    '<button type="submit" class="btn-primary" style="padding:12px;border-radius:8px;font-weight:bold;">Post Review</button>' +
                '</form>' +
            '</div>';
        renderReviews(game);
    }

    function renderReviews(game) {
        var rc = $('reviewsContainer');
        if (!rc) return;
        if (!game.reviews || game.reviews.length === 0) {
            rc.innerHTML = '<p style="color:#6b7280;font-style:italic;">No reviews yet. Be the first to review!</p>';
            return;
        }
        var html = '';
        game.reviews.forEach(function(r) {
            html += '<div style="background:rgba(30,41,59,0.5);padding:16px;border-radius:12px;">' +
                '<div style="display:flex;justify-content:space-between;margin-bottom:8px;">' +
                '<span style="font-weight:bold;color:white;">' + r.user + '</span>' +
                '<span style="color:#fbbf24;">' + '★'.repeat(r.rating) + '☆'.repeat(5-r.rating) + '</span>' +
                '</div><p style="color:#d1d5db;font-size:14px;">' + r.text + '</p></div>';
        });
        rc.innerHTML = html;
    }

    // ====== CART ======
    function addToCart(id) {
        var game = allGames.find(function(g) { return g.id === id; });
        if (!game) return;
        if (library.some(function(l) { return l.id === id; })) { showToast('You already own this game.', 'warning'); return; }
        if (cart.some(function(c) { return c.id === id; })) { showToast('Already in cart', 'warning'); return; }
        cart.push(game);
        localStorage.setItem('gc_cart', JSON.stringify(cart));
        updateCartBadge();
        showToast('Added to cart!', 'success');
    }

    function updateCartBadge() {
        var badge = $('cartBadge');
        if (!badge) return;
        badge.textContent = cart.length;
        badge.style.display = cart.length > 0 ? 'block' : 'none';
    }

    function renderCartView() {
        var cont = $('cartContent');
        if (!cont) return;
        if (cart.length === 0) {
            cont.innerHTML = '<div class="glass-panel" style="padding:64px;text-align:center;border-radius:1.5rem;"><div style="font-size:4rem;margin-bottom:24px;">🛒</div><h3 style="font-size:1.75rem;font-weight:900;margin-bottom:8px;">Cart is empty</h3><p style="color:#9ca3af;margin-bottom:32px;">Your next adventure awaits in the store.</p><button class="btn-primary" style="padding:16px 40px;border-radius:12px;font-weight:900;" data-go-store>BROWSE STORE</button></div>';
            return;
        }

        var subtotal = 0;
        var html = '<div class="grid grid-cols-1 lg:grid-cols-3 gap-10"><div class="lg:col-span-2" style="display:flex;flex-direction:column;gap:16px;">';
        cart.forEach(function(item, i) {
            var price = item.salePrice || item.price;
            subtotal += price;
            html += '<div class="glass-panel" style="padding:16px;border-radius:1rem;display:flex;align-items:center;gap:24px;">' +
                '<img src="' + item.imageUrl + '" style="width:128px;height:80px;object-fit:cover;border-radius:12px;">' +
                '<div style="flex-grow:1;"><h4 style="font-weight:900;font-size:1.25rem;letter-spacing:-0.5px;">' + item.name + '</h4><span class="theme-text" style="font-size:12px;font-weight:bold;text-transform:uppercase;">' + item.genre + '</span></div>' +
                '<div style="font-weight:900;font-size:1.25rem;">$' + price.toFixed(2) + '</div>' +
                '<button style="width:40px;height:40px;border-radius:50%;background:#1e293b;color:#ef4444;border:none;cursor:pointer;font-size:1.25rem;font-weight:bold;display:flex;align-items:center;justify-content:center;" data-remove-cart="' + i + '">×</button>' +
                '</div>';
        });
        html += '</div><div class="glass-panel" style="padding:32px;border-radius:1.5rem;height:fit-content;position:sticky;top:96px;">' +
            '<h3 style="font-size:1.5rem;font-weight:900;border-bottom:1px solid #1e293b;padding-bottom:16px;margin-bottom:24px;">Summary</h3>' +
            '<div style="display:flex;justify-content:space-between;margin-bottom:12px;color:#9ca3af;font-weight:bold;"><span>Items</span><span>' + cart.length + '</span></div>' +
            '<div style="display:flex;justify-content:space-between;font-weight:900;font-size:1.75rem;margin-top:32px;border-top:1px solid #1e293b;padding-top:24px;margin-bottom:32px;"><span>Total</span><span class="theme-text">$' + subtotal.toFixed(2) + '</span></div>' +
            '<button class="btn-primary" style="width:100%;padding:16px;border-radius:12px;font-weight:900;font-size:1.25rem;" data-go-checkout>CHECKOUT ➔</button>' +
            '</div></div>';
        cont.innerHTML = html;
    }

    // ====== CHECKOUT ======
    function nextCheckoutStep(step) {
        for (var i = 1; i <= 3; i++) {
            var el = $('checkoutStep' + i);
            if (el) el.style.display = i === step ? 'block' : 'none';
        }
        $('checkoutSuccess').style.display = 'none';

        var steps = document.querySelectorAll('.checkout-step');
        for (var j = 0; j < steps.length; j++) {
            var stepNum = parseInt(steps[j].dataset.step);
            if (stepNum <= step) steps[j].classList.add('active');
            else steps[j].classList.remove('active');
        }
        $('checkoutProgressLine').style.width = ((step - 1) * 50) + '%';

        if (step === 3) {
            var total = 0, listHTML = '';
            cart.forEach(function(item) {
                var p = item.salePrice || item.price;
                total += p;
                listHTML += '<div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:12px;font-weight:bold;color:#d1d5db;"><span>' + item.name + '</span><span>$' + p.toFixed(2) + '</span></div>';
            });
            $('checkoutSummaryList').innerHTML = listHTML;
            $('checkoutTotalDisplay').textContent = '$' + total.toFixed(2);
        }
    }

    function completeCheckout() {
        showToast('Authorizing Payment...', 'warning');
        setTimeout(function() {
            cart.forEach(function(item) {
                if (!library.some(function(l) { return l.id === item.id; })) library.push(item);
            });
            localStorage.setItem('gc_library', JSON.stringify(library));

            var orderTotal = cart.reduce(function(sum, i) { return sum + (i.salePrice || i.price); }, 0);
            adminStats.revenue += orderTotal;
            adminStats.orders += 1;
            localStorage.setItem('gc_admin_stats', JSON.stringify(adminStats));

            cart = [];
            localStorage.setItem('gc_cart', '[]');
            updateCartBadge();

            $('checkoutStep1').style.display = 'none';
            $('checkoutStep2').style.display = 'none';
            $('checkoutStep3').style.display = 'none';
            $('checkoutSuccess').style.display = 'block';
            $('checkoutProgressLine').style.width = '100%';

            showToast('Payment successful! Games added to library.', 'success');
        }, 1500);
    }

    // ====== LIBRARY ======
    function renderLibraryView() {
        $('libraryCountDisplay').textContent = library.length;
        var grid = $('libraryGrid');
        grid.innerHTML = '';
        if (library.length === 0) {
            grid.innerHTML = '<div class="col-span-full text-center glass-panel" style="padding:80px;border-radius:1.5rem;"><div style="font-size:4rem;margin-bottom:16px;color:#4b5563;">🗄️</div><h3 style="font-size:1.5rem;font-weight:900;color:#9ca3af;">Library is empty</h3><p style="color:#6b7280;margin-top:8px;">Purchase games to see them here.</p></div>';
            return;
        }
        var fragment = document.createDocumentFragment();
        library.forEach(function(game) { fragment.appendChild(createGameCard(game, 'library')); });
        grid.appendChild(fragment);
        attach3DTiltListeners();
    }

    // ====== ADMIN ======
    function renderAdminView() {
        $('adminRevenue').textContent = '$' + adminStats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 });
        $('adminOrders').textContent = adminStats.orders;
        var tbody = $('adminGameTable');
        tbody.innerHTML = '';
        var fragment = document.createDocumentFragment();
        allGames.forEach(function(g) {
            var tr = document.createElement('tr');
            tr.style.cssText = 'transition:background 0.2s;';
            tr.onmouseover = function() { tr.style.background = 'rgba(30,41,59,0.5)'; };
            tr.onmouseout = function() { tr.style.background = ''; };
            tr.innerHTML =
                '<td style="padding:16px 24px;display:flex;align-items:center;gap:12px;"><img src="' + g.imageUrl + '" style="width:40px;height:40px;border-radius:4px;object-fit:cover;"><span style="font-weight:bold;color:white;">' + g.name + '</span></td>' +
                '<td style="padding:16px 24px;"><span style="font-size:10px;font-weight:900;text-transform:uppercase;background:#1e293b;padding:4px 8px;border-radius:4px;color:#9ca3af;">' + g.genre + '</span></td>' +
                '<td style="padding:16px 24px;font-weight:900;">$' + (g.salePrice || g.price).toFixed(2) + '</td>' +
                '<td style="padding:16px 24px;text-align:right;">' +
                    '<button onclick="openAdminModal(' + g.id + ')" style="background:none;border:none;color:#6b7280;cursor:pointer;font-size:18px;margin:0 4px;" aria-label="Edit Game">✏️</button>' +
                    '<button onclick="deleteAdminGame(' + g.id + ')" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:18px;margin:0 4px;" aria-label="Delete Game">🗑️</button>' +
                '</td>';
            fragment.appendChild(tr);
        });
        tbody.appendChild(fragment);
    }

    function openAdminModal(id) {
        var modal = $('adminModal');
        var form = $('adminGameForm');
        if (!modal || !form) return;
        form.reset();
        
        if (id) {
            var g = allGames.find(function(game) { return game.id === id; });
            if (g) {
                $('adminModalTitle').textContent = 'Edit Game';
                $('adminGameId').value = g.id;
                $('adminGameName').value = g.name;
                $('adminGameGenre').value = g.genre;
                $('adminGamePrice').value = g.price;
                $('adminGameDesc').value = g.description;
                $('adminGameVideo').value = g.videoUrl || '';
            }
        } else {
            $('adminModalTitle').textContent = 'Add New Game';
            $('adminGameId').value = '';
        }
        modal.style.display = 'flex';
    }
    window.openAdminModal = openAdminModal;

    function closeAdminModal() {
        var modal = $('adminModal');
        if (modal) modal.style.display = 'none';
    }
    window.closeAdminModal = closeAdminModal;

    function saveAdminGame(e) {
        e.preventDefault();
        var id = $('adminGameId').value;
        var name = $('adminGameName').value.trim();
        var genre = $('adminGameGenre').value.trim();
        var price = parseFloat($('adminGamePrice').value);
        var desc = $('adminGameDesc').value.trim();
        var vid = $('adminGameVideo').value.trim();

        if (!name || !genre || isNaN(price) || !desc) {
            showToast('Invalid form data', 'error');
            return;
        }

        if (id) {
            var g = allGames.find(function(game) { return game.id === parseInt(id); });
            if (g) {
                g.name = name; g.genre = genre; g.price = price; g.description = desc;
                if (vid) g.videoUrl = vid;
                showToast('Game updated successfully', 'success');
            }
        } else {
            var newId = allGames.length > 0 ? Math.max.apply(Math, allGames.map(function(o) { return o.id; })) + 1 : 1;
            var colorHex = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
            allGames.unshift({
                id: newId, name: name, genre: genre, price: price, salePrice: null, rating: 0,
                imageUrl: 'https://placehold.co/600x400/' + colorHex + '/ffffff?text=' + encodeURIComponent(name.replace(/ /g, '+')),
                videoUrl: vid || 'https://static.videezy.com/system/resources/previews/000/038/853/original/Abstract_Blue_Background_4K.mp4',
                description: desc, releaseDate: Date.now(), featured: false,
                systemReq: { os: 'Windows 11', cpu: 'Quad Core', ram: '8GB', gpu: 'GTX 1060' }, reviews: []
            });
            showToast('New game added!', 'success');
        }
        localStorage.setItem('gc_all_games', JSON.stringify(allGames));
        closeAdminModal();
        renderAdminView();
    }

    function deleteAdminGame(id) {
        if (!confirm('Are you sure you want to delete this game?')) return;
        var idx = allGames.findIndex(function(g) { return g.id === id; });
        if (idx !== -1) {
            allGames.splice(idx, 1);
            localStorage.setItem('gc_all_games', JSON.stringify(allGames));
            showToast('Game deleted', 'success');
            renderAdminView();
        }
    }
    window.deleteAdminGame = deleteAdminGame;

    // ====== PROFILE ======
    function renderProfileView() {
        if (currentUser) {
            $('profileName').textContent = currentUser.fullName;
            $('profileEmail').textContent = currentUser.email;
            if (currentUser.avatar) $('profileAvatar').src = currentUser.avatar;
            if ($('profileMemberSince')) $('profileMemberSince').textContent = 'Member since: ' + currentUser.joinDate;
        }
        $('statLibraryCount').textContent = library.length;
        $('statWishlistCount').textContent = wishlist.length;
        $('statCartCount').textContent = cart.length;

        var wishGrid = $('profileWishlistGrid');
        wishGrid.innerHTML = '';
        if (wishlist.length === 0) {
            wishGrid.innerHTML = '<div class="col-span-full" style="text-align:center;padding:32px;color:#6b7280;font-weight:bold;">Wishlist is empty.</div>';
        } else {
            wishlist.forEach(function(g) { wishGrid.appendChild(createGameCard(g, 'store')); });
            attach3DTiltListeners();
        }
    }

    // ====== WISHLIST ======
    function toggleWishlist(id) {
        var game = allGames.find(function(g) { return g.id === id; });
        if (!game) return;
        var idx = -1;
        for (var i = 0; i < wishlist.length; i++) { if (wishlist[i].id === id) { idx = i; break; } }
        if (idx > -1) { wishlist.splice(idx, 1); showToast('Removed from wishlist', 'warning'); }
        else { wishlist.push(game); showToast('Added to wishlist!', 'success'); }
        localStorage.setItem('gc_wishlist', JSON.stringify(wishlist));

        if (currentView === 'all' || currentView === 'topSellers' || currentView === 'newReleases' || currentView === 'onSale') renderFilteredGrid();
        else if (currentView === 'account') renderProfileView();
        else if (currentView === 'gameDetail') renderGameDetailView(id);
    }

    // ====== HEADER AVATAR ======
    function updateHeaderAvatar() {
        var img = $('headerAvatar');
        if (!img) return;
        if (currentUser && currentUser.avatar) img.src = currentUser.avatar;
        else if (currentUser) img.src = 'https://placehold.co/36x36/1e293b/ffffff?text=' + currentUser.fullName.charAt(0).toUpperCase();
    }

    // ====== EVENT LISTENERS (ALL IN ONE PLACE) ======
    function setupEventListeners() {
        // Login & Register
        $('loginForm').addEventListener('submit', handleLogin);
        $('registerForm').addEventListener('submit', handleRegister);

        $('showRegisterLink').addEventListener('click', function(e) {
            e.preventDefault();
            $('loginPage').classList.add('hidden');
            $('registerPage').classList.remove('hidden');
        });
        $('showLoginLink').addEventListener('click', function(e) {
            e.preventDefault();
            $('registerPage').classList.add('hidden');
            $('loginPage').classList.remove('hidden');
        });

        // Avatar preview
        $('regProfilePhoto').addEventListener('change', function(e) {
            var file = e.target.files[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = function(ev) {
                    var preview = $('avatarPreview');
                    preview.src = ev.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });

        // Nav links
        document.querySelectorAll('.nav-link[data-view]').forEach(function(link) {
            link.addEventListener('click', function(e) { e.preventDefault(); switchView(link.dataset.view); });
        });
        document.querySelectorAll('[data-subview]').forEach(function(link) {
            link.addEventListener('click', function(e) { e.preventDefault(); switchView(link.dataset.subview); });
        });

        // Brand link
        $('brandLink').addEventListener('click', function() { switchView('all'); });

        // Cart, Profile, Logout
        $('cartNavBtn').addEventListener('click', function() { switchView('cart'); });
        $('profileNavBtn').addEventListener('click', function() { switchView('account'); });
        $('logoutButton').addEventListener('click', handleLogout);

        // Carousel
        $('prevSlide').addEventListener('click', function() { goToSlide(carouselIndex - 1); });
        $('nextSlide').addEventListener('click', function() { goToSlide(carouselIndex + 1); });

        // Filters
        $('priceFilter').addEventListener('input', function(e) {
            filterState.maxPrice = parseInt(e.target.value);
            $('priceLabel').textContent = filterState.maxPrice >= 100 ? 'Any Price' : 'Under $' + filterState.maxPrice;
            renderFilteredGrid();
        });
        document.querySelectorAll('.filter-rating-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.filter-rating-btn').forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');
                filterState.minRating = parseFloat(btn.dataset.rating);
                renderFilteredGrid();
            });
        });
        $('sortSelect').addEventListener('change', function(e) { filterState.sortBy = e.target.value; renderFilteredGrid(); });

        // Search
        $('searchInput').addEventListener('input', handleSearch);

        // Checkout buttons
        $('toStep2').addEventListener('click', function() { nextCheckoutStep(2); });
        $('backToStep1').addEventListener('click', function() { nextCheckoutStep(1); });
        $('toStep3').addEventListener('click', function() { nextCheckoutStep(3); });
        $('backToStep2').addEventListener('click', function() { nextCheckoutStep(2); });
        $('placeOrderBtn').addEventListener('click', completeCheckout);
        $('goToLibraryBtn').addEventListener('click', function() { switchView('library'); });

        // Theme buttons
        document.querySelectorAll('[data-theme]').forEach(function(btn) {
            btn.addEventListener('click', function() { setTheme(btn.dataset.theme, true); });
        });

        // Global form submit delegation
        document.addEventListener('submit', function(e) {
            if (e.target.id === 'adminGameForm') {
                saveAdminGame(e);
            }
            if (e.target.id === 'reviewForm') {
                e.preventDefault();
                var gId = parseInt(e.target.dataset.gameId);
                var rating = parseInt($('reviewRating').value);
                var text = $('reviewText').value.trim();
                if (!text) return;

                var game = allGames.find(function(g) { return g.id === gId; });
                if (game) {
                    if (!game.reviews) game.reviews = [];
                    game.reviews.push({ user: currentUser ? currentUser.username : 'Guest', rating: rating, text: text });
                    
                    // Recalculate rating simply
                    var sum = game.reviews.reduce(function(acc, rev) { return acc + rev.rating; }, 0) + (game.rating * 3); // weight original rating
                    game.rating = Math.min(5, sum / (game.reviews.length + 3));
                    
                    localStorage.setItem('gc_all_games', JSON.stringify(allGames));
                    showToast('Review posted!', 'success');
                    renderGameDetailView(gId);
                }
            }
        });

        // Global click delegation for dynamic elements
        document.addEventListener('click', function(e) {
            // Close search dropdown when clicking outside
            if (!e.target.closest('#searchInput') && !e.target.closest('#searchDropdown')) {
                var dd = $('searchDropdown');
                if (dd) dd.style.display = 'none';
            }

            // Game card click
            var gameClick = e.target.closest('[data-game-click]');
            if (gameClick) { e.preventDefault(); switchView('gameDetail', { id: parseInt(gameClick.dataset.gameClick) }); return; }

            // Add to cart
            var addCart = e.target.closest('[data-add-cart]');
            if (addCart) { e.stopPropagation(); addToCart(parseInt(addCart.dataset.addCart)); return; }

            // Wishlist on card
            var wishBtn = e.target.closest('[data-wish]');
            if (wishBtn) { e.stopPropagation(); toggleWishlist(parseInt(wishBtn.dataset.wish)); return; }

            // Wishlist toggle on detail page
            var wishToggle = e.target.closest('[data-wish-toggle]');
            if (wishToggle) { toggleWishlist(parseInt(wishToggle.dataset.wishToggle)); return; }

            // Remove from cart
            var removeCart = e.target.closest('[data-remove-cart]');
            if (removeCart) { cart.splice(parseInt(removeCart.dataset.removeCart), 1); localStorage.setItem('gc_cart', JSON.stringify(cart)); updateCartBadge(); renderCartView(); return; }

            // Back to store
            var backBtn = e.target.closest('[data-back-to-store]');
            if (backBtn) { switchView('all'); return; }

            // Browse store from cart
            var goStore = e.target.closest('[data-go-store]');
            if (goStore) { switchView('all'); return; }

            // Checkout from cart
            var goCheckout = e.target.closest('[data-go-checkout]');
            if (goCheckout) { switchView('checkout'); nextCheckoutStep(1); return; }

            // Library game action
            var actionGame = e.target.closest('[data-action-game]');
            if (actionGame) {
                e.stopPropagation();
                var gid = parseInt(actionGame.dataset.actionGame);
                var action = actionGame.dataset.action;
                var game = allGames.find(function(g) { return g.id === gid; });
                
                if (action === 'INSTALL') {
                    libraryState[gid] = 'downloading';
                    localStorage.setItem('gc_library_state', JSON.stringify(libraryState));
                    renderLibraryView();
                    showToast('Installing ' + (game ? game.name : 'game') + '...', 'warning');
                    
                    // Simulate download progress
                    setTimeout(function() {
                        libraryState[gid] = 'installed';
                        localStorage.setItem('gc_library_state', JSON.stringify(libraryState));
                        if (currentView === 'library') renderLibraryView();
                        showToast((game ? game.name : 'Game') + ' successfully installed!', 'success');
                    }, 4000);
                } else if (action === 'PLAY') {
                    showToast('Launching ' + (game ? game.name : 'game') + '...', 'success');
                }
                return;
            }
        });
    }

    // ====== MOCK DATA GENERATOR ======
    function generateMockGames() {
        var genres = ['Action', 'RPG', 'Strategy', 'Adventure', 'Simulation', 'Sports', 'Puzzle', 'Racing', 'Indie'];
        var videos = [
            'https://static.videezy.com/system/resources/previews/000/043/151/original/abstract-plexus-background.mp4',
            'https://static.videezy.com/system/resources/previews/000/038/853/original/Abstract_Blue_Background_4K.mp4'
        ];
        var names = [
            'Cyber Horizon', 'Dragon Legacy', 'Nova Strike', 'Shadow Realm', 'Iron Fortress',
            'Crystal Saga', 'Apex Storm', 'Neon Drive', 'Dark Frontier', 'Star Pulse',
            'Venom Rising', 'Phantom Edge', 'Blaze Runner', 'Frost Empire', 'Thunder Peak',
            'Solar Winds', 'Rogue Circuit', 'Titan Fall', 'Mystic Lands', 'Zero Gravity',
            'Blade Genesis', 'Ocean Depths', 'Plasma Core', 'War Echo', 'Night Shift',
            'Sky Forge', 'Quantum Break', 'Steel Horizon', 'Fire Storm', 'Pixel Quest'
        ];
        var games = [];
        for (var i = 0; i < 30; i++) {
            var price = Math.random() * 50 + 10;
            var onSale = Math.random() > 0.7;
            var colorHex = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
            games.push({
                id: i + 1,
                name: names[i],
                genre: genres[i % genres.length],
                price: price,
                salePrice: onSale ? price * 0.7 : null,
                rating: Math.random() * 2 + 3,
                imageUrl: 'https://placehold.co/600x400/' + colorHex + '/ffffff?text=' + encodeURIComponent(names[i].replace(/ /g, '+')),
                videoUrl: videos[i % 2],
                description: 'Dive into ' + names[i] + ', an epic ' + genres[i % genres.length].toLowerCase() + ' experience. Master new mechanics, explore vast worlds, and uncover deep storylines.',
                releaseDate: Date.now() - Math.random() * 10000000000,
                featured: i < 3,
                systemReq: { os: 'Windows 11', cpu: 'i7-10700K', ram: '16GB', gpu: 'RTX 3070' },
                reviews: []
            });
        }
        return games;
    }

})();
