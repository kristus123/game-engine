winget install EclipseAdoptium.Temurin.17.JDK


⚠️ Capacitor-specific requirements
Android

In android/app/src/main/AndroidManifest.xml:

<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS"/>


iOS
In Info.plist:

<key>NSMicrophoneUsageDescription</key>
<string>This app uses the microphone for audio input.</string>



copy files to android dist:

```
xcopy /E /I /Y dist capacitor_setup\android\app\src\main\assets\public
```
