## create file

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

## create file

```
sudo nano /etc/systemd/system/game-engine-auto-redeploy-if-changes.service
```

```
[Unit]
Description=auto redeploy if changes

[Service]
Type=simple
User=kristian
WorkingDirectory=/home/kristian/game-engine
ExecStart=/home/kristian/game-engine/prod/redeploy_if_changes.sh
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```


## first time startup

```bash
sudo systemctl daemon-reload

sudo systemctl enable game-engine
sudo systemctl start game-engine

sudo systemctl enable game-engine-auto-redeploy-if-changes
sudo systemctl start game-engine-auto-redeploy-if-changes
```
