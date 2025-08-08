/**
 * Gestionnaire de mode sombre pour Guizmo
 * Gère le basculement entre mode clair et sombre
 */

class DarkModeManager {
    constructor() {
        this.themeKey = 'guizmo_theme';
        this.defaultTheme = 'light';
        this.currentTheme = this.getStoredTheme();
        
        this.init();
    }
    
    init() {
        // Appliquer le thème au chargement
        this.applyTheme(this.currentTheme);
        
        // Configurer le bouton existant
        this.setupButton();
        
        // Écouter les changements de préférences système
        this.listenForSystemThemeChanges();
        
        console.log('Gestionnaire de mode sombre initialisé');
    }
    
    setupButton() {
        // Attendre que le DOM soit prêt
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.bindButtonEvent();
            });
        } else {
            this.bindButtonEvent();
        }
    }
    
    bindButtonEvent() {
        const button = document.getElementById('dark-mode-toggle');
        if (button) {
            button.addEventListener('click', () => this.toggleTheme());
            console.log('Bouton de mode sombre configuré');
        } else {
            console.warn('Bouton de mode sombre non trouvé');
        }
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
        this.applyTheme(theme);
        this.storeTheme(theme);
        
        // Animation du bouton
        this.animateButton();
        
        console.log(`Thème changé vers: ${theme}`);
    }
    
    applyTheme(theme) {
        // Appliquer l'attribut data-theme au document
        document.documentElement.setAttribute('data-theme', theme);
        
        // Mettre à jour la meta tag pour la couleur du thème
        this.updateThemeMetaTag(theme);
    }
    
    updateThemeMetaTag(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        // Couleurs pour la barre d'adresse du navigateur
        const colors = {
            light: '#667eea',
            dark: '#1a1a1a'
        };
        
        metaThemeColor.content = colors[theme] || colors.light;
    }
    
    animateButton() {
        const button = document.getElementById('dark-mode-toggle');
        if (button) {
            button.style.transform = 'scale(0.9)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 150);
        }
    }
    
    getStoredTheme() {
        // Vérifier d'abord le localStorage
        const stored = localStorage.getItem(this.themeKey);
        if (stored && (stored === 'light' || stored === 'dark')) {
            return stored;
        }
        
        // Sinon, utiliser la préférence système
        return this.getSystemTheme();
    }
    
    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }
    
    storeTheme(theme) {
        try {
            localStorage.setItem(this.themeKey, theme);
        } catch (e) {
            console.warn('Impossible de sauvegarder le thème dans localStorage:', e);
        }
    }
    
    listenForSystemThemeChanges() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            mediaQuery.addEventListener('change', (e) => {
                // Ne changer que si l'utilisateur n'a pas défini de préférence manuelle
                const stored = localStorage.getItem(this.themeKey);
                if (!stored) {
                    const newTheme = e.matches ? 'dark' : 'light';
                    this.setTheme(newTheme);
                }
            });
        }
    }
    
    // Méthodes publiques
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    isDarkMode() {
        return this.currentTheme === 'dark';
    }
    
    isLightMode() {
        return this.currentTheme === 'light';
    }
}

// Initialiser le gestionnaire de mode sombre
window.darkModeManager = new DarkModeManager();

// Exporter pour utilisation dans d'autres modules
export default DarkModeManager;
