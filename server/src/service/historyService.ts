import fs from 'fs';
import path from 'path';
const history = path.join(__dirname, 'searchHistory.json');

class City{
  name: string;
  id: number;

  constructor(
    name: string,
    id: number
  ){
  this.name = name;
  this.id = id;
}};

class HistoryService {
  // Reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFileSync(history, 'utf-8');
      return JSON.parse(data) as City[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'EN0ENT') {
      await fs.promises.writeFile(history, JSON.stringify([]));
      return [];
    }
    throw err;
  }
};
  // Writes the updated cities array to the searchHistory.json file
  async write(cities: City[]) {
    await fs.promises.writeFile(history, JSON.stringify(cities, null, 2));
  };
  // Reads the cities from the searchHistory.json file
  async getCities() {
    return await this.read();
  };
  // Adds a city to the searchHistory.json file
  public async addCity(city: City) {
    if (!city || !city.name || !city.id) {
      throw new Error('Invalid City')
    }
    const cities = await this.read();
    //avoids duplicates !!Confirm that name is best!!
    if (!cities.some((c) => c.name === city.name)) {
      cities.push(city);
      await this.write(cities);
    }
  };
  // Removes a city from the searchHistory.json file
  public async removeCity() {
    try {
      const cities = await this.getCities();

      if (cities.length === 0) {
        throw new Error('No location found for the city entered.');
      }
      //reduce?
    } catch (err: any) {
      console.error('Error - cannot remove city from history:', err.message);
      throw err;
    }
  };
}

export default new HistoryService();
