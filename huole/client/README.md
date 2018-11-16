The front-end part was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). If you'd like to customize package.json look into ejecting. However, ejecting is one way. So be careful and make sure you know what you're doing. 

Deploy process:
```
# here is how to deploy. Build the project in the corresponding directories and you're done.
# e.g. in /home/huole/staging/sunnynet/huole/client
npm run build
```

Here is how the deployment process works:
The docker image is built from Dockerfile, make sure rebuild the image if you've changed the Dockerfile.
```
docker build -t huole/prod -f Dockerfile.prod .
docker build -t huole/staging -f Dockerfile.staging .
```

After buildling the image, mount the build dir to the www dir:
```
# in /home/huole/staging/sunnynet/huole/client
docker run -d -it --name huole-prod-nginx -p 80:80 -v $PWD/build/:/var/www/huole huole/prod
# in /home/huole/prod/sunnynet/huole/client
docker run -d -it --name huole-prod-nginx -p 8080:8080 -v $PWD/build/:/var/www/huole-staging/ huole/staging
```
