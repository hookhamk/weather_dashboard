import { Router, Request, Response } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();

// POST Request with city name to retrieve weather data and save to to history
router.post('/', async (req: Request, res: Response) => {
 try {
  const { cityName } = req.body;
  if (!cityName) {
    return res.status(400).json({error: 'City name is required.'});
  }
  const weatherData = await WeatherService.buildGeocodeQuery(cityName);
  await HistoryService.addCity(cityName);
  res.json({message: 'Weather data retrieved successfully.', data: weatherData});
  } catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).json({error: 'Failed to fetch search history'});
  }
});

//GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const history = await HistoryService.getCities();
    res.json ({history});
  } catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).json ({history});
  }
});

//DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    if (!id) {
      return res.status(400).json({error: 'ID is required.'});
    }

    await HistoryService.removeCity();
    res.json({message: 'City deleted from history.'});
  } catch (error) {
    console.error('Error deleting city from history', error);
    res.status(500).json({error: 'Failed to delete city from history.'})
  }
});

export default router;
