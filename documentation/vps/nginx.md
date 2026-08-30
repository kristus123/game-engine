## Ngingx

```bash
sudo systemctl enable nginx
sudo systemctl start nginx

sudo systemctl status nginx
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

# x

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