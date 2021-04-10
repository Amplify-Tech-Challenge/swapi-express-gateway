const getCharacters = async mode => {
  const endpoint = "https://swapi.dev/api/people/";

  const getCharacterList = async (pageNo = 1) => {
    const actualUrl = endpoint + `?page=${pageNo}`;

    try {
      const request = await fetch(actualUrl);
      const data = await request.json();
      const results = data.results;
      return results;
    } catch (e) {
      res.status(400).end();
    }
  };

  const getEntireCharacterList = async (pageNo = 1) => {
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

export default getCharacters;
