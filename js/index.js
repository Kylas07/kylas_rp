
        // Update time
        function updateTime() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            document.getElementById('time').textContent = `${hours}:${minutes}`;
        }
        
        updateTime();
        setInterval(updateTime, 1000);

        // SPA Navigation
        const tablet = document.querySelector('.tablet');
        const homeScreen = document.querySelector('.home-screen');
        const pageContent = document.getElementById('pageContent');
        const backButton = document.getElementById('backButton');
        const apps = document.querySelectorAll('.app[data-page]');

        // Load a page
        function loadPage(pagePath) {
            // Expand tablet
            tablet.classList.add('expanded');
            
            // Hide home screen
            homeScreen.classList.add('hidden');
            
            // Show page content container
            pageContent.classList.add('active');
            
            // Show back button
            backButton.classList.add('visible');
            
            // Load content
            pageContent.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
            
            // Fetch the page
            fetch(pagePath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Page non trouvée : ${pagePath}`);
                    }
                    return response.text();
                })
                .then(html => {
                    // Create iframe to display content
                    pageContent.innerHTML = `<iframe srcdoc="${html.replace(/"/g, '&quot;')}"></iframe>`;
                })
                .catch(error => {
                    pageContent.innerHTML = `
                        <div style="padding: 40px; text-align: center; color: var(--text-light);">
                            <h2 style="font-size: 24px; margin-bottom: 16px;">⚠️ Erreur</h2>
                            <p style="font-size: 16px; opacity: 0.8;">${error.message}</p>
                            <p style="font-size: 14px; margin-top: 12px; opacity: 0.6;">Créez le fichier <code style="background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 4px;">${pagePath}</code> dans le même dossier que index.html</p>
                        </div>
                    `;
                });
        }

        // Go back to home
        function goHome() {
            // Shrink tablet
            tablet.classList.remove('expanded');
            
            // Show home screen
            homeScreen.classList.remove('hidden');
            
            // Hide page content
            pageContent.classList.remove('active');
            
            // Hide back button
            backButton.classList.remove('visible');
            
            // Clear content after animation
            setTimeout(() => {
                if (!pageContent.classList.contains('active')) {
                    pageContent.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
                }
            }, 600);
        }

        // Event listeners for apps
        apps.forEach(app => {
            app.addEventListener('click', (e) => {
                e.preventDefault();
                const pagePath = app.getAttribute('data-page');
                
                // Don't reload if clicking home icon
                if (pagePath === 'index.html') {
                    goHome();
                } else {
                    loadPage(pagePath);
                }
            });
        });

        // Back button event
        backButton.addEventListener('click', goHome);
   