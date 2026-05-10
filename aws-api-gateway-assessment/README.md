# ScanSource-aws-gateway-assessment-repo
This repository contains my submission for the ScanSource Jr. API Developer technical assessment.

# Project Overview
This project includes a CloudFormation template (`main.yaml`) used to deploy the required AWS infrastructure for the application. Included is configuration for a Cognito Userpool, Cognito App Client, the lambdas for application, and the API Gateway for the project.

# Architecture
The application consists of:

- AWS API Gateway with two secured endpoints
- Amazon Cognito User Pool authentication
- Two AWS Lambda functions
- External API integrations:
  - OpenWeatherMap API
  - CoinGecko API
- IAM Roles and permissions managed through CloudFormation

# Technologies and Dependencies
WeatherLambda (TypeScript)
- Node.js 18.x
- axios

CryptoLambda (Python)
- Python 3.11
- requests

# Deployment Guide
Note:
The CloudFormation template creates all required AWS infrastructure resources except the deployment artifact uploads to S3. The evaluator must upload the provided lambda zip files to their own S3 bucket before deployment.

Step 1: Create S3 Bucket
- Create an S3 bucket.

Step 2: Obtain Open Weather API Key
- Sign up for Openweathermap.org to generate your own api key. Go inside the lambdas/lambda1 directory and create a .env file and configure it with the following value:

  - OPENWEATHER_API_KEY=YOUR_API_KEY_HERE

- With your api added to the .env file, run the following commands in the lambda1 directory to set up the file correctly.
  - npm install (install dependencies)
  - npx tsc (compile TypeScript project)

- From the lambda1 directory, create a deployment zip:
  - Compress-Archive -Path * -DestinationPath ../../assets/lambda1.zip

Step 3: Upload zip files
- Upload lambda1.zip and lambda2.zip to the S3 bucket that you created. Both files needed are located in the assets/ directory. Be sure to upload lambda1.zip and lambda2.zip to the root of your S3 bucket (don't upload asset/lambda1 for example).

Step 4: Update S3Bucket values in cloudformation/main.yaml
- Inside main.yaml, look for the resources "WeatherLambda" & "CryptoLambda". Underneath each, there is a property called "S3Bucket". Update the value of the S3Bucket property for both lambdas to the name of the S3 bucket you created.

Step 5: Deploy stack
- Use the following command to deploy the stack via cloudFormation using the following command.
  - Command: aws cloudformation deploy --template-file cloudformation/main.yaml --stack-name scansource-assessment --capabilities CAPABILITY_NAMED_IAM
  - The output will give you the APIURL and UserPoolClientId you'll need to test the endpoints
    - Example ApiURL: https://hw2969wxpg.execute-api.us-east-1.amazonaws.com/prod


Step 6: Create a Cognito User
- Create a Cognito User for you to log into the Cognito app.
  - Command: "aws cognito-idp sign-up --client-id <Cognito_UserPool_ClientId> --username testuser2@example.com --password Test123! --user-attributes Name=email,Value=testuser2@example.com"

Step 7: Authentical using AWS CLI
- Use the following command to authenticate the user. Save the IdToken so you can call the secured endpoints.
  - Command: “aws cognito-idp initiate-auth --auth-flow USER_PASSWORD_AUTH --client-id <Cognito_UserPool_ClientId> --auth-parameters USERNAME=testuser2@example.com,PASSWORD=Test123!”
- You can save the idToken with the following commands in powershell: 
--$response = aws cognito-idp initiate-auth --auth-flow USER_PASSWORD_AUTH --client-id <Cognito_UserPool_ClientId> --auth-parameters USERNAME=newtestuser@example.com,PASSWORD=Test123! | ConvertFrom-Json

  - Save IdToken:
--$token = $response.AuthenticationResult.IdToken

Step 8: Use the returned IdToken to call secured endpoints
- You can test the endpoints with the following commands in powershell.
  - Weather endpoint: Invoke-RestMethod -Headers @{Authorization="Bearer $token"} -Uri "<apiurl>/weather?city=<city_name>"
---Example: Invoke-RestMethod -Headers @{Authorization="Bearer $token"} -Uri "https://hw2969wxpg.execute-api.us-east-1.amazonaws.com/prod/weather?city=Atlanta"
    - Example Response:
      - city     tempK tempF description
      - Atlanta 293.99 69.51 overcast clouds

- Crypto endpoint: Invoke-RestMethod -Headers @{Authorization="Bearer $token"} -Uri "<apiurl>/crypto?symbol=<crypto_coin_name>"
    - Example: Invoke-RestMethod -Headers @{Authorization="Bearer $token"} -Uri "https://hw2969wxpg.execute-api.us-east-1.amazonaws.com/prod/crypto?symbol=bitcoin"
    - Example Response:
      - symbol  price_usd

      - bitcoin     81023

# External Endpoints
WeatherLambda:
- Lambda1 uses TypeScript to call the openweathermap api to retrieve the temperature in both kelvin and fahrenheit as well as the description of the weather of the city name passed in your api call.

- This lambda will require the use of an API key for accessing the data. You can get an API key signing up for the service and add it to the .env file.

CryptoLambda:
- This lambda will return the name of a crypto coin as well as the price of one coin in USD. 