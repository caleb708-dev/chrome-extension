class SettingsManager {
    constructor() {
        this.init();
    }

    async init() {
        await this.loadSettings();
        this.setupEventListeners();
    }

    async loadSettings() {
        const result = await chrome.storage.sync.get(['userName', 'userLocation']);
        
        if (result.userName) {
            document.getElementById('userName').value = result.userName;
        }
        if (result.userLocation) {
            document.getElementById('userLocation').value = result.userLocation;
        }
    }

    async saveSettings() {
        const userName = document.getElementById('userName').value.trim();
        const userLocation = document.getElementById('userLocation').value.trim();

        if (!userName) {
            this.showStatus('Please enter your name', 'error');
            return;
        }

        if (!userLocation) {
            this.showStatus('Please enter your location', 'error');
            return;
        }

        try {
            // Get coordinates for the location
            const coordinates = await this.getCoordinates(userLocation);
            
            await chrome.storage.sync.set({
                userName: userName,
                userLocation: userLocation,
                coordinates: coordinates
            });

            this.showStatus('Settings saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showStatus('Error saving settings. Please try again.', 'error');
        }
    }

    async getCoordinates(location) {
        try {
            const response = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`
            );
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const result = data.results[0];
                return {
                    lat: result.latitude,
                    lon: result.longitude
                };
            } else {
                throw new Error('Location not found');
            }
        } catch (error) {
            console.error('Error getting coordinates:', error);
            // Return default coordinates (Atlanta, GA) if geocoding fails
            return { lat: 33.7490, lon: -84.3880 };
        }
    }

    async searchLocation() {
        const location = document.getElementById('userLocation').value.trim();
        
        if (!location) {
            this.showStatus('Please enter a location to search', 'error');
            return;
        }

        try {
            this.showStatus('Searching location...', 'success');
            const coordinates = await this.getCoordinates(location);
            this.showStatus(`Location found! Coordinates: ${coordinates.lat.toFixed(2)}, ${coordinates.lon.toFixed(2)}`, 'success');
        } catch (error) {
            this.showStatus('Location not found. Please try a different location.', 'error');
        }
    }

    resetSettings() {
        document.getElementById('userName').value = '';
        document.getElementById('userLocation').value = '';
        
        chrome.storage.sync.clear(() => {
            this.showStatus('Settings reset to default', 'success');
        });
    }

    showStatus(message, type) {
        const statusDiv = document.getElementById('status');
        statusDiv.textContent = message;
        statusDiv.className = `status ${type}`;
        
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 3000);
    }

    setupEventListeners() {
        document.getElementById('saveSettings').addEventListener('click', () => {
            this.saveSettings();
        });

        document.getElementById('searchLocation').addEventListener('click', () => {
            this.searchLocation();
        });

        document.getElementById('resetSettings').addEventListener('click', () => {
            this.resetSettings();
        });

        // Save on Enter key
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.saveSettings();
            }
        });
    }
}

// Initialize settings when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SettingsManager();
}); 