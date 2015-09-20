#!/usr/bin/env node

/* 
 * Usage: nodejs example.js <client secret path> <parent folder ID> <files to upload>
 * 
 * Example: nodejs example.js client_secret.json 0B_SPtvg96z_ZflJSN0x test1.txt test2.txt test3.txt
 */

var googleDriveManager = require('./lib/GoogleDriveManager');


var clientSecretJsonPath = process.argv[2]; // params[0] = client secret json path
var parentFolderId = process.argv[3] // params[1] = files to upload
var filesToUpload = process.argv.slice(4) // params[2..n] = files to upload


console.log('>Client Secret JSON: ' + clientSecretJsonPath);
console.log('>Parent folder ID: ' + parentFolderId);
console.log('>Files to upload: ' + filesToUpload);


if(clientSecretJsonPath == undefined) {
  throw { code: 'MISSING_CLIENT_SECRET', message: 'Client secret NOT specified!' };
}
if(parentFolderId == undefined) {
  throw { code: 'MISSING_PARENT_FOLDER_ID', message: 'Parent folder ID NOT specified!' };
}
if(filesToUpload.length == 0) {
  throw { code: 'MISSING_UPFILES', message: 'Upload files NOT specified!' };
}

random = function(n) {
  return Math.round(Math.random() * n);
}

googleDriveManager.authorize(clientSecretJsonPath).then(function (drive) {

  var folderTitle = 'test-' + random(100);
  console.info('Initiatin upload to: ', folderTitle);

  return googleDriveManager.searchFolder(folderTitle, parentFolderId).then(function(result) {
    if(!result.items || result.items.length == 0) {
      console.log('Folder title not found', folderTitle)
      return googleDriveManager.createFolder(folderTitle, parentFolderId).then(function(result) {
        return result.id;
      });
    } else {
      console.log('Retrieving folder title', folderTitle)
      return result.items[0].id;
    }
  });

}, function(err) {
  console.info('Failed', err);
}).then(function(childFolderId) {
  console.info('Uploading files: ', filesToUpload, ' to: ', childFolderId);
  return googleDriveManager.uploadFiles(filesToUpload, childFolderId);
}).then(function() {
  console.info('Done');
});
