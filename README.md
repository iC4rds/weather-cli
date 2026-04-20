# Weather CLI 🌦️

A command-line tool to fetch current weather data from OpenWeatherMap API, with multi-language support.

## Features
- Get weather by city name
- Supports 7 languages (en, de, fr, ru, ja, ko, es)
- Displays temperature, humidity, wind speed, and "feels like"
- Metric/Imperial units support

## Installation

1. Ensure you have [Bun](https://bun.sh/) installed
2. Clone this repository and install dependencies:
   ```bash
   bun install
   ```
3. Compile to a standalone executable:
   ```bash
   bun build ./src/index.ts --compile --outfile weather
   ```
4. Move the binary to your PATH:
   ```bash
   sudo mv weather /usr/local/bin/weather
   ```
5. Set your [OpenWeatherMap](https://openweathermap.org/api) API key as an environment variable:

   **Fish:**
   ```fish
   set -Ux OPENWEATHER_API_KEY "your_api_key_here"
   ```
   **Zsh/Bash** (add to `~/.zshrc` or `~/.bashrc`):
   ```bash
   export OPENWEATHER_API_KEY="your_api_key_here"
   ```

## Usage
```bash
weather --city "Berlin" --lang de --units metric
```

### Options
| Flag           | Description                          | Default |
|----------------|--------------------------------------|---------|
| `-c, --city`   | City name (required)                 | -       |
| `-l, --lang`   | Language (en/de/fr/ru/ja/ko/es)      | en      |
| `-u, --units`  | Units (metric/imperial)              | metric  |

## Examples
```bash
# Get weather in Tokyo with Japanese output
weather --city "Tokyo" --lang ja

# Get weather in New York with Fahrenheit
weather --city "New York" --units imperial
```

## Supported Languages
- English (`en`)
- German (`de`)
- French (`fr`)
- Russian (`ru`)
- Japanese (`ja`)
- Korean (`kr`)
- Spanish (`es`)
