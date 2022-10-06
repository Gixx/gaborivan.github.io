# Gabor Ivan's Static Website 

This is the Jekyll and architecture source code of the [gaborivan.de](https://gaborivan.de) website. 

## 1. License

The content of the `.html` files in the [src](src) folder and the image assets are protected by copyright, the rest is free for learning and using.

## Developer notes
Host commands
```
docker-compose up -d
docker exec -it -u dev gabor bash
docker-compose stop
docker-compose down -v
```

Container commands
```
npm install
sudo bundle install
npm run build
npm run develop
```