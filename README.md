# Gabor Ivan's Static Website 

This is the Jekyll and architecture source code of the [gaborivan.de](https://gaborivan.de) website. 

## 1. License

The content of the `.html` files in the [src](src) folder and the image assets are protected by copyright, the rest is free for learning and using.

## Developer notes
### Host commands

To startup the container and get inside, run:
```
docker-compose up -d
docker exec -it -u dev gaborivan bash
```

When the work is done, run the following:
```
docker-compose stop
docker-compose down -v
```

### Container commands

To initialize container you need to install some `apk`, `npm` and `gem` packages to the Alpine Linux: 
```
sudo apk add clang make ruby-dev libffi-dev
npm install
sudo gem install bundler jekyll
sudo bundle install
```

If there were no errors, you can start compiling the code with:

```
npm run build
npm run develop
```