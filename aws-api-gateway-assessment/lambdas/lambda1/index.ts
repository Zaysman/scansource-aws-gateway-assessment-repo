import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const handler = async (event: any) => {
    try {
        const city = event.queryStringParameters?.city;


        if(!city) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "City is required"}),
            };
        }

        const apiKey = process.env.OPENWEATHER_API_KEY;

        if(!apiKey) {
            throw new Error("API key not configured");
        }

        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
        );

        const tempKelvin = response.data.main.temp;
        const tempFahrenheit = ((tempKelvin - 273.15) * 9 / 5) +32;

        return {
            statusCode: 200,
            body: JSON.stringify({
                city: response.data.name,
                tempK: tempKelvin,
                tempF: tempFahrenheit.toFixed(2),
                description: response.data.weather[0].description,
            }),
        };
    } catch (error: any) {
        console.error("Error fetching weather:", error?.response?.data || error.message);

        return {
            statusCode: error?.response?.status || 500,
            body: JSON.stringify({error: "Failed to fetch weather data"}),
        };
    }

};