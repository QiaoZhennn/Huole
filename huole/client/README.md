The front-end part was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). If you'd like to customize package.json look into ejecting. However, ejecting is one way. So be careful and make sure you know what you're doing. 

Deploy process:
```
# here is how to deploy. Build the project in this directory and you're done.
npm run build
```

Here is how the deployment process works:
The docker image is built from Dockerfile, make sure rebuild the image if you've changed the Dockerfile.
```
# alant/huole is the name of the image
build -t alant/huole .
```

After buildling the image, mount the build dir to the www dir:
```
docker run -d -it --name huole-nginx -p 80:80 -v $PWD/build/:/var/www/huole alant/huole
```
