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
