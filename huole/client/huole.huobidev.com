server {
        listen 80;
        listen [::]:80;

        root /var/www/huole;
        index index.html index.htm index.nginx-debian.html;

        server_name huole.huobidev.com www.huole.huobidev.com;

        location / {
                try_files $uri /index.html;
        }
}
