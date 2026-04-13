Aseprite Setup Guide (Free Build – 2026)

This guide documents how to build Aseprite from source for free so new team members can install it easily for sprite creation and editing.

Aseprite is open source, but the official builds are paid. By compiling it yourself, you can use it for free.

This guide is based on the following tutorial:

Build Aseprite in 2026 for FREE
https://youtu.be/78T94w-Mms8?si=k-FTEb0j_isVw2UZ

Requirements

Before building Aseprite, install the following tools.

1. Install Git

Download:

https://git-scm.com/download/win

Verify installation:

git --version
2. Install CMake
# (4.2.4)

Download:

https://cmake.org/download/

When installing, enable:

Add CMake to system PATH

Verify:

cmake --version
3. Install Visual Studio (Community)

Download:

https://visualstudio.microsoft.com/

During installation select:

Desktop development with C++

This installs the required compiler for building Aseprite.

4. Install Ninja Build System

Download Ninja:

https://github.com/ninja-build/ninja/releases

Place ninja.exe somewhere in your PATH
Example:

C:\ninja\ninja.exe

Verify:

ninja --version
Step 1 — Download the Source Code

Open a terminal and clone Aseprite:

git clone --recursive https://github.com/aseprite/aseprite.git

Enter the folder:

cd aseprite
Step 2 — Download Skia Dependency

Aseprite requires the Skia graphics library.

Download the prebuilt Skia package:

https://github.com/aseprite/skia/releases

Choose the Windows x64 version that matches your Visual Studio version.

Example:

Skia-Windows-Release-x64

Extract it somewhere like:

C:\deps\skia
Step 3 — Create Build Folder

Inside the Aseprite directory:

mkdir build
cd build
Step 4 — Configure the Build

Run the following CMake command.

Adjust the SKIA_DIR path to where you extracted Skia.

cmake -G Ninja ^
-DLAF_BACKEND=skia ^
-DSKIA_DIR=C:\deps\skia ^
-DSKIA_LIBRARY_DIR=C:\deps\skia\out\Release-x64 ^
-DSKIA_LIBRARY=C:\deps\skia\out\Release-x64\skia.lib ^
..

If configured correctly, CMake will generate the build files.

Step 5 — Compile Aseprite

Run:

ninja aseprite

This will compile Aseprite.
The process may take several minutes.

Step 6 — Run Aseprite

After compilation completes, run:

build/bin/aseprite.exe

You now have a working free build of Aseprite.

Optional — Create Desktop Shortcut

For convenience:

Navigate to

aseprite/build/bin

Right click

aseprite.exe → Create Shortcut

Move shortcut to Desktop.

Summary

This setup allows any developer to:

Build Aseprite for free

Use it for sprite editing

Export assets for the JavaScript game

Once built, Aseprite does not need to be rebuilt again unless updating the source.

In Conclusion: I followed along with the linked video and everything downloaded and ran perfectly.
