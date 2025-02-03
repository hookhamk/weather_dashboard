import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();
const apiKey = process.env.apiKey;
const baseGeoURL = process.env.baseGeoURL;
const baseWeatherURL = process.env.baseWeatherURL;
;
class Weather {
    constructor(temp, pressure, humidity, temp_min, temp_max) {
        this.temp = temp;
        this.pressure = pressure;
        this.humidity = humidity;
        this.temp_min = temp_min;
        this.temp_max = temp_max;
    }
}
;
class WeatherService extends Weather {
    constructor(cityName, lat, lon, country, state) {
        //Call parent class of Weather
        super(0, 0, 0, 0, 0);
        //Initialize properties of WeatherService class
        this.cityName = cityName;
        this.lat = lat;
        this.lon = lon;
        this.country = country;
        this.state = state;
    }
    // Fetches location data from Open Weather API
    async fetchLocationData(cityName, state, country, limit = 1) {
        try {
            const url = `${baseGeoURL}?q=${cityName},${state},${country}&limit=${limit}&appid=${apiKey}`;
            const response = await axios.get(url);
            if (response.data.length === 0) {
                throw new Error('No location found for the city entered.');
            }
            return response.data.map((item) => ({
                cityName: item.name,
                lat: item.lat,
                lon: item.lon,
                country: item.country,
                state: item.state || undefined,
            }));
        }
        catch (err) {
            console.error('Error fetching location data:', err.message);
            throw err;
        }
    }
    ;
    // Pulls the latitude and longitude from Coordinates array
    destructureLocationData(data) {
        return data.map((item) => ({
            lat: item.lat,
            lon: item.lon,
        }));
    }
    // Fetches the weather data based of the returned Coordinates
    async buildGeocodeQuery(data) {
        try {
            const locationData = this.destructureLocationData(data);
            const url = `${baseWeatherURL}?lat=${locationData[0].lat}&lon=${locationData[0].lon}&appid=${apiKey}`;
            const response = await axios.get(url);
            if (!response.data || Object.keys(response.data).length === 0) {
                throw new Error('Weather data is currently unavailable');
            }
            // Return the full weather data
            return response.data;
        }
        catch (err) {
            console.error('Error fetching weather data:', err.message);
            throw err;
        }
    }
    ;
    buildWeatherQuery(coordinates) {
        return `${baseWeatherURL}?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}`;
    }
    async fetchAndDestructureLocationData(cityName, state, country) {
        const locationData = await this.fetchLocationData(cityName, state, country);
        return this.destructureLocationData(locationData);
    }
    async fetchWeatherData(coordinates) {
        try {
            const url = this.buildWeatherQuery(coordinates);
            const response = await axios.get(url);
            return response.data;
        }
        catch (err) {
            console.error('Error fetching weather data:', err.message);
            throw err;
        }
    }
    parseCurrentWeather(response) {
        const { main, weather, wind } = response;
        return {
            temperature: main.temp,
            description: weather[0].description,
            humidity: main.humidity,
            windSpeed: wind.speed,
        };
    }
    buildForecastArray(weatherData) {
        return weatherData.map((forecast) => ({
            time: forecast.dt_txt,
            temperature: forecast.main.temp,
            description: forecast.weather[0].description,
            humidity: forecast.main.humidity,
            windSpeed: forecast.wind.speed,
        }));
    }
    // Get the weather for selected city to display
    async getWeatherForCity(cityName, state, country) {
        try {
            const locations = await this.fetchLocationData(cityName, state, country);
            const selectedLocation = locations[0];
            console.log(`Selected Location:`, selectedLocation);
            // Fetch weather data for the selected location
            const weatherData = await this.fetchWeatherData(selectedLocation);
            // Parse current weather and forecast
            const currentWeather = this.parseCurrentWeather(weatherData);
            const forecast = this.buildForecastArray(weatherData);
            return {
                location: selectedLocation,
                currentWeather,
                forecast,
            };
        }
        catch (err) {
            console.error('Error getting weather for city:', err.message);
            throw err;
        }
    }
}
;
export default new WeatherService('', 0, 0, '', '');
