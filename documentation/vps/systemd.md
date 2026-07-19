# Systemd setup

- aseprite is not needed to run server.

```bash
cd
sudo apt update -y
sudo apt install curl -y

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash

source ~/.bashrc

nvm install node
```


```
sudo nano /etc/systemd/system/game-engine.service
```

```bash
[Unit]
Description=game-engine backend
After=network.target

[Service]
Type=simple
User=kristian
WorkingDirectory=/home/kristian/game-engine
ExecStart=/home/kristian/.nvm/versions/node/v26.5.0/bin/node start.js PRODUCTION
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```


```bash
sudo systemctl daemon-reload
sudo systemctl enable game-engine
sudo systemctl start game-engine
```

```bash
sudo systemctl daemon-reload
sudo systemctl restart game-engine
sudo systemctl status game-engine
```

```bash
sudo journalctl -u game-engine -f
```
