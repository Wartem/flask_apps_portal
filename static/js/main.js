// static/js/main.js

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Lucide icons
    lucide.createIcons();

    // Theme toggling
    const themeToggle = document.getElementById('themeToggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    function setTheme(isDark) {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    // Initialize theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme === 'dark');
    } else {
        setTheme(prefersDark.matches);
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        setTheme(currentTheme === 'light' || !currentTheme);
    });

    // Listen for system theme changes
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches);
        }
    });

    // View toggling
    const gridViewBtn = document.getElementById('gridView');
    const listViewBtn = document.getElementById('listView');
    const servicesContainer = document.getElementById('servicesContainer');

    gridViewBtn.addEventListener('click', () => {
        servicesContainer.classList.remove('list-view');
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        localStorage.setItem('view', 'grid');
    });

    listViewBtn.addEventListener('click', () => {
        servicesContainer.classList.add('list-view');
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
        localStorage.setItem('view', 'list');
    });

    // Initialize view
    const savedView = localStorage.getItem('view');
    if (savedView === 'list') {
        listViewBtn.click();
    }

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const serviceCards = document.querySelectorAll('.service-card');

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();

        serviceCards.forEach(card => {
            const name = card.getAttribute('data-name');
            const tags = card.getAttribute('data-tags');
            const isMatch = name.includes(searchTerm) || tags.includes(searchTerm);
            card.style.display = isMatch ? '' : 'none';
        });
    });

    // Category filtering
    const categoryFilter = document.getElementById('categoryFilter');

    categoryFilter.addEventListener('change', () => {
        const selectedCategory = categoryFilter.value.toLowerCase();

        serviceCards.forEach(card => {
            const category = card.getAttribute('data-category');
            card.style.display = !selectedCategory || category === selectedCategory ? '' : 'none';
        });
    });

    // Copy URL functionality
    const copyButtons = document.querySelectorAll('.copy-url');

    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
    
        let success = false;
        try {
            success = document.execCommand('copy');
        } catch (err) {
            console.error('Fallback: Unable to copy', err);
        }
    
        document.body.removeChild(textArea);
        return success;
    }
    
    function copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text)
                .then(() => true)
                .catch((err) => {
                    console.error('Async: Unable to copy', err);
                    return fallbackCopyTextToClipboard(text);
                });
        }
        return Promise.resolve(fallbackCopyTextToClipboard(text));
    }

    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const url = button.getAttribute('data-url');
            if (!url) {
                showToast('No URL to copy', 'error');
                return;
            }
    
            const icon = button.querySelector('i[data-lucide]');
            if (!icon) {
                // If no icon is found, just copy without icon feedback
                copyToClipboard(url).then(success => {
                    if (success) {
                        showToast('URL copied to clipboard!', 'success');
                    } else {
                        showToast('Failed to copy URL', 'error');
                    }
                });
                return;
            }
    
            copyToClipboard(url).then(success => {
                if (success) {
                    // Store original icon name
                    const originalIcon = icon.getAttribute('data-lucide') || 'copy';
                    
                    // Change icon to show success
                    icon.setAttribute('data-lucide', 'check');
                    lucide.createIcons();
                    showToast('URL copied to clipboard!', 'success');
    
                    // Revert icon after 1 second
                    setTimeout(() => {
                        icon.setAttribute('data-lucide', originalIcon);
                        lucide.createIcons();
                    }, 1000);
                } else {
                    showToast('Failed to copy URL', 'error');
                }
            });
        });
    });

    // Live status updates
    function updateServiceStatuses() {
        fetch('/api/services')
            .then(response => response.json())
            .then(services => {
                services.forEach(service => {
                    const card = document.querySelector(`[data-name="${service.name.toLowerCase()}"]`);
                    if (card) {
                        const statusIndicator = card.querySelector('.status-indicator');
                        statusIndicator.className = `status-indicator status-${service.status}`;
                        statusIndicator.innerHTML = `
                            ${service.status.toUpperCase()}
                            ${service.response_time ? `<span class="response-time">${Math.round(service.response_time)}ms</span>` : ''}
                        `;

                        const lastChecked = card.querySelector('.last-checked');
                        lastChecked.textContent = `Last checked: ${service.last_checked || 'Never'}`;
                    }
                });
            })
            .catch(error => {
                console.error('Failed to update service statuses:', error);
                showToast('Failed to update service statuses', 'error');
            });
    }

    // Update stats in footer
    function updateStats() {
        fetch('/api/stats')
            .then(response => response.json())
            .then(stats => {
                document.querySelector('.stats').innerHTML = `
                    <div class="stat-item">
                        <i data-lucide="server"></i>
                        <span>Total: ${stats.total}</span>
                    </div>
                    <div class="stat-item online">
                        <i data-lucide="check-circle"></i>
                        <span>Online: ${stats.online}</span>
                    </div>
                    <div class="stat-item offline">
                        <i data-lucide="x-circle"></i>
                        <span>Offline: ${stats.offline}</span>
                    </div>
                `;
                lucide.createIcons();
            });
    }

// Toast notification system (if not already defined)
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

    // Start periodic updates
    setInterval(() => {
        updateServiceStatuses();
        updateStats();
    }, 60000); // Update every minute
});