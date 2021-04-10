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
      endpointArray.push([...key, value, 'array']);
    } else if (checkType(value, key) === "string") {
      endpointArray.push([...key, value, 'string']);
    }
    
    return endpointArray;
  }, []);

  await validEndpoints.reduce(async (promises, endpointData) => {
    const key = endpointData[0];
    const newObj = await promises;
    console.log(`processing ${key} (${endpointData[2]}) data`)

    if (endpointData[2] === "array") {
      const compiledArray = await endpointData[1].reduce(async (promises, el) => {
        const acc = await promises;
        const response = await fetch(`${el}`);
        const data = await response.json()
        acc.push(data);
        return acc;
      }, []);
      
      newObj[key] = compiledArray;

    } else if (endpointData[2] === "string") {
      const data = await fetch(`${endpointData[1]}`);
      newObj[key] = await data.json();

    }
    return newObj;

  }, character);

  return character;
};

const checkType = (propertyValue, key) => {
  if (Array.isArray(propertyValue) && propertyValue.length) {
    // console.log(`${key} is a valid array of endpoints`);
    return "array";
  } else if (
    typeof propertyValue === "string" &&
    propertyValue.split("/")[0] === "http:"
  ) {
    // console.log(`${key} is a valid single endpoint`);
    return "string";
  } else {
    // console.log(`${key} has no endpoints`);
    return false;
  }
};

module.exports = buildCharacterDetails;
