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

# Install Ninja Build System

[download here](https://github.com/ninja-build/ninja/releases)

place .exe into:

```bash
C:\ninja\ninja.exe
```

- Place ninja.exe in your PATH
    - win + edit environment variables
    - user -> path -> new
    - paste the path

open new cmd and verify:

```
ninja --version
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

Step 4 — Configure the Build

Run the following CMake command.

Adjust the SKIA_DIR path to where you extracted Skia.

```bash
cmake -G Ninja ^
-DLAF_BACKEND=skia ^
-DSKIA_DIR=C:\deps\skia ^
-DSKIA_LIBRARY_DIR=C:\deps\skia\out\Release-x64 ^
-DSKIA_LIBRARY=C:\deps\skia\out\Release-x64\skia.lib ^
```

If configured correctly, CMake will generate the build files.

Step 5 — Compile Aseprite

Run:

```bash
ninja aseprite
```

This will compile Aseprite.
The process may take several minutes.

# Run Aseprite

After compilation completes, run:

```
build/bin/aseprite.exe
```
