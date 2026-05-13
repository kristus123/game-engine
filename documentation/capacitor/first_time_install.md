```
node test.js
```

winget install EclipseAdoptium.Temurin.17.JDK

In android/app/src/main/AndroidManifest.xml:


```
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS"/>
```

copy files to android dist:

```
xcopy /E /I /Y dist capacitor_setup\android\app\src\main\assets\public
```
