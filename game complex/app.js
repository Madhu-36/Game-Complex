
        // --- DOM Element References ---
        const loginPage = document.getElementById('loginPage');
        const mainPage = document.getElementById('mainPage');
        const loginForm = document.getElementById('loginForm');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const logoutButton = document.getElementById('logoutButton');
        const messageBox = document.getElementById('messageBox');
        const contentArea = document.getElementById('contentArea');
        const mainNavList = document.getElementById('mainNavList');
        // Genre dropdown is now the "Featured" dropdown in the new HTML
        const featuredGenreDropdown = document.getElementById('featuredGenreDropdown');
        const searchInput = document.getElementById('searchInput');
        const passwordRequirementsDiv = document.getElementById('passwordRequirements');
        // Updated password requirement element IDs based on user file
        const requirements = {
            length: document.getElementById('req-length'),
            upper: document.getElementById('req-capital'),
            lower: document.getElementById('req-lower'), // Added based on common practice
            number: document.getElementById('req-number'),
            special: document.getElementById('req-special') // Mapped from user file's req-chars/special
        };

        // --- Application State ---
        let currentView = 'all'; // Default view matches 'All Games' link
        let currentGenre = ''; // Tracks the selected genre from featured dropdown
        let currentSearchTerm = '';
        let allGames = []; // Holds all game data

        // --- Simulated Game Data ---
        function generateMockGames() {
            const genres = ["Action", "RPG", "Strategy", "Adventure", "Simulation", "Sports", "Puzzle", "Racing", "Indie", "MMO"];
            const conditions = ["New", "Like New", "Good", "Acceptable"];
            const names = ["Galaxy Warriors", "Mystic Quest", "Cyber Runners", "Kingdom Fall", "Space Tycoon", "Pro Soccer 2025", "Block Blitz", "Nitro Speedsters", "Dragon's Hoard", "Jungle Escape", "Zombie Outbreak", "City Builders", "Fantasy Arena", "Cosmic Drift", "Ancient Scrolls", "Pixel Pioneers", "Mech Combat X", "Island Survival", "Starship Commander", "Dungeon Delve Online"];
            const games = [];
            let salesCount = 0; // Track number of sales generated
            const maxSales = 15; // Max number of games to put on sale

            for (let i = 1; i <= 60; i++) { // Generate more games
                const genre = genres[Math.floor(Math.random() * genres.length)];
                const name = names[Math.floor(Math.random() * names.length)] + ` ${i}`;
                const price = (Math.random() * 50 + 10).toFixed(2); // 10.00 - 60.00
                // Ensure a decent number of sales, but not too many
                const makeOnSale = (Math.random() > 0.65 && salesCount < maxSales);
                let salePrice = null;
                if (makeOnSale) {
                    salePrice = (price * (Math.random() * 0.3 + 0.5)).toFixed(2); // 50-80% of original
                    salesCount++;
                }

                games.push({
                    id: i,
                    name: name,
                    genre: genre,
                    price: parseFloat(price),
                    salePrice: salePrice ? parseFloat(salePrice) : null,
                    imageUrl: `https://placehold.co/300x200/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=${encodeURIComponent(name.substring(0,15))}`,
                    description: `Description for ${name}. A thrilling ${genre.toLowerCase()} game.`,
                    condition: conditions[Math.floor(Math.random() * conditions.length)],
                    // More realistic release dates (within last 2 years)
                    releaseDate: new Date(Date.now() - Math.floor(Math.random() * 365 * 2 * 24 * 60 * 60 * 1000)),
                    featured: Math.random() > 0.8, // 20% chance featured
                    // Simulate sales figures for "Top Sellers"
                    salesCount: Math.floor(Math.random() * 5000) + 500 // 500 - 5500 sales
                });
            }
            // Sort by release date initially for easy access to "New Releases"
            games.sort((a, b) => b.releaseDate - a.releaseDate);
            console.log(`DEBUG: Generated ${games.length} mock games.`);
            // console.log('DEBUG: Generated games array:', games); // Keep this log for debugging
            return games;
        }

        // --- Utility Functions ---
        function showMessage(message, type = 'success', duration = 3000) {
            messageBox.textContent = message;
            messageBox.className = `message-box ${type} show`; // Add show class immediately
            // Hide after duration
            setTimeout(() => {
                messageBox.classList.remove('show');
            }, duration);
        }

        // --- Password Validation ---
        function updatePasswordFeedback(password) {
            // Check if requirement elements are available
            const elementsExist = Object.values(requirements).every(el => el !== null);
            if (!elementsExist) {
                 // Try to re-query elements if they were null initially
                 requirements.length = document.getElementById('req-length');
                 requirements.upper = document.getElementById('req-capital');
                 requirements.lower = document.getElementById('req-lower');
                 requirements.number = document.getElementById('req-number');
                 requirements.special = document.getElementById('req-special');
                 if (!Object.values(requirements).every(el => el !== null)) {
                    console.warn("DEBUG: Password requirement elements still not found.");
                    return false; // Cannot validate
                 }
            }

            const lengthValid = password.length >= 8;
            const upperValid = /[A-Z]/.test(password);
            const lowerValid = /[a-z]/.test(password); // Added check
            const numberValid = /[0-9]/.test(password);
            const specialValid = /[!@#$%^&*]/.test(password); // Using common special chars

            updateRequirement(requirements.length, lengthValid);
            updateRequirement(requirements.upper, upperValid);
            updateRequirement(requirements.lower, lowerValid); // Update lower requirement
            updateRequirement(requirements.number, numberValid);
            updateRequirement(requirements.special, specialValid);

            return lengthValid && upperValid && lowerValid && numberValid && specialValid;
        }

        function updateRequirement(element, isValid) {
             if (!element) return; // Guard clause
            element.classList.remove(isValid ? 'invalid' : 'valid');
            element.classList.add(isValid ? 'valid' : 'invalid');
        }


        // --- Rendering Functions ---

        function createGameCard(game, isGrid = false) {
            const cardWrapper = document.createElement('li');
            // Tailwind classes for height based on context
            const imageHeightClass = isGrid ? 'h-[150px]' : 'h-[120px]';

            // Apply Tailwind classes directly for wrapper if needed, or keep it simple
            cardWrapper.className = 'game-card-wrapper';

            cardWrapper.innerHTML = `
                <div class="game-card bg-gray-800 border border-gray-700 rounded-lg overflow-hidden flex flex-col h-full transition-transform duration-200 ease-in-out hover:transform hover:-translate-y-1 hover:shadow-lg">
                    <img src="${game.imageUrl}" alt="${game.name}" class="w-full ${imageHeightClass} object-cover" onerror="this.onerror=null; this.src='https://placehold.co/300x200/cccccc/ffffff?text=Img+Error';" loading="lazy">
                    <div class="caption p-3 flex-grow flex flex-col">
                        <h3 class="${isGrid ? 'text-base' : 'text-sm'} font-semibold text-gray-50 mb-1 truncate" title="${game.name}">${game.name}</h3>
                        <p class="genre text-xs text-gray-400 mb-2">${game.genre}</p>
                        <div class="details mt-auto flex justify-between items-center text-sm">
                            <span class="price ${game.salePrice ? 'text-emerald-400' : 'text-blue-400'} font-bold">
                                $${game.salePrice ? game.salePrice.toFixed(2) : game.price.toFixed(2)}
                                ${game.salePrice ? `<span class="original-price text-gray-500 text-xs ml-1 line-through">$${game.price.toFixed(2)}</span>` : ''}
                            </span>
                            <button class="btn btn-primary btn-sm !py-1 !px-2 !text-xs buy-button" data-id="${game.id}">Buy</button>
                        </div>
                    </div>
                </div>
            `;
             // Add event listener for the buy button
            cardWrapper.querySelector('.buy-button').addEventListener('click', (e) => {
                e.stopPropagation();
                showMessage(`Added "${game.name}" to cart (simulation).`);
                console.log("Buy button clicked for game ID:", game.id);
            });
            return cardWrapper;
        }

        function renderGameRow(games, targetElementId) {
            const rowElement = document.getElementById(targetElementId);
            if (!rowElement) {
                console.error(`Target element #${targetElementId} not found for game row.`);
                return;
            }
            // console.log(`DEBUG: Rendering ${games?.length ?? 0} games into row #${targetElementId}`); // More concise log
            rowElement.innerHTML = ''; // Clear previous
            if (!games || games.length === 0) {
                rowElement.innerHTML = '<div class="no-games-message">No games found.</div>';
                return;
            }
            console.log(`DEBUG: Appending ${games.length} game cards to #${targetElementId}`); // Log before loop
            games.forEach(game => {
                rowElement.appendChild(createGameCard(game, false)); // isGrid = false
            });
        }

        function renderGameGrid(games, targetElementId) {
            const gridElement = document.getElementById(targetElementId);
             if (!gridElement) {
                console.error(`Target element #${targetElementId} not found for game grid.`);
                return;
            }
            // console.log(`DEBUG: Rendering ${games?.length ?? 0} games into grid #${targetElementId}`); // More concise log
            gridElement.innerHTML = ''; // Clear previous
            if (!games || games.length === 0) {
                gridElement.innerHTML = '<div class="no-games-message">No games found matching criteria.</div>';
                return;
            }
            console.log(`DEBUG: Appending ${games.length} game cards to #${targetElementId}`); // Log before loop
            games.forEach(game => {
                gridElement.appendChild(createGameCard(game, true)); // isGrid = true
            });
        }

        // Populates the "Featured" dropdown (which acts as genre filter)
        function populateGenreDropdown() {
            if (!allGames || allGames.length === 0) {
                 console.warn("DEBUG: Cannot populate featured genres, allGames is empty.");
                 if (featuredGenreDropdown) featuredGenreDropdown.innerHTML = '<div class="no-games-message p-2 text-xs">No genres available.</div>';
                 return;
            }
             // Get unique genres from *featured* games only
            const featuredGames = allGames.filter(g => g.featured);
            const genres = [...new Set(featuredGames.map(game => game.genre))].sort();

            if (!featuredGenreDropdown) return; // Exit if dropdown element not found

            featuredGenreDropdown.innerHTML = ''; // Clear existing

            // Add "All Featured" link first
             const allLink = document.createElement('a');
             allLink.href = '#';
             allLink.className = 'genre-link block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-md';
             allLink.textContent = 'All Featured';
             allLink.dataset.genre = 'all-featured'; // Special value
             featuredGenreDropdown.appendChild(allLink);


            if (genres.length === 0) {
                 // Still add a message if no specific genres found among featured
                 const noGenresMsg = document.createElement('div');
                 noGenresMsg.className = 'no-games-message p-2 text-xs';
                 noGenresMsg.textContent = 'No specific featured genres.';
                 featuredGenreDropdown.appendChild(noGenresMsg);
                 // console.log("DEBUG: Populated featured genre dropdown (no specific genres)."); // Log completion
                 return;
            }

            genres.forEach(genre => {
                const link = document.createElement('a');
                link.href = '#';
                link.className = 'genre-link block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-md';
                link.textContent = genre;
                link.dataset.genre = genre;
                featuredGenreDropdown.appendChild(link);
            });
             // console.log("DEBUG: Populated featured genre dropdown."); // Log completion
        }

        // --- View Switching Logic ---
        function switchView(viewName, data = null) {
            console.log(`DEBUG: Attempting to switch view to: ${viewName}`, data ?? '');

            // 1. Hide all content sections
            document.querySelectorAll('#contentArea > .content-section').forEach(section => {
                section.classList.remove('active');
            });

            // 2. Deactivate all nav links/buttons
            document.querySelectorAll('#mainNavList .nav-link, #mainNavList .has-dropdown > button').forEach(link => {
                link.classList.remove('active');
            });
            // Deactivate genre links in dropdown too
             if (featuredGenreDropdown) {
                featuredGenreDropdown.querySelectorAll('.genre-link').forEach(link => {
                    link.classList.remove('active');
                });
             }


            // 3. Activate the target section
            const targetSection = document.getElementById(`${viewName}View`); // Assumes viewName matches ID prefix
            let activeNavLink = document.querySelector(`.nav-link[data-view='${viewName}']`); // Find corresponding nav link in main nav

            if (targetSection) {
                targetSection.classList.add('active'); // Show the target section
                console.log(`DEBUG: Activated section: #${targetSection.id}`);

                // 4. Render content based on the view
                // Ensure allGames is available for views that need it
                 if ((!allGames || allGames.length === 0) && ['all', 'genre', 'topSellers', 'onSale', 'newReleases', 'search'].includes(viewName)) {
                     console.error(`DEBUG: Cannot render view '${viewName}', allGames is empty!`);
                     targetSection.innerHTML = '<div class="no-games-message">Error loading game data. Please try logging in again.</div>';
                     // Activate the nav link even if content fails to render
                     if (activeNavLink) activeNavLink.classList.add('active');
                     currentView = viewName; // Update view state
                     return; // Stop further processing for this view
                 }


                switch (viewName) {
                    case 'all':
                        console.log("DEBUG: Rendering 'all' view content.");
                        // Render the sections within the 'allView' container
                        renderGameRow(allGames.filter(g => g.featured).slice(0, 10), 'featuredGamesRow');
                        renderGameRow(allGames.slice(0, 10), 'newReleasesRow'); // Assumes sorted by date
                        renderGameGrid(allGames, 'allGamesGrid');
                        break;
                    case 'genre': // This view is now triggered by the featured dropdown
                        console.log("DEBUG: Rendering 'genre' view content.");
                        if (data && data.genre) {
                            currentGenre = data.genre;
                            let genreGames;
                            const genreTitleElement = document.getElementById('genreTitle'); // Get title element

                            if(currentGenre === 'all-featured') {
                                if(genreTitleElement) genreTitleElement.textContent = `All Featured Games`;
                                genreGames = allGames.filter(game => game.featured);
                            } else {
                                if(genreTitleElement) genreTitleElement.textContent = `Featured ${currentGenre} Games`;
                                genreGames = allGames.filter(game => game.genre === currentGenre && game.featured);
                            }
                            renderGameGrid(genreGames, 'genreGamesGrid');

                            // Highlight the 'Featured' button in the main nav
                            const featuredButton = document.querySelector('#mainNavList button[data-view="featured"]'); // Find the button
                            if (featuredButton) featuredButton.classList.add('active');
                            // Highlight the specific genre link in the dropdown
                            if (featuredGenreDropdown) {
                                const activeGenreLink = featuredGenreDropdown.querySelector(`.genre-link[data-genre='${currentGenre}']`);
                                if (activeGenreLink) activeGenreLink.classList.add('active');
                            }
                            activeNavLink = null; // Don't activate a main nav link for genre view

                        } else {
                            console.error("Genre view switched without genre data.");
                            switchView('all'); // Fallback
                            return;
                        }
                        break;
                    case 'search': // Triggered by search input
                         console.log("DEBUG: Rendering 'search' view content.");
                        currentSearchTerm = searchInput ? searchInput.value.trim() : ''; // Get current search term safely
                        const searchTitleElement = document.getElementById('searchTitle');
                        if(searchTitleElement) searchTitleElement.textContent = `Search Results for "${currentSearchTerm}"`;

                        if (currentSearchTerm) {
                            const searchResults = allGames.filter(game =>
                                game.name.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
                                game.genre.toLowerCase().includes(currentSearchTerm.toLowerCase())
                            );
                            renderGameGrid(searchResults, 'searchGamesGrid');
                        } else {
                            renderGameGrid([], 'searchGamesGrid'); // Clear grid
                            const gridElement = document.getElementById('searchGamesGrid');
                             if(gridElement) gridElement.innerHTML = '<div class="no-games-message">Enter a search term above.</div>';
                        }
                        activeNavLink = null; // No specific nav link for search results view itself
                        break;
                    case 'topSellers':
                        console.log("DEBUG: Rendering 'topSellers' view content.");
                        const topSellers = [...allGames].sort((a, b) => b.salesCount - a.salesCount).slice(0, 20); // Top 20
                        renderGameGrid(topSellers, 'topSellersGrid');
                        break;
                    case 'onSale':
                        console.log("DEBUG: Rendering 'onSale' view content.");
                        const onSaleGames = allGames.filter(game => game.salePrice !== null);
                        renderGameGrid(onSaleGames, 'onSaleGrid');
                        break;
                    case 'newReleases':
                        console.log("DEBUG: Rendering 'newReleases' view content.");
                        const newReleases = allGames.slice(0, 20); // First 20 are newest (already sorted)
                        renderGameGrid(newReleases, 'newReleasesGrid');
                        break;
                    // Handle placeholder views if needed
                    case 'sell':
                    case 'account':
                         console.log(`DEBUG: Switching to placeholder view '${viewName}'.`);
                         // Content is already in HTML, just ensure view is active
                         break;
                    default:
                        console.warn(`Unknown view name: ${viewName}. Switching to 'all'.`);
                        switchView('all'); // Fallback to 'all'
                        return; // Exit early
                }

                 // 5. Activate the corresponding nav link (if found and not handled above)
                 if (activeNavLink) {
                     activeNavLink.classList.add('active');
                     console.log(`DEBUG: Activated nav link:`, activeNavLink);
                 } else if (viewName !== 'search' && viewName !== 'genre') {
                      console.log(`DEBUG: No specific nav link found or needed for view: ${viewName}`);
                 }


                currentView = viewName; // Update the current view state
                console.log(`DEBUG: View successfully switched to: ${currentView}`);
                window.scrollTo(0, 0); // Scroll to top on view change

            } else {
                console.error(`Target section #${viewName}View not found!`);
                if (currentView !== 'all') { // Prevent infinite loop if 'all' is missing
                   switchView('all');
                }
            }
        }


        // --- Event Handlers ---
        function handleLogin(event) {
            event.preventDefault();
            const username = usernameInput.value.trim();
            const password = passwordInput.value;

            const isPasswordValid = updatePasswordFeedback(password);

            if (username && isPasswordValid) {
                localStorage.setItem('isLoggedIn', 'true');
                if(loginPage) loginPage.classList.add('hidden');
                if(mainPage) mainPage.classList.remove('hidden');
                showMessage('Login successful!', 'success');

                // Initialize main page content AFTER successful login and page is visible
                allGames = generateMockGames(); // Generate game data *first*
                populateGenreDropdown();        // Populate dropdowns *second*

                // --- Direct Initial Render (Test) ---
                // Instead of switchView('all'), render directly
                console.log("DEBUG: Performing direct initial render for 'all' view.");
                const allViewSection = document.getElementById('allView');
                const allNavLink = document.querySelector(".nav-link[data-view='all']");

                // 1. Activate the 'allView' section
                document.querySelectorAll('#contentArea > .content-section').forEach(section => section.classList.remove('active'));
                if (allViewSection) allViewSection.classList.add('active');

                // 2. Deactivate other nav links and activate 'all'
                document.querySelectorAll('#mainNavList .nav-link, #mainNavList .has-dropdown > button').forEach(link => link.classList.remove('active'));
                 if (allNavLink) allNavLink.classList.add('active');

                // 3. Render content directly into 'allView'
                 if (!allGames || allGames.length === 0) {
                     console.error("DEBUG: Cannot perform initial render, allGames is empty!");
                     if(allViewSection) allViewSection.innerHTML = '<div class="no-games-message">Error loading game data. Please try logging in again.</div>';
                 } else {
                     renderGameRow(allGames.filter(g => g.featured).slice(0, 10), 'featuredGamesRow');
                     renderGameRow(allGames.slice(0, 10), 'newReleasesRow');
                     renderGameGrid(allGames, 'allGamesGrid');
                 }
                 currentView = 'all'; // Set current view state
                 console.log("DEBUG: Direct initial render complete.");
                 window.scrollTo(0, 0); // Scroll to top
                // --- End Direct Initial Render (Test) ---

                // Original call (commented out for test):
                // switchView('all'); // Show the default 'all' view *last*

            } else if (!username) {
                 showMessage('Please enter a username or email.', 'error');
            } else {
                showMessage('Password does not meet requirements.', 'error');
            }
        }

        function handleLogout() {
            localStorage.removeItem('isLoggedIn');
            if(mainPage) mainPage.classList.add('hidden');
            if(loginPage) loginPage.classList.remove('hidden');
            if(usernameInput) usernameInput.value = '';
            if(passwordInput) passwordInput.value = '';
            updatePasswordFeedback(''); // Reset feedback
            showMessage('You have been logged out.', 'success');
            // Clear game data and UI elements
            allGames = [];
            if(featuredGenreDropdown) featuredGenreDropdown.innerHTML = '<div class="no-games-message p-2 text-xs">Login to see genres.</div>';
            // Clear all content sections to be safe
            document.querySelectorAll('#contentArea > .content-section').forEach(section => {
                section.innerHTML = '<div class="no-games-message">Please log in.</div>'; // Clear content
                section.classList.remove('active');
            });
            console.log("DEBUG: User logged out, state cleared.");
        }

        // Handles clicks on main navigation links (<a> tags)
        function handleNavClick(event) {
            const targetLink = event.target.closest('a.nav-link'); // Find the clicked anchor link

            if (targetLink) {
                 event.preventDefault(); // Prevent default anchor behavior
                 const view = targetLink.dataset.view;
                 if (view && view !== currentView) { // Only switch if view is different
                     switchView(view);
                 } else if (view && view === currentView) {
                     console.log(`DEBUG: Already in view '${view}'. No switch needed.`);
                 }
            }
            // Clicks on dropdown buttons are handled implicitly by hover CSS or separate listeners if needed
        }

         // Handles clicks within the "Featured" dropdown links
         function handleFeaturedGenreClick(event) {
             const targetLink = event.target.closest('a.genre-link');
             if (targetLink) {
                 event.preventDefault();
                 const genre = targetLink.dataset.genre;
                 if (genre) {
                     // Switch to the 'genre' view, passing the selected genre
                     // Check if already viewing this genre to avoid unnecessary re-renders
                     if (currentView !== 'genre' || currentGenre !== genre) {
                        switchView('genre', { genre: genre });
                     } else {
                         console.log(`DEBUG: Already viewing featured genre '${genre}'. No switch needed.`);
                     }
                     // Manually close dropdown if needed (Tailwind might require JS for click-based closing)
                     // Consider adding focus management to close dropdown on blur/escape
                 }
             }
         }


        function handleSearch(event) {
            // Use 'input' event for real-time feedback as user types
            const searchTerm = event.target.value.trim().toLowerCase();

            // Debounce search slightly to avoid excessive switching on fast typing
            clearTimeout(handleSearch.debounceTimeout);
            handleSearch.debounceTimeout = setTimeout(() => {
                currentSearchTerm = searchTerm; // Update state inside debounce

                if (searchTerm) {
                    // Switch to search view or update if already there
                    if (currentView !== 'search') {
                        switchView('search');
                    } else {
                        // Already in search view, just re-render grid
                        console.log("DEBUG: Updating search results in place.");
                        const searchResults = allGames.filter(game =>
                            game.name.toLowerCase().includes(searchTerm) ||
                            game.genre.toLowerCase().includes(searchTerm)
                        );
                        renderGameGrid(searchResults, 'searchGamesGrid');
                        const searchTitleElement = document.getElementById('searchTitle');
                        if(searchTitleElement) searchTitleElement.textContent = `Search Results for "${searchTerm}"`;
                    }
                } else {
                    // If search term is cleared, go back to 'all' view
                    if (currentView === 'search') {
                        switchView('all');
                    }
                }
            }, 300); // 300ms debounce delay
        }

        // Add scroll button functionality
        function setupScrollButtons() {
             document.querySelectorAll('.scroller-button').forEach(button => {
                button.addEventListener('click', () => {
                    const targetId = button.dataset.target;
                    const row = document.getElementById(targetId);
                    if (row) {
                        const scrollAmount = row.offsetWidth * 0.75;
                        const direction = button.classList.contains('left') ? -1 : 1;
                        row.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
                    }
                });
            });
        }

        // --- Initialization ---
        document.addEventListener('DOMContentLoaded', () => {
            console.log("DEBUG: DOMContentLoaded event fired.");

            // Initial setup that doesn't depend on login state
            setupScrollButtons();

             // Add listener for password input validation (ensure element exists first)
             if (passwordInput) {
                passwordInput.addEventListener('input', (e) => {
                    updatePasswordFeedback(e.target.value);
                });
             } else {
                 console.warn("DEBUG: Password input not found on DOMContentLoaded!");
             }


            // Check login status and set up page accordingly
            if (localStorage.getItem('isLoggedIn') === 'true') {
                console.log("DEBUG: User is logged in. Initializing main page.");
                // Ensure login page is hidden and main page is shown
                if (loginPage) loginPage.classList.add('hidden');
                if (mainPage) mainPage.classList.remove('hidden');

                // Generate data, populate UI
                allGames = generateMockGames();
                populateGenreDropdown();

                 // --- Direct Initial Render (Test) ---
                 console.log("DEBUG: Performing direct initial render for 'all' view.");
                 const allViewSection = document.getElementById('allView');
                 const allNavLink = document.querySelector(".nav-link[data-view='all']");

                 // 1. Activate the 'allView' section
                 document.querySelectorAll('#contentArea > .content-section').forEach(section => section.classList.remove('active'));
                 if (allViewSection) allViewSection.classList.add('active');
                 else console.error("DEBUG: Initial render failed - #allView not found!");

                 // 2. Deactivate other nav links and activate 'all'
                 document.querySelectorAll('#mainNavList .nav-link, #mainNavList .has-dropdown > button').forEach(link => link.classList.remove('active'));
                  if (allNavLink) allNavLink.classList.add('active');
                  else console.error("DEBUG: Initial render failed - 'All Games' nav link not found!");

                 // 3. Render content directly into 'allView'
                  if (!allGames || allGames.length === 0) {
                      console.error("DEBUG: Cannot perform initial render, allGames is empty!");
                      if(allViewSection) allViewSection.innerHTML = '<div class="no-games-message">Error loading game data. Please try logging in again.</div>';
                  } else {
                      renderGameRow(allGames.filter(g => g.featured).slice(0, 10), 'featuredGamesRow');
                      renderGameRow(allGames.slice(0, 10), 'newReleasesRow');
                      renderGameGrid(allGames, 'allGamesGrid');
                  }
                  currentView = 'all'; // Set current view state
                  console.log("DEBUG: Direct initial render complete.");
                  window.scrollTo(0, 0); // Scroll to top
                 // --- End Direct Initial Render (Test) ---

                // Original call (commented out for test):
                // switchView('all');

                console.log("DEBUG: Main page initialization complete.");
            } else {
                console.log("DEBUG: User is not logged in. Showing login page.");
                 // Ensure main page is hidden and login page is shown
                if (mainPage) mainPage.classList.add('hidden');
                if (loginPage) loginPage.classList.remove('hidden');
                // Set initial state for password feedback only if login page is shown
                updatePasswordFeedback('');
            }

            // Attach event listeners (ensure elements exist)
            if (loginForm) loginForm.addEventListener('submit', handleLogin);
            if (logoutButton) logoutButton.addEventListener('click', handleLogout);
            if (searchInput) searchInput.addEventListener('input', handleSearch);

            // Use event delegation on static parent elements for nav links
            if (mainNavList) mainNavList.addEventListener('click', handleNavClick);
            if (featuredGenreDropdown) featuredGenreDropdown.addEventListener('click', handleFeaturedGenreClick);

        });

    
// --- Game Details Modal Logic ---
const modalOverlay = document.getElementById('gameModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalGenre = document.getElementById('modalGenre');
const modalPrice = document.getElementById('modalPrice');

function openModal(gameId) {
    const game = allGames.find(g => g.id == gameId);
    if (!game) return;
    
    modalImage.src = game.imageUrl || 'https://placehold.co/600x400/cccccc/ffffff?text=' + encodeURIComponent(game.name);
    modalTitle.textContent = game.name;
    modalGenre.textContent = game.genre;
    
    if (game.salePrice) {
        modalPrice.innerHTML = `$${game.salePrice.toFixed(2)} <span style="text-decoration: line-through; color: #9ca3af; font-size: 0.8rem; margin-left: 0.5rem;">$${game.price.toFixed(2)}</span>`;
    } else {
        modalPrice.textContent = `$${game.price.toFixed(2)}`;
    }
    
    modalOverlay.classList.add('active');
}

function closeModal() {
    modalOverlay.classList.remove('active');
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
}

if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
}

// Modify global renderGameGrid and renderGameRow to attach click listeners
const attachCardListeners = () => {
    document.querySelectorAll('.game-card').forEach(card => {
        // Prevent multiple attachments
        if (card.dataset.listenerAttached === 'true') return;
        
        card.addEventListener('click', (e) => {
            // Ignore if clicking on buy button
            if (e.target.closest('.buy-button')) return;
            
            const btn = card.querySelector('.buy-button');
            if (btn && btn.dataset.id) {
                openModal(btn.dataset.id);
            }
        });
        card.dataset.listenerAttached = 'true';
        card.style.cursor = 'pointer';
    });
};

// We intercept the original DOMContentLoaded to attach mutation observer or timeout to attach listeners after render
document.addEventListener('DOMContentLoaded', () => {
    // A simple observer to attach listeners whenever game cards are added
    const observer = new MutationObserver(() => {
        attachCardListeners();
    });
    const contentArea = document.getElementById('contentArea');
    if (contentArea) {
        observer.observe(contentArea, { childList: true, subtree: true });
    }
});
