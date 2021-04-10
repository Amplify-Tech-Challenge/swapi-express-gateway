const fetch = require("node-fetch");

const buildCharacterDetails = async character => {
  const { homeworld, films, species, vehicles, starships } = character;

  const possibleEndpoints = [
    { homeworld },
    { films },
    { species },
    { vehicles },
    { starships },
  ];

  const validEndpoints = possibleEndpoints.reduce((endpointArray, endPointObject) => {
    const key = Object.keys(endPointObject);
    const value = endPointObject[key];

    if (checkType(value, key) === "array") {
      endpointArray.push(endPointObject);
    } else if (checkType(value, key) === "string") {
      endpointArray.push(endPointObject);
    }
    return endpointArray;
  }, []);

  console.log("valid", validEndpoints);


  // REMOVE repetitive checks if array/string
  // INSTEAD append property above before pushing into acc
  // CHECK appended property below and proceed accordingly


  await validEndpoints.reduce(async (promises, objProperty) => {
    const newObj = await promises;
    const key = Object.keys(objProperty);
    const endpoint = objProperty[key];

    if (checkType(endpoint, key) === "array") {
      const compiledArray = await endpoint.reduce(async (promises, el) => {
        const acc = await promises;
        const data = await fetch(`${el}`);
        acc.push(data);
        return acc;
      }, []);
      newObj[key] = compiledArray;
    } else if (checkType(endpoint, key) === "string") {
      const data = await fetch(`${endpoint}`);
      newObj[key] = data;
    }
    return newObj;
  }, character);

  return character;
};

const checkType = (propertyValue, key) => {
  if (Array.isArray(propertyValue) && propertyValue.length) {
    console.log(`${key} is a valid array of endpoints`);
    return "array";
  } else if (
    typeof propertyValue === "string" &&
    propertyValue.split("/")[0] === "http:"
  ) {
    console.log(`${key} is a valid single endpoint`);
    return "string";
  } else {
    console.log(`${key} has no endpoints`);
    return false;
  }
};

module.exports = buildCharacterDetails;
