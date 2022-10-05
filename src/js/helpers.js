// import 'regenerator-runtime/runtime.js';
export const getJSON = async function (url) {
  try {
    const response = await fetch(url);
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
