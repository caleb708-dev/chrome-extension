# New Tab Dashboard - Chrome Extension

A clean and minimal Chrome extension that replaces your new tab page with a beautiful dashboard featuring time, personalized greetings, daily quotes, dynamic wallpapers, and weather information.

## Features

### Milestone 1: Core Dashboard
- ⏰ **Large Time Display** - Current time in big, readable numbers
- 👋 **Personalized Greeting** - Customizable greeting message with your name
- 💭 **Daily Quotes** - Fresh inspirational quotes on each new tab
- 🖼️ **Dynamic Wallpapers** - Beautiful Bing wallpapers that change with each new tab

### Milestone 2: Weather Integration
- 🌤️ **Weather Widget** - Current weather for your location in the top right
- 📍 **Location Settings** - Easily update your location for accurate weather data
- 🌡️ **Weather Details** - Temperature, conditions, and location display

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. Open a new tab to see your dashboard!

## Project Structure

```
chrome-extension/
├── manifest.json
├── newtab.html
├── newtab.css
├── newtab.js
├── settings.html
├── settings.css
├── settings.js
└── README.md
```

## Code Files

### 1. manifest.json
```json
{
  "manifest_version": 3,
  "name": "New Tab Dashboard",
  "version": "1.0.0",
  "description": "A clean and minimal new tab page with time, quotes, wallpapers, and weather",
  "chrome_url_overrides": {
    "newtab": "newtab.html"
  },
  "permissions": [
    "storage",
    "geolocation"
  ],
  "host_permissions": [
    "https://api.quotable.io/*",
    "https://bingw.jasonzeng.dev/*",
    "https://api.open-meteo.com/*",
    "https://geocoding-api.open-meteo.com/*"
  ],
  "action": {
    "default_popup": "settings.html"
  }
}
```

### 2. newtab.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Tab</title>
    <link rel="stylesheet" href="newtab.css">
</head>
<body>
    <div class="background-container">
        <div class="background-overlay"></div>
    </div>
    
    <div class="weather-widget" id="weatherWidget">
        <div class="weather-content">
            <div class="weather-temp" id="weatherTemp">--°</div>
            <div class="weather-condition" id="weatherCondition">Loading...</div>
            <div class="weather-location" id="weatherLocation">--</div>
        </div>
    </div>

    <div class="main-content">
        <div class="time-container">
            <div class="time" id="currentTime">12:00</div>
            <div class="date" id="currentDate">Monday, January 1</div>
        </div>
        
        <div class="greeting-container">
            <div class="greeting" id="greeting">Good morning, Friend!</div>
        </div>
        
        <div class="quote-container">
            <div class="quote" id="quote">"Loading inspirational quote..."</div>
            <div class="quote-author" id="quoteAuthor">- Author</div>
        </div>
    </div>

    <div class="settings-button" id="settingsButton">⚙️</div>
    
    <script src="newtab.js"></script>
</body>
</html>
```

### 3. newtab.css
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    height: 100vh;
    overflow: hidden;
    position: relative;
}

.background-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: -2;
    transition: opacity 0.5s ease-in-out;
}

.background-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: -1;
}

.weather-widget {
    position: fixed;
    top: 30px;
    right: 30px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 20px;
    min-width: 140px;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
}

.weather-widget:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
}

.weather-temp {
    font-size: 28px;
    font-weight: 300;
    color: white;
    margin-bottom: 5px;
}

.weather-condition {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 5px;
    text-transform: capitalize;
}

.weather-location {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.7);
}

.main-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
    color: white;
    padding: 20px;
}

.time-container {
    margin-bottom: 30px;
}

.time {
    font-size: 6rem;
    font-weight: 300;
    letter-spacing: -2px;
    text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
    margin-bottom: 10px;
}

.date {
    font-size: 1.2rem;
    font-weight: 400;
    opacity: 0.9;
    text-shadow: 0 1px 10px rgba(0, 0, 0, 0.5);
}

.greeting-container {
    margin-bottom: 40px;
}

.greeting {
    font-size: 2rem;
    font-weight: 400;
    text-shadow: 0 2px 15px rgba(0, 0, 0, 0.5);
}

.quote-container {
    max-width: 600px;
    margin: 0 auto;
}

.quote {
    font-size: 1.1rem;
    font-style: italic;
    line-height: 1.6;
    margin-bottom: 15px;
    text-shadow: 0 1px 10px rgba(0, 0, 0, 0.5);
    opacity: 0.95;
}

.quote-author {
    font-size: 0.9rem;
    opacity: 0.8;
    text-shadow: 0 1px 8px rgba(0, 0, 0, 0.5);
}

.settings-button {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 20px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
}

.settings-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
}

@media (max-width: 768px) {
    .time {
        font-size: 4rem;
    }
    
    .greeting {
        font-size: 1.5rem;
    }
    
    .quote {
        font-size: 1rem;
    }
    
    .weather-widget {
        top: 20px;
        right: 20px;
        padding: 15px;
        min-width: 120px;
    }
    
    .weather-temp {
        font-size: 24px;
    }
}
```

### 4. newtab.js
```javascript
class NewTabDashboard {
    constructor() {
        this.userName = 'Friend';
        this.userLocation = 'New York';
        this.coordinates = { lat: 40.7128, lon: -74.0060 };
        this.init();
    }

    async init() {
        await this.loadSettings();
        this.updateTime();
        this.updateGreeting();
        this.loadQuote();
        this.loadBackground();
        this.loadWeather();
        this.setupEventListeners();
        
        // Update time every second
        setInterval(() => this.updateTime(), 1000);
    }

    async loadSettings() {
        const result = await chrome.storage.sync.get(['userName', 'userLocation', 'coordinates']);
        if (result.userName) this.userName = result.userName;
        if (result.userLocation) this.userLocation = result.userLocation;
        if (result.coordinates) this.coordinates = result.coordinates;
    }

    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: false
        });
        const dateString = now.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });

        document.getElementById('currentTime').textContent = timeString;
        document.getElementById('currentDate').textContent = dateString;
    }

    updateGreeting() {
        const hour = new Date().getHours();
        let greeting;

        if (hour < 12) {
            greeting = `Good morning, ${this.userName}!`;
        } else if (hour < 17) {
            greeting = `Good afternoon, ${this.userName}!`;
        } else {
            greeting = `Good evening, ${this.userName}!`;
        }

        document.getElementById('greeting').textContent = greeting;
    }

    async loadQuote() {
        try {
            const response = await fetch('https://api.quotable.io/random?minLength=50&maxLength=150');
            const data = await response.json();
            
            document.getElementById('quote').textContent = `"${data.content}"`;
            document.getElementById('quoteAuthor').textContent = `— ${data.author}`;
        } catch (error) {
            console.error('Error loading quote:', error);
            document.getElementById('quote').textContent = '"The only way to do great work is to love what you do."';
            document.getElementById('quoteAuthor').textContent = '— Steve Jobs';
        }
    }

    async loadBackground() {
        try {
            const imageUrl = `https://bingw.jasonzeng.dev/?index=random&t=${Date.now()}`;
            const backgroundContainer = document.querySelector('.background-container');
            
            // Preload image to avoid flicker
            const img = new Image();
            img.onload = () => {
                backgroundContainer.style.backgroundImage = `url(${imageUrl})`;
            };
            img.src = imageUrl;
        } catch (error) {
            console.error('Error loading background:', error);
            // Fallback gradient
            document.querySelector('.background-container').style.background = 
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
    }

    async loadWeather() {
        try {
            const { lat, lon } = this.coordinates;
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius`;
            
            const response = await fetch(weatherUrl);
            const data = await response.json();
            const weather = data.current_weather;

            document.getElementById('weatherTemp').textContent = `${Math.round(weather.temperature)}°`;
            document.getElementById('weatherCondition').textContent = this.getWeatherDescription(weather.weathercode);
            document.getElementById('weatherLocation').textContent = this.userLocation;
        } catch (error) {
            console.error('Error loading weather:', error);
            document.getElementById('weatherTemp').textContent = '--°';
            document.getElementById('weatherCondition').textContent = 'Unavailable';
            document.getElementById('weatherLocation').textContent = this.userLocation;
        }
    }

    getWeatherDescription(code) {
        const weatherCodes = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Foggy',
            48: 'Rime fog',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            55: 'Dense drizzle',
            61: 'Slight rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            71: 'Slight snow',
            73: 'Moderate snow',
            75: 'Heavy snow',
            80: 'Slight showers',
            81: 'Moderate showers',
            82: 'Violent showers',
            95: 'Thunderstorm',
        };
        return weatherCodes[code] || 'Unknown';
    }

    setupEventListeners() {
        document.getElementById('settingsButton').addEventListener('click', () => {
            chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') });
        });
    }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NewTabDashboard();
});
```

### 5. settings.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Settings</title>
    <link rel="stylesheet" href="settings.css">
</head>
<body>
    <div class="container">
        <h1>Dashboard Settings</h1>
        
        <div class="setting-group">
            <label for="userName">Your Name:</label>
            <input type="text" id="userName" placeholder="Enter your name">
        </div>
        
        <div class="setting-group">
            <label for="userLocation">Location:</label>
            <input type="text" id="userLocation" placeholder="Enter your city">
            <button id="searchLocation">Search</button>
        </div>
        
        <div class="button-group">
            <button id="saveSettings" class="primary">Save Settings</button>
            <button id="resetSettings">Reset to Default</button>
        </div>
        
        <div id="status" class="status"></div>
    </div>
    
    <script src="settings.js"></script>
</body>
</html>
```

### 6. settings.css
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.container {
    background: white;
    border-radius: 12px;
    padding: 40px;
    max-width: 400px;
    width: 100%;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

h1 {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
    font-weight: 600;
}

.setting-group {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 8px;
    color: #555;
    font-weight: 500;
}

input {
    width: 100%;
    padding: 12px;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.3s ease;
}

input:focus {
    outline: none;
    border-color: #667eea;
}

button {
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

button.primary {
    background: #667eea;
    color: white;
}

button.primary:hover {
    background: #5a67d8;
    transform: translateY(-1px);
}

button:not(.primary) {
    background: #f7fafc;
    color: #4a5568;
    border: 2px solid #e2e8f0;
}

button:not(.primary):hover {
    background: #edf2f7;
}

#searchLocation {
    margin-top: 8px;
    width: 100%;
}

.button-group {
    display: flex;
    gap: 10px;
    margin-top: 30px;
}

.button-group button {
    flex: 1;
}

.status {
    margin-top: 20px;
    padding: 12px;
    border-radius: 8px;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    display: none;
}

.status.success {
    background: #c6f6d5;
    color: #22543d;
    display: block;
}

.status.error {
    background: #fed7d7;
    color: #742a2a;
    display: block;
}
```

### 7. settings.js
```javascript
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
            // Return default coordinates (New York) if geocoding fails
            return { lat: 40.7128, lon: -74.0060 };
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
```

## Development Milestones

### Milestone 1: Core Dashboard Features ✅
**Goal**: Create the basic new tab replacement with essential features
- [x] Time display with large, readable numbers
- [x] Personalized greeting system with customizable name
- [x] Daily inspirational quotes from Quotable API
- [x] Dynamic Bing wallpapers that change on each new tab
- [x] Clean, minimal UI with glassmorphism effects
- [x] Responsive design for different screen sizes
- [x] Basic settings page for name customization

**Deliverables**:
- Complete Chrome extension structure
- Working new tab replacement
- Quote integration
- Background image system
- Basic user preferences

### Milestone 2: Weather Integration 🌤️
**Goal**: Add weather functionality with location services
- [x] Weather widget in top-right corner
- [x] Integration with Open-Meteo API for weather data
- [x] Location search and geocoding
- [x] Weather condition descriptions
- [x] Temperature display in Celsius
- [x] Location-based weather updates
- [x] Enhanced settings page with location management

**Deliverables**:
- Weather API integration
- Geocoding for location search
- Enhanced settings interface
- Location-based weather data
- Weather condition mapping

## Usage Instructions

1. **First Time Setup**:
   - Install the extension
   - Click the settings button (⚙️) in the bottom right
   - Enter your name and location
   - Save settings

2. **Daily Use**:
   - Open new tabs to see your personalized dashboard
   - Enjoy fresh quotes and wallpapers each time
   - Check current weather in the top right
   - Time updates automatically

3. **Customization**:
   - Access settings anytime via the gear icon
   - Update your name or location as needed
   - Location changes will update weather data automatically

## Technical Features

- **No External Dependencies**: Works entirely with Chrome's built-in APIs
- **Offline Graceful Degradation**: Shows fallback content when APIs are unavailable
- **Performance Optimized**: Efficient API calls and image loading
- **Privacy Focused**: All settings stored locally in Chrome's sync storage
- **Cross-Platform**: Works on all operating systems supporting Chrome
- **Responsive Design**: Looks great on all screen sizes

## API Usage

- **Quotes**: [Quotable API](https://api.quotable.io/) - Free, no API key required
- **Weather**: [Open-Meteo API](https://open-meteo.com/) - Free weather API with no registration
- **Geocoding**: [Open-Meteo Geocoding](https://geocoding-api.open-meteo.com/) - For location search
- **Wallpapers**: [Bing Wallpaper API](https://bingw.jasonzeng.dev/) - Random Bing daily wallpapers

## Browser Compatibility

- Chrome 88+
- Edge 88+
- Brave Browser
- Any Chromium-based browser with Manifest V3 support

## License

This project is open source and available under the MIT License.

---

Enjoy your new personalized dashboard! 🚀 