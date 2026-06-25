# initial setup

[Login](https://nerdvm.racknerd.com/login.php)

```bash
ssh-copy-id root@107.175.8.166

# then type in vps password
```

[password is currently stored in my lastpass (link won't work for anyone except me)](chrome-extension://hdokiejnpimakedhajhdlcegeplioahd/edit.html?id=7572799172324880476)

```bash
sudo nano /etc/ssh/sshd_config

# set the current values
PasswordAuthentication no
PubkeyAuthentication yes
PermitRootLogin prohibit-password
```

```bash
sudo systemctl restart ssh
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

## certbot


```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx

sudo certbot --nginx
sudo certbot renew --dry-run
```


## edit ngisngs

sudo nginx -t
sudo systemctl reload nginx
