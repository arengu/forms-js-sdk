class Utilities {

  static getUrlParam(param) {
    return new URL(location.href).searchParams.get(param);
  }

  static indexObject (array, identity) {
    if (!array) {
      return {};
    }

    return array.reduce((obj, item) =>{
      obj[item[identity]] = item;
      return obj;
    }, {})
  }

  static includes (collection, value) {
    // old browsers do not implement .includes()
    return collection.indexOf(value) !== -1;
  }

}

module.exports = Utilities;
