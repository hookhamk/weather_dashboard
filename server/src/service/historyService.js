import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const history = path.join(__dirname, 'searchHistory.json');
class City {
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }
}
;
class HistoryService {
    // Reads from the searchHistory.json file
    async read() {
        try {
            const data = await fs.promises.readFile(history, 'utf-8');
            return JSON.parse(data);
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                await fs.promises.writeFile(history, JSON.stringify([]));
                return [];
            }
            throw err;
        }
    }
    ;
    // Writes the updated cities array to the searchHistory.json file
    async write(cities) {
        await fs.promises.writeFile(history, JSON.stringify(cities, null, 2));
    }
    ;
    // Reads the cities from the searchHistory.json file
    async getCities() {
        return await this.read();
    }
    ;
    // Adds a city to the searchHistory.json file
    async addCity(city) {
        if (!city || !city.name || !city.id) {
            throw new Error('Invalid City');
        }
        const cities = await this.read();
        //avoids duplicates !!Confirm that name is best!!
        if (!cities.some((c) => c.name === city.name)) {
            cities.push(city);
            await this.write(cities);
        }
    }
    ;
    // Removes a city from the searchHistory.json file
    async removeCity() {
        try {
            const cities = await this.getCities();
            if (cities.length === 0) {
                throw new Error('No location found for the city entered.');
            }
            //reduce?
        }
        catch (err) {
            console.error('Error - cannot remove city from history:', err.message);
            throw err;
        }
    }
    ;
}
export default new HistoryService();
