Here’s your instructions reformatted for clarity and consistency:

---

# Install Aseprite

## 1. Download Aseprite Source

* [Check the newest version](https://github.com/aseprite/aseprite/releases)
* [Download newest version of Aseprite](https://github.com/aseprite/aseprite/releases/download/v1.3.14.2/Aseprite-v1.3.14.4-Source.zip)
* Unzip into:

```
C:\aseprite
```

---

## 2. Install CMake 3

* [Download latest version of CMake 3](https://cmake.org/files/v3.31/cmake-3.31.8-windows-x86_64.msi)
* Aseprite currently recommends **CMake 3**, so install it.

---

## 3. Install Ninja

* [Download latest Ninja](https://github.com/ninja-build/ninja/releases/tag/v1.13.1)
* Unzip and copy `ninja.exe` to:

```
C:\ninja
```

* Add the following to your **PATH** environment variable:

```
C:\ninja
```

---

## 4. Download Skia

* [Download Skia for Windows](https://github.com/aseprite/skia/releases/download/m124-08a5439a6b/Skia-Windows-Release-x64.zip)
* Unzip into:

```
C:\deps\skia
```

---

## 5. Prepare the Build Directory

* Inside `C:\aseprite`, create a folder:

```
build
```

---

## 6. Install C++ Compiler

* It’s recommended to use **MSVC** from Visual Studio to avoid errors.
* Once installed, open **"x64 Native Command Prompt"** from the Start Menu.

---

## 7. Build Aseprite

Run the following commands in the **x64 Native Command Prompt**:

```sh
cd C:\aseprite\build
cmake -DCMAKE_BUILD_TYPE=RelWithDebInfo ^
      -DCMAKE_POLICY_VERSION_MINIMUM=4.0.1 ^
      -DLAF_BACKEND=skia ^
      -DSKIA_DIR=C:\deps\skia ^
      -DSKIA_LIBRARY_DIR=C:\deps\skia\out\Release-x64 ^
      -G Ninja ..
ninja aseprite
```

---

## 8. Add Aseprite to PATH

After building, add this to your **PATH** environment variable:

```
C:\aseprite\build\bin
```

---

finished
