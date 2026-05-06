@echo off

mkdir capacitor_setup

robocopy dist capacitor_setup\dist /E
if %errorlevel% GEQ 8 exit /b %errorlevel%

cd /d capacitor_setup

npm init -y

npm i @capacitor/core
npm i -D @capacitor/cli

npx cap init MyApp com.example.myapp --web-dir=dist

npm i @capacitor/android
npx cap add android

npm install @capacitor-community/microphone

REM npm i @capacitor/ios
REM npx cap add ios

npx cap sync

npx cap open android
