#!/usr/bin/env node

var q = require('q');

/**
 * @param resourceName
 */
getResource = function(ctx, resourceName) {
  var namespaces = resourceName.split(".");
  var res = namespaces.pop();
  for(var i = 0; i < namespaces.length; i++) {
    ctx = ctx[namespaces[i]];
  }
  return ctx[res];
};

/**
 * @param resourceName
 * @param params
 */
exports.executeResource = function(ctx, /*resourceName,*/ params) {
  var $d = q.defer();
  console.log('Resource: "' + resourceName + '"');
  console.log('Params: ', params);
  // ctx = getResource(ctx, resourceName);
  var req = ctx(params, function(err, results) {
    if (err) { 
      console.log(err);
      $d.reject(err);
    } else {
      console.log(results);  
      $d.resolve(results);
    }
  });
  console.log(req.uri.href); // print out the request's URL.
  return $d.promise;
};

/**
 * @param parentId
 */
exports.parents = function(parentId) {
  return parentId != undefined ? [ { 'id': parentId } ] : null;
};
