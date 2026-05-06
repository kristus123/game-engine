@echo off

rmdir /s /q capacitor_setup

mkdir capacitor_setup

robocopy dist capacitor_setup\dist /E

cd /d capacitor_setup

call npm init -y

call npm i @capacitor/core
call npm i -D @capacitor/cli

call npx cap init MyApp com.example.myapp --web-dir=dist

call npm i @capacitor/android

call npx cap add android

REM npm i @capacitor/ios
REM npx cap add ios

call npx cap sync

call npx cap open android
