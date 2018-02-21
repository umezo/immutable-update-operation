'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

//@flow
/*::
type Query = string | number | (any) => boolean;
type Collection<T> = Array<T> | {[key: string]: Collection<T>} | T;
type Mapper<T> = (T) => T;
*/

var assign = require('lodash.assign');
var findIndex = require('lodash.findindex');

function update /*:: <T: Collection<any>>*/(collection /*: T*/, queryList /*: Query[]*/, mapper /*: Mapper<any>*/) /*: T*/{

  if (queryList.length === 0) {
    return mapper(collection);
  }

  var rootCollection = Array.isArray(collection) ? collection.slice() : assign({}, collection);
  var query = queryList[0];
  var updateTarget = void 0;

  if (Array.isArray(rootCollection)) {
    var index /*: number*/ = -1;
    if (typeof query === 'number') {
      updateTarget = rootCollection[query];
      index = query;
    } else if (typeof query === 'function') {
      index = findIndex(rootCollection, query);
      updateTarget = rootCollection[index];
    } else {
      throw new Error('query type must be number or function for Array. \'' + (typeof query === 'undefined' ? 'undefined' : _typeof(query)) + '\' was given');
    }

    if (!updateTarget) {
      throw new Error('target not found with query \'' + query.toString() + '\'');
    }

    rootCollection[index] = update(updateTarget, queryList.slice(1), mapper);
  } else {
    var key = query.toString();

    if (typeof query === 'string' || typeof query === 'number') {
      updateTarget = rootCollection[key];
    } else {
      throw new Error('query type must be string or number for Obect. query \'' + (typeof query === 'undefined' ? 'undefined' : _typeof(query)) + '\' was given');
    }

    if (!updateTarget) {
      throw new Error('target not found with query \'' + query.toString() + '\'');
    }

    rootCollection[key] = update(updateTarget, queryList.slice(1), mapper);
  }

  return rootCollection;
}

module.exports = { update: update };