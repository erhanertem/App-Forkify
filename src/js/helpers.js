import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    const response = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]); //race two promises either url fetches in 10 seconds or timeout throws a reject promise
    const data = await response.json();

    //->Serverside fetch err check
    if (!response.ok) throw new Error(`${data.message} (${response.status})`);
    // console.log(response, data, data.data);};

    //->Return the data if no err
    return data;
  } catch (err) {
    // console.log(err);
    throw err; //shoots to model.loadRecipe.catch err block
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const response = await Promise.race([
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadData),
      }), //Fetch Web API post configuration
      timeout(TIMEOUT_SEC),
    ]);
    const data = await response.json();

    //->Serverside fetch err check
    if (!response.ok) throw new Error(`${data.message} (${response.status})`);
    // console.log(response, data, data.data);};

    //->Return the data if no err
    return data;
  } catch (err) {
    // console.log(err);
    throw err; //shoots to model.loadRecipe.catch err block
  }
};
