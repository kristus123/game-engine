```
sudo apt update
sudo apt upgrade -y
sudo apt install build-essential curl git wget cmake pkg-config -y
```

```
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh

```
