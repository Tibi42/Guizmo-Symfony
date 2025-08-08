/**
 * Gestionnaire de cookies pour Guizmo
 * Conforme au RGPD et aux bonnes pratiques
 */

class CookieManager {
    constructor() {
        this.cookieConsent = 'guizmo_cookie_consent';
        this.cookiePreferences = 'guizmo_cookie_preferences';
        this.cookieExpiry = 365; // jours
        
        this.init();
    }
    
    init() {
        // Vérifier si l'utilisateur a déjà donné son consentement
        if (!this.getCookie(this.cookieConsent)) {
            this.showCookieBanner();
        }
        
        this.bindEvents();
    }
    
    bindEvents() {
        // Bannière principale
        const acceptBtn = document.getElementById('cookie-accept');
        const rejectBtn = document.getElementById('cookie-reject');
        const settingsBtn = document.getElementById('cookie-settings');
        const closeBtn = document.getElementById('cookie-close');
        
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => this.acceptAllCookies());
        }
        
        if (rejectBtn) {
            rejectBtn.addEventListener('click', () => this.rejectAllCookies());
        }
        
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.showSettingsModal());
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideCookieBanner());
        }
        
        // Modal des paramètres
        const modalCloseBtn = document.getElementById('cookie-modal-close');
        const savePreferencesBtn = document.getElementById('cookie-save-preferences');
        const acceptAllBtn = document.getElementById('cookie-accept-all');
        
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => this.hideSettingsModal());
        }
        
        if (savePreferencesBtn) {
            savePreferencesBtn.addEventListener('click', () => this.savePreferences());
        }
        
        if (acceptAllBtn) {
            acceptAllBtn.addEventListener('click', () => this.acceptAllCookies());
        }
        
        // Fermer le modal en cliquant à l'extérieur
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideSettingsModal();
                }
            });
        }
        
        // Fermer avec la touche Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideSettingsModal();
            }
        });
    }
    
    showCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.style.display = 'block';
            // Animation d'apparition
            setTimeout(() => {
                banner.classList.add('show');
            }, 100);
        }
    }
    
    hideCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => {
                banner.style.display = 'none';
            }, 300);
        }
    }
    
    showSettingsModal() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.style.display = 'flex';
            // Charger les préférences actuelles
            this.loadPreferences();
        }
    }
    
    hideSettingsModal() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    acceptAllCookies() {
        const preferences = {
            essential: true,
            analytics: true,
            marketing: true,
            timestamp: new Date().toISOString()
        };
        
        this.setCookie(this.cookieConsent, 'accepted', this.cookieExpiry);
        this.setCookie(this.cookiePreferences, JSON.stringify(preferences), this.cookieExpiry);
        
        this.hideCookieBanner();
        this.hideSettingsModal();
        
        // Activer tous les cookies
        this.activateCookies(preferences);
        
        console.log('Tous les cookies ont été acceptés');
    }
    
    rejectAllCookies() {
        const preferences = {
            essential: true,
            analytics: false,
            marketing: false,
            timestamp: new Date().toISOString()
        };
        
        this.setCookie(this.cookieConsent, 'rejected', this.cookieExpiry);
        this.setCookie(this.cookiePreferences, JSON.stringify(preferences), this.cookieExpiry);
        
        this.hideCookieBanner();
        
        // Activer seulement les cookies essentiels
        this.activateCookies(preferences);
        
        console.log('Seuls les cookies essentiels ont été acceptés');
    }
    
    savePreferences() {
        const analyticsCheckbox = document.getElementById('cookie-analytics');
        const marketingCheckbox = document.getElementById('cookie-marketing');
        
        const preferences = {
            essential: true, // Toujours actif
            analytics: analyticsCheckbox ? analyticsCheckbox.checked : false,
            marketing: marketingCheckbox ? marketingCheckbox.checked : false,
            timestamp: new Date().toISOString()
        };
        
        this.setCookie(this.cookieConsent, 'custom', this.cookieExpiry);
        this.setCookie(this.cookiePreferences, JSON.stringify(preferences), this.cookieExpiry);
        
        this.hideCookieBanner();
        this.hideSettingsModal();
        
        // Activer les cookies selon les préférences
        this.activateCookies(preferences);
        
        console.log('Préférences de cookies sauvegardées:', preferences);
    }
    
    loadPreferences() {
        const preferences = this.getCookiePreferences();
        
        if (preferences) {
            const analyticsCheckbox = document.getElementById('cookie-analytics');
            const marketingCheckbox = document.getElementById('cookie-marketing');
            
            if (analyticsCheckbox) {
                analyticsCheckbox.checked = preferences.analytics;
            }
            
            if (marketingCheckbox) {
                marketingCheckbox.checked = preferences.marketing;
            }
        }
    }
    
    activateCookies(preferences) {
        // Cookies essentiels (toujours actifs)
        if (preferences.essential) {
            // Cookies nécessaires au fonctionnement du site
            this.setCookie('session_id', this.generateSessionId(), 1);
        }
        
        // Cookies d'analyse
        if (preferences.analytics) {
            // Exemple: Google Analytics, Matomo, etc.
            this.setCookie('analytics_enabled', 'true', this.cookieExpiry);
            console.log('Cookies d\'analyse activés');
        } else {
            this.deleteCookie('analytics_enabled');
            console.log('Cookies d\'analyse désactivés');
        }
        
        // Cookies marketing
        if (preferences.marketing) {
            // Exemple: Facebook Pixel, Google Ads, etc.
            this.setCookie('marketing_enabled', 'true', this.cookieExpiry);
            console.log('Cookies marketing activés');
        } else {
            this.deleteCookie('marketing_enabled');
            console.log('Cookies marketing désactivés');
        }
    }
    
    // Utilitaires pour les cookies
    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }
    
    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    
    deleteCookie(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }
    
    getCookiePreferences() {
        const preferences = this.getCookie(this.cookiePreferences);
        if (preferences) {
            try {
                return JSON.parse(preferences);
            } catch (e) {
                console.error('Erreur lors du parsing des préférences de cookies:', e);
                return null;
            }
        }
        return null;
    }
    
    generateSessionId() {
        return 'session_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Méthodes publiques pour vérifier les préférences
    isAnalyticsEnabled() {
        const preferences = this.getCookiePreferences();
        return preferences ? preferences.analytics : false;
    }
    
    isMarketingEnabled() {
        const preferences = this.getCookiePreferences();
        return preferences ? preferences.marketing : false;
    }
    
    hasConsent() {
        return this.getCookie(this.cookieConsent) !== null;
    }
}

// Initialiser le gestionnaire de cookies quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    window.cookieManager = new CookieManager();
});

// Exporter pour utilisation dans d'autres modules
export default CookieManager;
