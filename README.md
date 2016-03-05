# setrecords-web
## Authors
Oscar Lafarga, Quinn Pruitt, Evan Martinez

## Description
Artist content management platform for Setmine.

#### Setup the Application
Install all needed modules with
```
$ npm install
```
You'll also need webpack and webpack-dev-server installed globally:
```
$ npm install -g webpack webpack-dev-server
```

#### Testing the Application
```
$ npm test
```
Point your browser to localhost:8080. As long as your terminal tab is running, any saved changes to the code will be reflected in the app.

#### Running the Application
```
$ npm run build
$ npm start
```
Then point your browser to localhost:8080 to view the app in production mode.
The above commands can be combined by running:
```
$ npm run deploy
```

Note: Be sure to run
```
$ npm stop
```
when you're finished with the production server. Otherwise you may run into EADDRINUSE errors.
