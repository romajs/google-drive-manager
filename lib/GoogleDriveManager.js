#!/usr/bin/env node

var q = require('q');

var google = require('googleapis');
// var core = require('./Core');
var session = require('./ApiSession');
var utils = require('./Utils');

module.exports.drive;
module.exports.auth;

getResource = function(ctx, resourceName) {
  var namespaces = resourceName.split(".");
  var res = namespaces.pop();
  for(var i = 0; i < namespaces.length; i++) {
    ctx = ctx[namespaces[i]];
  }
  return ctx[res];
};

executeResource = function(ctx, resourceName, params) {
  console.log('Resource: "' + resourceName + '"');
  console.log('Params: ', params);
  var $d = q.defer();
  try {
    ctx = getResource(ctx, resourceName);
    var req = ctx(params, function(err, results) {
      if (err) { 
        console.log(err);
        $d.reject(err);
      } else {
        console.log(results);  
        $d.resolve(results);
      }
    });
    console.log(req.uri);
    console.log(req.uri.href); // print out the request's URL.
  } catch(err) {
    $d.reject(err);
  }
  // setTimeout(function(){ $d.resolve('bla') }, 3000);
  return $d.promise;
};

/**
 * @param parentId
 */
parents = function(parentId) {
  return parentId != undefined ? [ { 'id': parentId } ] : null;
};


/**
 * @param clientSecretJson
 * @see https://github.com/google/google-api-nodejs-client
 */
exports.authorize = function(clientSecretJson, authConfig) {
  // Authorize a client with the loaded credentials, then load the Drive API.
  return utils.readJson(clientSecretJson).then(function(credentials) {
    console.log('Creating client session');
    return session.authorize(authConfig, credentials);
  }, function(err) {
    console.log('Error loading client secret file: ' + err);
    throw err;
  }).then(function(auth) {
    console.info('Loading drive api', auth);
    module.exports.auth = auth;
    return module.exports.drive = google.drive({ auth: auth, version: 'v2' });
  });
};

/**
 * @param fileOptions
 * @see https://developers.google.com/drive/v2/reference/files/insert
 */
exports.insert = function(fileOptions) {
  return executeResource(module.exports.drive, 'files.insert', fileOptions);
};

/**
 * @param title
 * @param parentId (optional)
 */
exports.createFolder = function (title, parentId) {
  console.log('Creating folder: ', title);
  console.log('At: ', parentId);
  return executeResource(module.exports.drive, 'files.insert',
    { resource : {
      title: title,
      mimeType: 'application/vnd.google-apps.folder',
      parents : parents(parentId),
    }
  });
};

/**
 * @param filePath
 * @param parentId (optional)
 */
exports.uploadFile = function(filePath, parentId) {
  // var self = this;
  console.info('Uploading: ' + filePath);
  // try {
    return utils.readFile(filePath).then(function(result) {
      return executeResource(module.exports.drive, 'files.insert', {
        resource: {
          title: utils.fileName(filePath),
          mimeType: null, // TODO
          parents : self.parents(parentId),
        },
        media:{
          mimeType: null, // TODO
          body: result
        }
      });
    });
  // } catch(err) {
  //   if (err.code == 'ENOENT') {
  //     console.log('File \"' + filePath + '\" not found!');
  //   } else {
  //     throw err;
  //   }
  // }
};


/**
 * @param filePath
 * @param parentId (optional)
 */
exports.uploadFiles = function(filePath, parentId) {
  var d = q.defer();
  var size = filePath.length;
  var count = 0;
  // TODO
  // for(var i in files) {
  //   module.exports.uploadFile(files[i], parentId).then(function() {
  //     count++;
  //     if(count == size) {
  //       d.resolve(count);
  //     }
  //   });
  // }
  setTimeout(function(){ d.resolve() }, 1000);
  return d.promise;
};

/**
 * @param fileOptions
 * @see https://developers.google.com/drive/v2/reference/children/list
 */
exports.search = function (fileOptions) {
  return executeResource(module.exports.drive, 'children.list', fileOptions);
};

/**
 * @param title
 * @param parentId (optional)
 */
exports.searchFolder = function (title, parentId) {
  console.log('Search folder: ', title);
  console.log('At: ', parentId);
  console.info(executeResource);
  return executeResource(module.exports.drive, 'children.list', { 
    q:"mimeType='application/vnd.google-apps.folder' and title='"+title+"' and trashed=false",
    folderId : parentId,
  });
};

