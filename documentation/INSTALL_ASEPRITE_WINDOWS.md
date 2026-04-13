# Aseprite Setup for Windows

[youtube video](https://youtu.be/78T94w-Mms8?si=k-FTEb0j_isVw2UZ)


# Install Git

[download here](https://git-scm.com/download/win)

Verify installation:

```bash
git --version
```

# Install CMake

choose `4.2.x` version (aseprite requires that version)

[download here](https://cmake.org/download/)

## Add CMake to system PATH

Verify:

```bash
cmake --version
```

# Install Visual Studio (Community)

[download here](https://visualstudio.microsoft.com/)

During installation select:

- Desktop development with C++

![text](https://i.gyazo.com/6966c87933505bc16ea46b5939f2addd.png)

# Install Ninja Build System

[download here](https://github.com/ninja-build/ninja/releases)

make sure windows 11 sdk is checked

![text](https://i.gyazo.com/6a01e60d30b5ce74f85d338bebda105a.png)

place .exe into:

```bash
C:\ninja\
```

- Place ninja.exe in your PATH
    - win + edit environment variables
    - user -> path -> new
    - paste the path `C:\ninja\`

![text](https://i.gyazo.com/d2cb399e17c1920580992af62ee1be45.png)

open new cmd and verify:

```
ninja --version

cmake --version
```

# download aseprite

Step 1 — Download the Source Code

Open a terminal and clone Aseprite:

```bash
git clone --recursive https://github.com/aseprite/aseprite.git
cd aseprite
mkdir build
cd build
```

# Download Skia Dependency

Aseprite requires the Skia graphics library.

Download the prebuilt Skia package:

[download here](https://github.com/aseprite/skia/releases)

choose `Skia-Windows-Release-x64.zip`.

Extract it to:

```
C:\deps\skia
```

![text](https://i.gyazo.com/6c2e1ca33fb73353264b81cbca0da99c.png)


# Install Aseprite

[text](https://github.com/aseprite/aseprite/releases)

Install the newest version

export it to 

```
C:\aseprite
```

also create a `build` folder

```
C:\aseprite\build
```

open cmd inside of this folder

run:

```
call "C:\Program Files\Microsoft Visual Studio\18\Community\Common7\Tools\VsDevCmd.bat" -arch=x64

cmake -DCMAKE_BUILD_TYPE=RelWithDebInfo -DLAF_BACKEND=skia -DSKIA_DIR=C:\deps\skia -DSKIA_LIBRARY_DIR=C:\deps\skia\out\Release-x64 -DSKIA_LIBRARY=C:\deps\skia\out\Release-x64\skia.lib -G Ninja ..

ninja aseprite
```

C:\aseprite\build\bin
```
build/bin/aseprite.exe
```




