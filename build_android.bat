mkdir capacitor_setup

robocopy dist capacitor_setup\dist /E

cd capacitor_setup

npm init -y

npm i @capacitor/core
npm i -D @capacitor/cli

npx cap init MyApp com.example.myapp --web-dir=dist

npm i @capacitor/android 
npx cap add android

REM npm i @capacitor/ios 
REM npx cap add ios

npx cap sync

npx cap open android
