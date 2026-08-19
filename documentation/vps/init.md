# initial setup


Hello, hello. Remember to document somewhere that FFM peg needs to be installed because we are using ffmpag for the backend, and it is important to document this stuff, of course. Yes, yes, yes. Awesome



[Login](https://nerdvm.racknerd.com/login.php)

https://github.com/settings/ssh/new

```bash
sudo apt update -y && sudo apt upgrade -y
sudo apt install htop -y

sudo apt install git -y

# Create a user
adduser kristian

/usr/sbin/usermod -a -G sudo kristian

su - kristian
```

```bash
cd
git clone https://github.com/kristus123/game-engine.git

# Switch to ssh later
# git@github.com:kristus123/game-engine.git
```

# Set up crons

```bash
# Every 1 minute
*/1 * * * * cd /home/kristian/game-engine && ./prod/redeploy_if_changes.sh
```

sudo nano /etc/ssh/sshd_config

Make sure these are set:

PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys


# stuff

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh

touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```


sudo nano ~/.ssh/authorized_keys

# content of file, todo make it auto fill in the file

```bash
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIHXoYbJPGmeJ2Jm6h6ixfty9YKNc4KdmN0nBfrsSSCrf krispetter@gmail.com
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKPflnfPPJmsEJyV1Zo760mRKvQ4ckMjnRmAXk7SzSH2 mushfiquefarhannabir@gmail.com
```



```bash
ssh-keygen -t ed25519 -C "krispetter@gmail.com"

eval "$(ssh-agent -s)"

ssh-add ~/.ssh/id_ed25519

cat ~/.ssh/id_ed25519.pub

echo "put this into"
echo "___"
echo "https://github.com/kristus123/game-engine/settings/keys/new"
echo "___"
```


# Set up passwordless

Outside of server

```bash
ssh-copy-id kristian@krispetter.duckdns.org
# then type in vps password
```

```bash
sudo nano /etc/ssh/sshd_config

# set the current values
PasswordAuthentication no
PubkeyAuthentication yes
PermitRootLogin prohibit-password
```

Then run this command

```bash
ssh-copy-id user@krispetter.duckdns.org
```

## disable need for password

```
sudo visudo
```

Place this at the bottom of the file

```
kristian ALL=(ALL:ALL) NOPASSWD: ALL
```

and finally:

```bash
# you could also just restart ssh, but i prefer simple shit
sudo reboot now
```

## Ngingx

```bash
sudo apt update -y
sudo apt install nginx -y

sudo systemctl enable nginx
sudo systemctl start nginx

sudo systemctl status nginx
```
## ufw

```bash
sudo apt install ufw -y

sudo ufw default deny incoming
sudo ufw default allow outgoing

sudo ufw allow OpenSSH
sudo ufw limit OpenSSH

sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# mediasoup sfu
ufw allow 40000:49999/udp

sudo ufw enable
```

# Ngingx config

map must be inside the http {} block, not inside a server {} block.

```bash
sudo nano /etc/nginx/nginx.conf
```

```bash
http {
    map $http_upgrade $connection_upgrade {
        default upgrade;
        '' close;
    }

    include /etc/nginx/sites-enabled/*;
}
```

## Other stuff

```bash
sudo rm /etc/nginx/sites-available/default
```


```bash
sudo nano /etc/nginx/sites-available/krispetter.duckdns.org
```

```bash
server {
    listen 80;
    server_name krispetter.duckdns.org;

    location / {
        proxy_pass http://127.0.0.1:3000;

        
        proxy_buffering off;
        proxy_cache off;

        proxy_http_version 1.1; # Enable HTTP/1.1 for WebSocket support
        proxy_set_header Upgrade $http_upgrade; # Forward WebSocket upgrade request
        proxy_set_header Connection "upgrade"; # Tell nginx to switch connection protocol

        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/krispetter.duckdns.org /etc/nginx/sites-enabled/krispetter.duckdns.org
```

## certbot

```bash
sudo apt update -y
sudo apt install certbot python3-certbot-nginx -y

sudo certbot --nginx
sudo certbot renew --dry-run
```

## final test

```bash
sudo nginx -t
sudo systemctl reload nginx
```

# Setup SFU Ports
In this engine `mediasoup` is used for SFU.
When creating SFU Transports we need to specify a `portRange`.

Look at port range in `SfuServerApi.js`:
That means that the vps firewall should allow access to these ports.

For `ufw` you can add a rule for these port ranges using:
```
sudo ufw allow 40000:49999/udp
sudo ufw allow 40000:49999/tcp
```

# set up duckdns

TODO
