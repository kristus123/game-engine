map must be inside the http {} block, not inside a server {} block.

Typically it belongs in /etc/nginx/nginx.conf:

http {
    map $http_upgrade $connection_upgrade {
        default upgrade;
        '' close;
    }

    include /etc/nginx/sites-enabled/*;
}

