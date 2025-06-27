class NewTabDashboard {
    constructor() {
        this.userName = 'Caleb';
        this.userLocation = 'Atlanta, GA';
        this.coordinates = { lat: 33.7490, lon: -84.3880 };
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
        
        // Check for new day every hour to refresh quote
        setInterval(() => this.checkForNewDay(), 60 * 60 * 1000);
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
            // Check if we have a cached quote from today
            const today = new Date().toDateString();
            const result = await chrome.storage.local.get(['dailyQuote', 'quoteDate']);
            
            // If we have a quote from today, use it
            if (result.dailyQuote && result.quoteDate === today) {
                document.getElementById('quote').textContent = `"${result.dailyQuote.content}"`;
                document.getElementById('quoteAuthor').textContent = `— ${result.dailyQuote.author}`;
                return;
            }
            
            // Otherwise, fetch a new quote
            await this.fetchNewQuote();
        } catch (error) {
            console.error('Error loading quote:', error);
            this.setFallbackQuote();
        }
    }

    async fetchNewQuote() {
        try {
            const response = await fetch('https://zenquotes.io/api/random', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // ZenQuotes returns an array with one quote object
            const quote = data[0];
            
            if (!quote || !quote.q || !quote.a) {
                throw new Error('Invalid quote data received');
            }
            
            // Cache the quote with today's date
            const today = new Date().toDateString();
            await chrome.storage.local.set({
                dailyQuote: { content: quote.q, author: quote.a },
                quoteDate: today
            });
            
            document.getElementById('quote').textContent = `"${quote.q}"`;
            document.getElementById('quoteAuthor').textContent = `— ${quote.a}`;
        } catch (error) {
            console.error('Error fetching new quote:', error);
            this.setFallbackQuote();
        }
    }

    setFallbackQuote() {
        document.getElementById('quote').textContent = '"The only way to do great work is to love what you do."';
        document.getElementById('quoteAuthor').textContent = '— Steve Jobs';
    }

    async checkForNewDay() {
        try {
            const today = new Date().toDateString();
            const result = await chrome.storage.local.get(['quoteDate']);
            
            // If the stored date is different from today, fetch a new quote
            if (result.quoteDate && result.quoteDate !== today) {
                await this.fetchNewQuote();
            }
        } catch (error) {
            console.error('Error checking for new day:', error);
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
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit`;
            
            const response = await fetch(weatherUrl);
            const data = await response.json();
            const weather = data.current_weather;

            document.getElementById('weatherTemp').textContent = `${Math.round(weather.temperature)}°F`;
            document.getElementById('weatherCondition').textContent = this.getWeatherDescription(weather.weathercode);
            document.getElementById('weatherLocation').textContent = this.userLocation;
        } catch (error) {
            console.error('Error loading weather:', error);
            document.getElementById('weatherTemp').textContent = '--°F';
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

        document.getElementById('quoteRefresh').addEventListener('click', async () => {
            const button = document.getElementById('quoteRefresh');
            button.style.animation = 'spin 0.5s ease-in-out';
            await this.fetchNewQuote();
            setTimeout(() => {
                button.style.animation = '';
            }, 500);
        });
    }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NewTabDashboard();
}); 