google-drive-manager
===

Custom google api rest service manager for (googleapis) [https://github.com/google/google-api-nodejs-client/], wraps it for easy usage of common tasks such as create folders and upload files.

### Install

``
./setup.sh
``

### Usage

``
var googleDriveManager = require('./lib/GoogleDriveManager');
``

### Example

For more information please see **example.js**, run as:

``
nodejs example.js client_secret.json 0B_SPtvg96z_ZflJSN0x test1.txt test2.txt test3.txt
``

### Methods available

* authorize

* insert

* createFolder

* createFolderIfNotExists

* search

* searchFolder

* uploadFile

* uploadFiles
