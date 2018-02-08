//@flow
/*::
type Query = string | number | (any) => boolean;
type Collection<T> = Array<T> | {[key: string]: Collection<T>} | T;
type Mapper<T> = (T) => T;
*/

const assign = require('lodash.assign');
const findIndex = require('lodash.findindex');

function update/*:: <T: Collection<any>>*/(collection/*: T*/, queryList/*: Query[]*/, mapper/*: Mapper<any>*/)/*: T*/ {

  if (queryList.length === 0) {
    return mapper(collection);
  }

  const rootCollection = Array.isArray(collection) ? collection.slice() : assign({}, collection);
  const query = queryList[0];
  let updateTarget;

  if (Array.isArray(rootCollection)) {
    let index/*: number*/ = -1;
    if (typeof query === 'number') {
      updateTarget = rootCollection[query];
      index = query;
    } else if (typeof query === 'function') {
      index = findIndex(rootCollection, query);
      updateTarget = rootCollection[index];
    } else {
      throw new Error(`query type must be number or function for Array. '${typeof query}' was given`);
    }

    if (!updateTarget) {
      throw new Error(`target not found with query '${query.toString()}'`);
    }

    rootCollection[index] = update(updateTarget, queryList.slice(1), mapper);
  } else {
    const key = query.toString();

    if (typeof query === 'string' || typeof query === 'number') {
      updateTarget = rootCollection[key];
    } else {
      throw new Error(`query type must be string or number for Obect. query '${typeof query}' was given`);
    }

    if (!updateTarget) {
      throw new Error(`target not found with query '${query.toString()}'`);
    }

    rootCollection[key] = update(updateTarget, queryList.slice(1), mapper);
  }

  return rootCollection;
}

module.exports = {update};
