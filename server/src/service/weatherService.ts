import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const apiKey = process.env.apiKey;
const baseGeoURL = process.env.baseGeoURL;
const baseWeatherURL = process.env.baseWeatherURL;

interface Coordinates {
  cityName: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
};

class Weather {
  temp: number;
  pressure: number;
  humidity: number;
  temp_min: number;
  temp_max: number;

  constructor(
    temp: number,
    pressure: number,
    humidity: number,
    temp_min: number,
    temp_max: number,
  ) {
    this.temp = temp;
    this.pressure = pressure;
    this.humidity = humidity;
    this.temp_min = temp_min;
    this.temp_max = temp_max;
}};

class WeatherService extends Weather implements Coordinates {
  cityName: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;

  constructor(
    cityName: string,
    lat: number,
    lon: number,
    country: string,
    state: string
  ) {
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
  public async fetchLocationData(cityName: string, state: string, country: string, limit = 1): Promise<Coordinates[]> {
    try {
      const url = `${baseGeoURL}?q=${cityName},${state},${country}&limit=${limit}&appid=${apiKey}`;
      const response = await axios.get(url);

      if (response.data.length === 0) {
        throw new Error('No location found for the city entered.');
      }
      return response.data.map((item: any) => ({
        cityName: item.name,
        lat: item.lat,
        lon: item.lon,
        country: item.country,
        state:item.state || undefined,
      }));
    } catch (err: any) {
        console.error('Error fetching location data:', err.message);
        throw err;
    }
  };

  // Pulls the latitude and longitude from Coordinates array
  public destructureLocationData(data: Coordinates[]): Array<{lat: number; lon: number}> {
    return data.map((item) => ({
      lat: item.lat,
      lon: item.lon,
    }));
  }

  // Fetches the weather data based of the returned Coordinates
  public async buildGeocodeQuery(data:Coordinates[]): Promise<any> {
    try {
      const locationData = this.destructureLocationData(data);
      const url = `${baseWeatherURL}?lat=${locationData[0].lat}&lon=${locationData[0].lon}&appid=${apiKey}`;
      const response = await axios.get(url);

    if (!response.data || Object.keys(response.data).length === 0) {
      throw new Error('Weather data is currently unavailable');
    }
    // Return the full weather data
    return response.data; 
  } catch (err: any) {
    console.error('Error fetching weather data:', err.message);
    throw err;
  }
};

  public buildWeatherQuery(coordinates: Coordinates): string {
    return `${baseWeatherURL}?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}`;
  }

  public async fetchAndDestructureLocationData(cityName: string, state: string, country: string): Promise<{lat: number; lon: number}[]> {
    const locationData = await this.fetchLocationData(cityName, state, country);
    return this.destructureLocationData(locationData);
  }

  public async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    try {
      const url = this.buildWeatherQuery(coordinates);
      const response = await axios.get(url);

      return response.data;
    } catch (err: any) {
      console.error('Error fetching weather data:', err.message);
      throw err;
    }
  }

  public parseCurrentWeather(response: any) {
    const { main, weather, wind } = response;
    return {
      temperature: main.temp,
      description: weather[0].description,
      humidity: main.humidity,
      windSpeed: wind.speed,
    };
  }

  public buildForecastArray(weatherData: any[]) {
    return weatherData.map((forecast: any) => ({
      time: forecast.dt_txt,
      temperature: forecast.main.temp,
      description: forecast.weather[0].description,
      humidity: forecast.main.humidity,
      windSpeed: forecast.wind.speed,
    }));
  }

  // Get the weather for selected city to display
  async getWeatherForCity(cityName: string, state: string, country: string) {
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
    } catch (err: any) {
      console.error('Error getting weather for city:', err.message);
      throw err;
    }
  }
};

export default new WeatherService('', 0, 0, '', '');
