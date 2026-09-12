# game-engine


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

cloudflared tunnel --url http://localhost:5050

# cool idea

One cool idea that I will probably never do for now is to basically use SQLite because it has a official WASM library and then you can use the OPFS API for storing files and then just sending the entire database to the server and this can be used for making a very simple backup solution
