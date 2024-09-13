## Terminal Commands ##
 >npm i express 
- installs express as a dependency
 >npm i -D nodemon
 - installs nodemon as a development dependency, allows you to run your app in watch mode - as you are saving changes, process will automatically restart
 - need to add two scripts in JSON: 
    1) start:dev -- starts with nodemon in dev 
    2) start -- starts without nodemon
>npm init -y
- he command npm init -y is used to quickly initialize a new Node.js project by creating a package.json file with default settings.

## gitIgnore ##

 > touch .gitignore
 - creates gitIgnore file from [github](https://github.com/github/gitignore/blob/main/Node.gitignore)

 >git add 

 >.git commit -m "Commit before cleaning up ignored files"

 >git rm -r --cached .

 > git add .

 > git commit -m "Remove ignored files from tracking"
 - remove files you don't want to track if you committed before creating the gitIgnore

## JSON ##

> "type:" "module"
- allows us to use modern import / export statements 

## app = express() ##

What Does express() Do?

1) Creates an Application Instance: The function returns an Express application object that you can use to set up your server.

2) Provides Methods for Routing: The application object includes methods like app.get(), app.post(), app.put(), and app.delete() to define route handlers for different HTTP methods and endpoints.

3) Middleware Configuration: You can use app.use() to add middleware functions that execute during the request-response cycle. This is useful for tasks like parsing request bodies, handling cookies, or logging.

4) Server Configuration: Methods like app.set() and app.enable() allow you to configure various settings for your application.

5) Starts the Server: Finally, you can use app.listen(port, callback) to start your server and have it listen on a specific port.