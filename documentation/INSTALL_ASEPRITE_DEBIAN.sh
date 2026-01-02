#!/bin/bash

cd

set -e  # Exit on any error

sudo apt install g++ clang libc++-dev libc++abi-dev cmake ninja-build libx11-dev libxcursor-dev libxi-dev libgl1-mesa-dev libfontconfig1-dev curl nano -y

sudo apt install libharfbuzz-dev libgif-dev libjpeg-dev libcurl4-openssl-dev libtinyxml-dev libpixman-1-dev libcmark-dev -y

sudo apt clean -y


mkdir -p ~/src/ase
cd ~/src/ase


# make sure the version is correct. you might need to look closely
aseprite_version="v1.3.15.2"

curl -LO "https://github.com/aseprite/aseprite/releases/download/${aseprite_version}/Aseprite-${aseprite_version}-Source.zip"

unzip "Aseprite-${aseprite_version}-Source.zip"

mkdir -p ~/src/deps/skia
cd ~/src/deps/skia

skia_version="m124-08a5439a6b"
curl -LO "https://github.com/aseprite/skia/releases/download/${skia_version}/Skia-Linux-Release-x64.zip"
unzip "Skia-Linux-Release-x64.zip"


mkdir -p ~/src/ase/build
cd ~/src/ase/build

cmake \
  -DCMAKE_BUILD_TYPE=RelWithDebInfo \
  -DCMAKE_CXX_FLAGS:STRING=-static-libstdc++ \
  -DCMAKE_EXE_LINKER_FLAGS:STRING=-static-libstdc++ \
  -DLAF_BACKEND=skia \
  -DSKIA_DIR=$HOME/src/deps/skia \
  -DSKIA_LIBRARY_DIR=$HOME/src/deps/skia/out/Release-x64 \
  -DSKIA_LIBRARY=$HOME/src/deps/skia/out/Release-x64/libskia.a \
  -G Ninja ..


ninja aseprite

# cd ~/src/ase/build/bin
# ./aseprite

# make sure the path is set up here
# https://github.com/kristus123/game-engine/blob/master/build_tools/Aseprite.js
