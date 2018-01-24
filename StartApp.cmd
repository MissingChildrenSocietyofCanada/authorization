echo off
echo Configuring environment for local execution
echo ===========================================
echo Configuring environment variables:

echo  - MONGO_DB
set MONGO_DB=mongodb://localhost:27017
echo    %MONGO_DB%

echo  - PORT
set PORT=8080
echo    %PORT%

echo  - FACEBOOK_CONSUMER_KEY
set FACEBOOK_CONSUMER_KEY=121998868463694
echo    %FACEBOOK_CONSUMER_KEY%

echo  - FACEBOOK_CONSUMER_SECRET
set FACEBOOK_CONSUMER_SECRET=af0a52fc594a460867fd44006e9ac514
echo    %FACEBOOK_CONSUMER_SECRET%

echo  - FACEBOOK_CALLBACK_URL
set FACEBOOK_CALLBACK_URL=http://localhost:8080/auth/facebook/callback
echo    %FACEBOOK_CALLBACK_URL%

echo  - TWITTER_CONSUMER_KEY
set TWITTER_CONSUMER_KEY=UMbbWr48zrAT94aFON1YCXBCO
echo    %TWITTER_CONSUMER_KEY%

echo  - TWITTER_CONSUMER_SECRET
set TWITTER_CONSUMER_SECRET=TTWr7kFiE9fpKQci1PCvYoNtXlwLxgmKVH2wTpaE3PapkpMx5X
echo    %TWITTER_CONSUMER_SECRET%

echo  - TWITTER_CALLBACK_URL
set TWITTER_CALLBACK_URL=http://localhost:8080/auth/twitter/callback
echo    %TWITTER_CALLBACK_URL%

echo  - INSTAGRAM_CONSUMER_KEY
set INSTAGRAM_CONSUMER_KEY=c2a8886806744952b6cccf32d8710bc3
echo    %INSTAGRAM_CONSUMER_KEY%

echo  - INSTAGRAM_CONSUMER_SECRET
set INSTAGRAM_CONSUMER_SECRET=6f67dbd7a9da448a9e413c3f7a04e65c
echo    %INSTAGRAM_CONSUMER_SECRET%

echo  - INSTAGRAM_CALLBACK_URL
set INSTAGRAM_CALLBACK_URL=http://localhost:8080/auth/instagram/callback
echo    %INSTAGRAM_CALLBACK_URL%

echo  - INSTAGRAM_REGISTRATION_CALLBACK_URL
set INSTAGRAM_REGISTRATION_CALLBACK_URL=
echo    %INSTAGRAM_REGISTRATION_CALLBACK_URL%

echo  - APPINSIGHTS_INSTRUMENTATIONKEY
set APPINSIGHTS_INSTRUMENTATIONKEY=ebcb6917-ab3d-43eb-9784-daea86f256d1
echo    %APPINSIGHTS_INSTRUMENTATIONKEY%

echo ===========================================
echo Running node server.js
nodemon server.js
