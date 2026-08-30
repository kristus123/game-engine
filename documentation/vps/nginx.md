## Ngingx

```bash
sudo systemctl enable nginx
sudo systemctl start nginx

sudo systemctl status nginx
```

# Ngingx config


```bash
sudo nano /etc/nginx/nginx.conf
```

map must be inside the http {} block, not inside a server {} block.


```bash
http { # don't add this line
    map $http_upgrade $connection_upgrade {
        default upgrade;
        '' close;
    }

    include /etc/nginx/sites-enabled/*;
} # don't add this line
```

# x

```bash
sudo rm /etc/nginx/sites-available/default
sudo rm /etc/nginx/sites-enabled/default
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
sudo certbot --nginx \
  --non-interactive \
  --agree-tos \
  --email krispetter@gmail.com \
  --no-eff-email \
  -d krispetter.duckdns.org

sudo certbot renew --dry-run


sudo nginx -t
sudo systemctl reload nginx
```