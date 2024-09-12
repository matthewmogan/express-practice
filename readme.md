## Terminal Commands ##
 >npm i express 
- installs express as a dependency
 >npm i -D nodemon
 - installs nodemon as a development dependency, allows you to run your app in watch mode - as you are saving changes, process will automatically restart
 - need to add two scripts in JSON: 
    1) start:dev -- starts with nodemon in dev 
    2) start -- starts without nodemon

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