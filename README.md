Javascript puzzle
======

Configuration : 
-------------------------
* username -> user name to display once the puzzle is completed
* mode -> can be either "dragdrop" or "click". If the browser doesn't support HTML5 drag&drop, the game is automatically fallbacked into "click" mode
* image -> complete url to the image that we use for the puzzle (the original image can be stretched relatively to "colums", "rows" and "pieceSize" parameters)
* columns -> number of columns
* rows -> number of rows
* pieceSize -> size of each squared piece in pixels
* doubleclick -> configuration of double-click action on one piece
    * doubleclick.mode -> can be either "link" (opens a link in a new tab) or youtube (display a youtube video inside a popin)
    * doubleclick.url  -> link url
    * doubleclick.id -> youtube video identifier

*two sample configuration files are available in the root folder (the one used by the application is config.json)*

To test the application : 
------------------------------
simply put the repository content into 'DocumentRoot' of an Apache server or 'root' folder for Nginx


Tested browsers : 
------------------------------
* Chrome 34
* Chrome Canary 36
* Firefox 28/29
* Internet Explorer 10/9(compatibility mode)