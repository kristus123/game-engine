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

> **Note:** Make sure to use the path of your binary. I used `D:\apps\ninja` because that is the path for mine.
> 
> Example Images:
> ![Example Image 2](https://i.imgur.com/Acmjo5X.png)
> ![Example Image 3](https://i.imgur.com/f0iyCCn.png)
> ![Example Image 4](https://i.imgur.com/pPl2PbN.png)
> ![Example Image 5](https://i.imgur.com/QIMvDrc.png)
>
> You Can Verify By Running:
> ```sh
> ninja --version
> cmake --version
> ```
> .

3. Download `skia-m124` binary from the provided link.
4. Extract and Rename the extracted folder to `skia`. Then move it to `C:\deps\skia`.

**Build Steps:**
1. Open a `cmd.exe` and run:
```sh
cd C:
```
2. Clone the Aseprite github repository:
```sh
git clone --recursive https://github.com/aseprite/aseprite.git
```
3. Then run:
```sh
call "C:\Program Files\Microsoft Visual Studio\2022\Community\Common7\Tools\VsDevCmd.bat" -arch=x64
```
4. Finally, we can start the actual build process:
```sh
cd aseprite
mkdir build
cd build
cmake -DCMAKE_BUILD_TYPE=RelWithDebInfo -DLAF_BACKEND=skia -DSKIA_DIR=C:\deps\skia -DSKIA_LIBRARY_DIR=C:\deps\skia\out\Release-x64 -DSKIA_LIBRARY=C:\deps\skia\out\Release-x64\skia.lib -G ninja ..
ninja aseprite
```

> **Note:** After this there will be an `aseprite.exe` binary generated at `C:\aseprite\build\bin`. If you want you can move this `bin` folder to somewhere else.

> **Note:** If there are errors related to Aseprite while trying to run the engine try adding the path of your aseprite binary in `Aseprite.js` excluding the `.exe` part.