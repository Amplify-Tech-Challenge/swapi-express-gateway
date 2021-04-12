const fetch = require('node-fetch');

async function getCharacters(mode) {
  const endpoint = "https://swapi.py4e.com/api/people/";

  async function getCharacterList(pageNo = 1) {
    const actualUrl = endpoint + `?page=${pageNo}`;
    const request = await fetch(actualUrl);
    const data = await request.json();
    const results = data.results;
    return results;
  };

  async function getEntireCharacterList(pageNo = 1) {
    const results = await getCharacterList(pageNo);
    console.log("Retrieving data from API for page : " + pageNo);

    if (!results) {
      return;
    } else {
      if (mode === "test") {
        return results;
      }

      const nextPage = await getEntireCharacterList(pageNo + 1);

      if (!nextPage) {
        return results;
      } else {
        return results.concat(nextPage);
      }
    }
  };

  const results = await getEntireCharacterList();
  return results;
};

module.exports = getCharacters;
