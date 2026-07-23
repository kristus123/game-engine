sudo nano /etc/ssh/sshd_config
We'll make several critical changes to secure your SSH server.

Security Setting 1: Disable Root Login (Critical)
Find this line:

#PermitRootLogin prohibit-password
Change it to:

PermitRootLogin no


Security Setting 2: Change the Default Port (Highly Recommended)
Find this line:

#Port 22
Change it to a non-standard port:

Port 2222


sudo ufw allow 2222/tcp


do this later



Add or modify these lines in /etc/ssh/sshd_config:

Limit authentication attempts:

MaxAuthTries 3
MaxSessions 2
This allows 3 password/key attempts and 2 simultaneous SSH sessions per connection. Limits brute-force attempts. The default values are 6 and 10 in Debian 13 ssh config file.

Set login timeout:

LoginGraceTime 60
Disconnects unauthenticated connections after 60 seconds. Prevents hanging connections from consuming resources. The default value is 2m.

Set idle timeout:

ClientAliveInterval 300
ClientAliveCountMax 2
Automatically disconnects idle sessions after 10 minutes (300 seconds × 2 checks). Prevents forgotten sessions from staying open. The default values for these two settings are 0 and 3 respectively.

Force SSH Protocol 2 (already default in Debian 13):

Protocol 2

Step 10: Disable Password Authentication
Now that SSH keys work, disable password authentication completely.

Go back to your Debian 13 server, and open the SSH configuration file again in your preferred text editor:

sudo nano /etc/ssh/sshd_config
Find this line:

#PasswordAuthentication yes
Change it to:

PasswordAuthentication no


Set a Custom Login Banner
Create a banner file:

sudo nano /etc/ssh/banner.txt
Add your warning message:

AUTHORIZED ACCESS ONLY
All activity is monitored and logged.
Unauthorized access is prohibited.
Reference it in /etc/ssh/sshd_config:

Banner /etc/ssh/banner.txt
