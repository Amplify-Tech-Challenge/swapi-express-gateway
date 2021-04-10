const fetch = require("node-fetch");

const buildCharacterDetails = async character => {
  // TODO refactor to check w/object.keys, push into array
  const { homeworld, films, species, vehicles, starships } = character;
  const endpoints = [
    { homeworld },
    { films },
    { species },
    { vehicles },
    { starships },
  ];

  //TODO pop out empty/invalid arrays
  //TODO consider purposeful breaks
  // get only whats asked

  await endpoints.reduce(async (promises, objProperty) => {
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
