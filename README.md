# Space Game
Work in space as a transporter.

## Features
- pick up and deliver containers
- navigate in space

## Requirements
- Python
- Javascript

## Build/Run
### [Conda](https://github.com/conda/conda) 
- allows separate environments if you have multiple python projects and don't want your dependencies to overlap
```
conda create --name game_engine python=3.10
conda activate game_engine
pip install -r requirements.txt
python app.py
```
### [Python](https://www.python.org/downloads/)
- install python first, ideally version 3.9 or up
```
pip install -r requirements.txt
python app.py
```
#### Expected Output:
```
↳ [master]  ✔
↳ python app.py
[I 230921 07:00:20 server:335] Serving on http://127.0.0.1:5000
[I 230921 07:00:20 handlers:62] Start watching changes
[I 230921 07:00:20 handlers:64] Start detecting changes
[I 230921 07:00:26 handlers:135] Browser Connected: http://localhost:5000/
```

# Resources
[game-engine](https://medium.com/samsung-internet-dev/offscreencanvas-workers-and-performance-3023ca15d7c7)
