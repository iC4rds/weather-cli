import { Command } from 'commander';
import axios from 'axios';
import ReadLine from 'readline';
import { translations } from './language';

type Language = keyof typeof translations;

const program = new Command();
const API_KEY = process.env.OPENWEATHER_API_KEY;
const GEO_API_URL = 'http://api.openweathermap.org/geo/1.0/direct';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

type GeoData = {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}[];

type WeatherData = {
  name: string;
  weather: [
    {
      main: string,
      description: string,
    }
  ];
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
};

var rl = ReadLine.createInterface({
  input: process.stdin,
  output: process.stdout
});

program
  .version('1.0.0', '-v, --version', 'Display version')
  .description('A CLI weather tool with multi-language support')
  .addHelpText('after', '\nExamples:\n  weather --city Berlin --lang de\n  weather --city New York --units imperial')
  .option('-c, --city <string>', 'City name (e.g. "Berlin" or "London,GB")')
  .option('-u, --units <string>', 'Units: metric|imperial|standard', 'metric')
  .option('-l, --lang <string>', 'Language: en|de|fr|ru|ja|ko|es', 'en')
  .showHelpAfterError('(Use --help for usage information)');

if (process.argv.some(arg => ['-h', '--help'].includes(arg))) program.help();
if (process.argv.some(arg => ['-v', '--version'].includes(arg))) {
  console.log(program.version());
  process.exit(0);
}

program.action(async (options) => {
    if (!options.city) {
      try {
        const answer = await new Promise<string>((resolve) => {
          rl.question('Please enter a city name: ', resolve);
        });
        options.city = answer;
      } catch (error) {
        console.error('Error reading input:', error);
      }
    }

    try {
      const geoResponse = await axios.get<GeoData>(
        `${GEO_API_URL}?q=${options.city}&limit=1&appid=${API_KEY}`
      );
      const geoData = geoResponse.data[0];

      if (!geoData) {
        console.error('Error: City not found.');
        process.exit(1);
      }

      const weatherResponse = await axios.get<WeatherData>(
        `${WEATHER_API_URL}?lat=${geoData.lat}&lon=${geoData.lon}&appid=${API_KEY}&units=${options.units}&lang=${options.lang}`
      );
      const weatherData = weatherResponse.data;

      const lang = (translations[options.lang as Language] ? options.lang : 'en') as Language;
      const t = translations[lang];

      console.log(`${t.main} ${geoData.name}, ${geoData.state || ''} ${geoData.country}:`);
      console.log(`----------------------------------------------`);
      console.log(weatherData.weather[0].description);
      console.log(`- ${t.temperature}: ${weatherData.main.temp}°${options.units === 'metric' ? 'C' : 'F'}`);
      console.log(`- ${t.feels_like}: ${weatherData.main.feels_like}°${options.units === 'metric' ? 'C' : 'F'}`);
      console.log(`- ${t.humidity}: ${weatherData.main.humidity}%`);
      console.log(`- ${t.wind_speed}: ${weatherData.wind.speed} m/s`);
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
    } finally {
      rl.close();
    }
  });

program.parse(process.argv);