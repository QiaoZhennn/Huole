server {
        listen 8080;
        listen [::]:8080;

        root /var/www/huole-staging;
        index index.html index.htm index.nginx-debian.html;

        server_name huole-staing.huobidev.com www.huole-staging.huobidev.com;

        location / {
                try_files $uri /index.html;
        }
}
