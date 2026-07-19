```
sudo nano /etc/systemd/system/game-engine.service
```

cd
sudo apt update -y
sudo apt install curl -y

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash

source ~/.bashrc

nvm install node


```bash
[Unit]
Description=My Node App
After=network.target

[Service]
Type=simple
User=kristian
WorkingDirectory=/home/kristian/game-engine
ExecStart=/home/kristian/.nvm/versions/node/v26.5.0/bin/node index.js
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
sudo systemctl status game-engine
sudo systemctl restart game-engine
```
