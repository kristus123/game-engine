# initial setup

[Login](https://nerdvm.racknerd.com/login.php)







```bash
sudo apt update -y && sudo apt upgrade -y

sudo apt install htop -y
sudo apt install ffmpeg -y
sudo apt install git -y
sudo apt install nginx -y
sudo apt install ufw -y

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

# ssh 

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh

cat > ~/.ssh/authorized_keys <<'EOF'
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOERhQy7ruPDHtfITG7ia/4qrF4q7u3T8H6s89nh/qEe krispetter@gmail.com
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKPflnfPPJmsEJyV1Zo760mRKvQ4ckMjnRmAXk7SzSH2 mushfiquefarhannabir@gmail.com
EOF

chmod 600 ~/.ssh/authorized_keys
```







Outside of server

```bash
ssh-copy-id kristian@krispetter.duckdns.org
# then type in vps password
```
# x

```bash
sudo nano /etc/ssh/sshd_config
```

```bash
# set the current values
PasswordAuthentication no
PubkeyAuthentication yes
PermitRootLogin prohibit-password
AuthorizedKeysFile .ssh/authorized_keys
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
sudo sshd -t && sudo systemctl reload ssh
# Test if this works!
```


# stuff



Todo should not use my private key

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

## ufw

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing

sudo ufw allow OpenSSH
sudo ufw limit OpenSSH

sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# mediasoup sfu
sudo ufw allow 40000:49999/udp
sudo ufw allow 40000:49999/tcp

sudo ufw enable
```

# set up duckdns

TODO
