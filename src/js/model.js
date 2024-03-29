import { API_URL, RESULTS_PER_PAGE, API_KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: [],
    results: [],
    resultsPerPage: RESULTS_PER_PAGE,
    paginationPageState: 1, //by default
  },
  bookmarks: [],
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //when we create we would need the data
  //-->Add bookmark
  state.bookmarks.push(recipe);

  //-->Mark current recipe as bookmarked
  state.recipe.bookmarked = true;

  //-->Record the revamped bookmark locally
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  //when we remove, we would need the id, thats a common pattern in programming.
  //-->Deletebookmark
  //->Find the index of the id in the bookmarks array
  const index = state.bookmarks.findIndex(el => el.id === id);
  //->Remove the item from the array
  state.bookmarks.splice(index, 1); //slice removes 1 item @ the specified index

  //-->Mark current recipe as un-bookmarked
  state.recipe.bookmarked = false;

  //-->Record the revamped bookmark locally
  persistBookmarks();
};

//Shared by uploadRecipe & loadRecipe
const createRecipeObject = function (data) {
  const { recipe } = data.data; // let recipe = data.data.recipe;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
    //VERY IMPORTANT! recipe.key would shortcircuit if key field does not exist in the recipe. If it exists, then key:recipe.key assigment is executed with destructuring from its object state
  };
};

export const loadRecipe = async function (id) {
  try {
    //-->Load recipe data
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`); //we await data promise

    //-->Lets create our own version of the recipe to be used in the app under the *STATE* object
    state.recipe = createRecipeObject(data);
    // const { recipe } = data.data; // let recipe = data.data.recipe;
    // state.recipe = {
    //   id: recipe.id,
    //   title: recipe.title,
    //   publisher: recipe.publisher,
    //   sourceUrl: recipe.source_url,
    //   image: recipe.image_url,
    //   servings: recipe.servings,
    //   cookingTime: recipe.cooking_time,
    //   ingredients: recipe.ingredients,
    // };
    // console.log('State recipe:', state.recipe);

    //-->Persist bookmarks between recipe search instances by checking recipe viewed against the registered bookmark list
    // //#1 Alternate code
    // if (state.bookmarks.some(bookmark => bookmark.id === id))
    //   state.recipe.bookmarked = true;
    // else state.recipe.bookmarked = false;
    //#2 Alternate code
    state.recipe.bookmarked = state.bookmarks.some(
      bookmark => bookmark.id === id
    );
    // console.log('🎆', state.recipe.bookmarked);
    //NOTE: Some() returns a boolean value. If bookmark ids do not match returns either false or true for state.recipe.bookmarked
  } catch (err) {
    // console.error(`${err}💥💥💥`);
    throw err; //pass onto controller catch err
  }
};

export const loadSearchResults = async function (queryString) {
  try {
    state.search.query.push(queryString); //BUG: (Pending) store the query IF GETJSON TESTS SUCCESSFULL!!!!

    //Note: Per instructions as outlined @ forkify-api.herokuapp.com for search operations
    const data = await AJAX(`${API_URL}?search=${queryString}&key=${API_KEY}`);
    // console.log(data);
    console.log('Searched querry keywords:', state.search.query);

    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
        //VERY IMPORTANT! recipe.key would shortcircuit if key field does not exist in the recipe. If it exists, then key:recipe.key assigment is executed with destructuring from its object state
      };
    });
    // console.log(state.search.results);

    //-->Reset paginationPageState
    state.search.paginationPageState = 1; //Fixed the bug of pagination not resetting after each search
  } catch {
    // console.error(`${err}💥💥💥`);
    throw err; //pass onto controller catch err
  }
};
// loadSearchResults('pizza');

//--> SEARCH RESULTS PAGINATION
export const getSearchResultsPage = function (
  page = state.search.paginationPageState //attain the default if none provided <1>
) {
  state.search.paginationPageState = page;
  const start = (page - 1) * state.search.resultsPerPage; // page:1--> 0
  const end = page * state.search.resultsPerPage; // page:1--> 10
  // console.log(start, end);
  //-> partial rendering of the retrieved results
  return state.search.results.slice(start, end);
};

//-->MUTATING RECIPE SERVINGS
export const updateServings = function (newServings) {
  //->Each ingredient gets its updated quantities
  // Therefore foreach mutator method is suited
  state.recipe.ingredients.forEach(
    ingredient =>
      (ingredient.quantity =
        (ingredient.quantity * newServings) / state.recipe.servings)
    //newquantity = oldquantity * newServings/oldServings
  );
  //->servings gets updated by newServing
  state.recipe.servings = newServings;
  // console.log(state.recipe.ingredients);
};

export const uploadRecipe = async function (newRecipe) {
  try {
    // console.log(Object.entries(newRecipe));
    // const ingredients = Object.entries(newRecipe).filter(
    //   entry => entry[0].startsWith('ingredient') && entry[1] !== ''
    // ); //filter out data that its key pair starts with ingredient and value pair is not empty
    //-->Get a hold of the ingredient inputs, make sure they comply the required input standards
    const ingredients = newRecipe
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      //filter out data that its key pair starts with ingredient and value pair is not empty
      .map(entry => {
        // const entryArr = entry[1].replaceAll(' ', '').split(','); //we created this line so we are able to check if arr length is 3 or not as it is required by the submission form
        const entryArr = entry[1].split(',').map(element => element.trim()); //we created this line so we are able to check if arr length is 3 or not as it is required by the submission form
        if (entryArr.length !== 3)
          throw new Error(
            'Wrong input format! Please use the correct format as instructed in the submission form.'
          ); //creates the custom err message and dials the catch block.
        // console.log(entryArr);

        const [quantity, unit, description] = entryArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });
    // console.log('+', ingredients);
    // console.log('++', newRecipe);
    //-->Construe an object from entry array with key/value pairs
    const recipeData = Object.fromEntries(newRecipe);
    // console.log('+++', recipeData);

    //-->From the provided object construct prep the recipe for final submission to online-API
    const recipe = {
      title: recipeData.title,
      source_url: recipeData.sourceUrl,
      image_url: recipeData.image,
      publisher: recipeData.publisher,
      cooking_time: +recipeData.cookingTime,
      servings: +recipeData.servings,
      ingredients: ingredients,
    };
    // console.log(recipe);

    //-->Create AJAX request to upload to online-API
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    console.log(data); //Note: We received response from online-API with the approved recipe data alomng with additional information such as timestamp yada yada...
    //-->Create the state recipe from the data returned by the sendJSON AJAX response and transform into proper object customized for the app.
    state.recipe = createRecipeObject(data);
    //-->Auto-bookmark your own recipe
    addBookmark(state.recipe);
  } catch (err) {
    throw err; //Dialed error here gets ditched to controlAddRecipe @ controller.js
  }
};
