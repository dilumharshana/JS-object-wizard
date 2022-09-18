/**
 * Helper function to create and update json objects
 * @param {*} currentJson = your existing json or send 'null' for create a new  json
 * @param {*} targetKey = key that you want to update inside your json
 * @param {*} dataSet = new data to be set
 * @returns
 */

export const editJson = (currentJson = null, targetKey, dataSet) => {
  if (currentJson) {
    //updating existing json
    return handleUpdate(currentJson, targetKey, dataSet);
  } else {
    //create a new json
    return handleInsert(targetKey, dataSet);
  }
};

//------------------------- Main Handler functions ------------------------

/**
 *
 * @param {*} targetKey key that you wish to update
 * @param {*} dataSet new data to be set
 * @returns newly created json with targetKey
 */
const handleInsert = (targetKey, dataSet) => {
  const newJson = {};

  newJson[targetKey] = dataSet;

  return newJson;
};

/**
 *
 * @param {*} currentJson your existing json
 * @param {*} targetKey key that you wish to update
 * @param {*} dataSet dataSet new data to be set
 * @returns updated json with new values
 */
const handleUpdate = (currentJson, targetKey, dataSet) => {
  const json = { ...currentJson };
  const currentSection = json[targetKey] || null;

  //   console.log(json)
  //   console.log(json[targetKey])

  if (currentSection) {
    if (isObject(dataSet)) {
      const updatedSection = handleObjects(currentSection, dataSet);
      json[targetKey] = updatedSection;
    }

    if (isArray(dataSet)) {
      const updatedArray = handleArrays(currentSection, dataSet);
      json[targetKey] = updatedArray;
    }
  } else {
    json[targetKey] = dataSet;
  }

  return json;
};

//------------------------ Task functions -------------------------------

/**
 *
 * @param {*} currentObject selected object to be edit
 * @param {*} dataSet new data values to be set
 * @returns object that created or updated
 */
const handleObjects = (currentObject, dataSet) => {
  //keys to be update | insert
  const updatedKeys = Object.keys(dataSet);

  updatedKeys.forEach((key) => {
    //if json object contains this selected key -> update key
    if (currentObject.hasOwnProperty(key)) {
      //if key refers to a object value -> key:{}
      if (isObject(currentObject[key])) {
        const updatedObject = handleObjects(currentObject[key], dataSet[key]);
        currentObject[key] = updatedObject;
        return;
      }

      //if key refers to a array value -> key :[]
      if (isArray(currentObject[key])) {
        const updatedArray = handleArrays(currentObject[key], dataSet[key]);
        currentObject[key] = updatedArray;
        return;
      }

      //if key is a pure key value pare -> key:value
      currentObject[key] = dataSet[key];

      // //check if object contain itemIndex property which is not a necessary property now
      // const removeItemIndex = dataSet["itemIndex"] || null;

      // //if property exists then remove it
      // if (removeItemIndex) {
      //   const { itemIndex, ...otherValues } = dataSet;
      //   dataSet = otherValues;
      // }
    }
    //if json object not contains this selected key -> insert key
    else {
      currentObject[key] = dataSet[key];
    }
  });

  return currentObject;
};

/**
 *
 * @param {*} currentArray selected array to be edit
 * @param {*} dataSet new data values to be set
 * @returns array that created or updated
 */
const handleArrays = (currentArray, dataSet) => {
  dataSet.forEach((item, index) => {
    //selecting target index from existing array

    const isExistingItem = currentArray[item?.["itemIndex"]];
    const isDelete = item?.removedItem === true;

    //if target index exist -> update target index
    if (isExistingItem) {
      if (isDelete) {
        const newArray = currentArray
          ?.filter((current_item) => {
            return (
              current_item?.["itemIndex"] !== isExistingItem?.["itemIndex"]
            );
          })
          .map((filteredItem, index) => {
            return { ...filteredItem, itemIndex: index };
          });

        console.log("new Array = >", newArray);

        return (currentArray = newArray);
      }

      //if key refers to a object value -> [ {} , {}]
      if (isObject(isExistingItem)) {
        // if(index === item[itemIndex]){
        const updatedItem = handleObjects(currentArray[index], item);
        currentArray[index] = updatedItem;
        // }
        return;
      }

      //if key refers to a array value -> [ [] , []]
      if (isArray(isExistingItem)) {
        const updatedArray = handleArrays(isExistingItem, item);
        currentArray[index] = updatedArray;
        return;
      }

      //if key contain scalar key values -> [ a ,b ]
      currentArray[index] = item;
      return;
    }
    //if target index not exist -> inserting target index
    else {
      if (!isDelete) {
        currentArray[item["itemIndex"]] = item;
      }
    }
  });

  return currentArray;
};

//----------------------- Helper functions --------------------------------

/**
 * Helper function to check a item is an object
 * @param {*} object object to be check
 * @returns true or false
 */
export const isObject = (object) =>
  Object.prototype.toString.call(object) === "[object Object]";

/**
 * Helper function to check a item is an array
 * @param {*} object object to be check
 * @returns true or false
 */
export const isArray = (object) => Array.isArray(object);
