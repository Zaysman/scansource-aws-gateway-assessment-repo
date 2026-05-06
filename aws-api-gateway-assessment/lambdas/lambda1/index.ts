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

        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
        );

        return {
            statusCode: 200,
            body: JSON.stringify({
                city: response.data.name,
                temp: response.data.main.temp,
                description: response.data.weather[0].description,
            }),
        };
    } catch (error: any) {
        console.error(error);

        return {
            statusCode: 500,
            body: JSON.stringify({error: "Internal Server Error"}),
        };
    }

};