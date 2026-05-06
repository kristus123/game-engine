@echo off

mkdir capacitor_setup

robocopy dist capacitor_setup\dist /E

cd /d capacitor_setup

npm init -y

npm i @capacitor/core
npm i -D @capacitor/cli

call npx cap init MyApp com.example.myapp --web-dir=dist

call npm i @capacitor/android

call npx cap add android
call npm install @capacitor-community/microphone

REM npm i @capacitor/ios
REM npx cap add ios

call npx cap sync

call npx cap open android
