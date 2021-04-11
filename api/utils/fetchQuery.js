const baseUrl = "https://swapi.dev/api"

async function fetchQuery(path, params = null, endpoint) {
  let url;

  if (params !== null) {
    url = `${baseUrl}/${path}/${params}`;
  } else if (path !== null) {
    url = `${baseUrl}/${path}`;
  } else {
    url = endpoint
  }

  const response = await fetch(`${url}`);
  const data = await response.json();
  return data;
}

export { baseUrl, fetchQuery };
