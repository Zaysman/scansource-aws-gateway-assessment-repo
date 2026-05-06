import json
import requests


def lambda_handler(event, context):
    try:
        symbol = event.get("queryStringParameters", {}).get("symbol")

        if not symbol:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Symbol is required"})
            }
        
        url = f"https://api.coingecko.com/api/v3/simple/price?ids={symbol}&vs_currencies=usd"
        response = requests.get(url)
        
        if response.status_code != 200:
             return {
                  "statusCode": response.status_code,
                  "body": json.dumps({"error": "Failed to fetch crypto data"})
             }
        
        data = response.json()

        if not data:
             return {
                  "statusCode": 404,
                  "body": json.dumps({"error": "Symbol not found"})
             }

        price = data.get(symbol, {}).get("usd")

        if price is None:
             return {
                  "statusCode": 404,
                  "body": json.dumps({"error": "Price not found"})
             }

        return {
            "statusCode": 200,
            "body": json.dumps({
                 "symbol": symbol,
                 "price_usd": price
            })
        }
    
    except Exception as e:
            print(e)
            return {
                 "statusCode": 500,
                 "body": json.dumps({"error": "Internal Server Error"})
            }