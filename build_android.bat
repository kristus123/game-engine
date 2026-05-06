mkdir capacitor_setup

robocopy dist capacitor_setup\dist /E

cd capacitor_setup

npm init -y

npm i @capacitor/core
npm i -D @capacitor/cli

npx -y cap init MyApp com.example.myapp --web-dir=dist

npm i @capacitor/android 
npx -y cap add android

npm install @capacitor-community/microphone

REM npm i @capacitor/ios 
REM npx cap add ios

npx -y cap sync

npx -y cap open android
