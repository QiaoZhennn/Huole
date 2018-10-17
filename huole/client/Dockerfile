FROM ubuntu:16.04
RUN \
  apt-get update && \
  apt-get install -y nginx 

add . /home/huole-client
RUN mkdir -p /var/www/huole
RUN cp /home/huole-client/huole.huobidev.com /etc/nginx/sites-available/
RUN ln -s /etc/nginx/sites-available/huole.huobidev.com /etc/nginx/sites-enabled/
RUN cp /home/huole-client/nginx.conf /etc/nginx/

ENTRYPOINT ["/usr/sbin/nginx", "-g", "daemon off;"]
EXPOSE 80
