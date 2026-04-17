# Setup Aseprite for Windows

**Dependencies:**
- Git: https://git-scm.com/install/windows,
- Cmake: https://cmake.org/download/,
- Ninja: https://github.com/ninja-build/ninja/releases,
- Visual Studio: https://visualstudio.microsoft.com/downloads/,
- And a compiled version of the `aseprite-m124` branch of the Skia library: https://github.com/aseprite/skia/releases/tag/m124-08a5439a6b,

**Setup Dependencies:**

1. Download And Install `git`, `cmake`, `ninja` and `visual studio` from the given links.

> **Note:** While installing Visual Studio remember to select "Desktop development with C++": ![Example Image](https://i.imgur.com/lnW0x5L.png)

2. Set the `PATH` variable for `ninja`:

![Example Image 2](https://i.imgur.com/6sBmela.png)

Verify:

```bash
cmake --version
```
2. Clone the Aseprite github repository:
```sh
git clone --recursive https://github.com/aseprite/aseprite.git
```
3. Then run:
```sh
call "C:\Program Files\Microsoft Visual Studio\2022\Community\Common7\Tools\VsDevCmd.bat" -arch=x64
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

open cmd inside of the build folder

run:

```
call "C:\Program Files\Microsoft Visual Studio\18\Community\Common7\Tools\VsDevCmd.bat" -arch=x64

cmake -DCMAKE_BUILD_TYPE=RelWithDebInfo -DLAF_BACKEND=skia -DSKIA_DIR=C:\deps\skia -DSKIA_LIBRARY_DIR=C:\deps\skia\out\Release-x64 -DSKIA_LIBRARY=C:\deps\skia\out\Release-x64\skia.lib -G Ninja ..

ninja aseprite
```

> **Note:** After this there will be an `aseprite.exe` binary generated at `C:\aseprite\build\bin`. If you want you can move this `bin` folder to somewhere else.

> **Note:** If there are errors related to Aseprite while trying to run the engine try adding the path of your aseprite binary in `Aseprite.js` excluding the `.exe` part.