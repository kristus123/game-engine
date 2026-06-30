# initial setup

[Login](https://nerdvm.racknerd.com/login.php)

```bash
sudo apt update -y && sudo apt upgrade -y

# Create a user
adduser kristian

/usr/sbin/usermod -a -G sudo kristian

su - kristian
```

# Set up passwordless

Outside of server

```bash
ssh-copy-id kristian@107.175.8.166
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
ssh-copy-id user@107.175.8.166
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



# set up duckdns

TODO
