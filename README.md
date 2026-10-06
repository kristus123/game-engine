# game-engine

```bash
codex mcp add chrome-devtools -- npx -y chrome-devtools-mcp@latest
```


GDD is in another [github repo](https://github.com/kristus123/sapmi-game)

# good-to-have commits

https://github.com/kristus123/game-engine/commit/56bc93f284384e0ced520553c1b6cedf13aa8785

## backend-folder-refactor

Removed `backend/production`

https://github.com/kristus123/game-engine/commit/afd454d460ffa640fd31b964b3b039ea7ee0eef5


# TEST

sudo mkdir -p --mode=0755 /usr/share/keyrings
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null

echo "deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared any main" | sudo tee /etc/apt/sources.list.d/cloudflared.list

sudo apt-get update
sudo apt-get install cloudflared

cloudflared tunnel login

cloudflared tunnel --url http://localhost:3000
update config.js with the url in prod, then you can deploy
cloudflare gives free tunnel if you have a domain. (which i have)

```
cloudflared tunnel create test

mkdir -p ~/.cloudflared
nano ~/.cloudflared/config.yml


tunnel: 777002b4-fcce-4b9c-9725-411daf2ad03d
credentials-file: /home/kristian/.cloudflared/777002b4-fcce-4b9c-9725-411daf2ad03d.json

ingress:
  - hostname: test.happysun.no
    service: http://localhost:3000
  - service: http_status:404


cloudflared tunnel route dns test test.happysun.no

cloudflared tunnel run test


cloudflared tunnel --loglevel debug run test
```

# cool idea

One cool idea that I will probably never do for now is to basically use SQLite because it has a official WASM library and then you can use the OPFS API for storing files and then just sending the entire database to the server and this can be used for making a very simple backup solution


# LAter

Yep. With UFW, you can allow Cloudflare's IP ranges and block everyone else.
But since you're using a Cloudflare Tunnel, you likely don't need to allow Cloudflare IPs at all for your web server. You can simply keep port 3000 inaccessible externally.
If you have nginx on 80/443, though, use:
sudo ufw allow ssh
sudo ufw allow from 173.245.48.0/20 to any port 80 proto tcp
sudo ufw allow from 173.245.48.0/20 to any port 443 proto tcp
