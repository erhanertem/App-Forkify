import { API_URL, RESULTS_PER_PAGE } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: [],
    results: [],
    resultsPerPage: RESULTS_PER_PAGE,
    paginationPageState: 1, //by default
  },
};

export const loadRecipe = async function (id) {
  try {
    //-->Load recipe data
    const data = await getJSON(`${API_URL}${id}`); //we await data promise

    //-->Lets create our own version of the recipe to be used in the app under the *STATE* object
    const { recipe } = data.data; // let recipe = data.data.recipe;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    console.log('State recipe:', state.recipe);
  } catch (err) {
    // console.error(`${err}💥💥💥`);
    throw err; //pass onto controller catch err
  }
};

export const loadSearchResults = async function (queryString) {
  try {
    state.search.query.push(queryString); //BUG: (Pending) store the query IF GETJSON TESTS SUCCESSFULL!!!!

    //Note: Per instructions as outlined @ forkify-api.herokuapp.com for search operations
    const data = await getJSON(`${API_URL}?search=${queryString}`);
    // console.log(data);
    console.log('Searched querry keywords:', state.search.query);

    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
      };
    });
    // console.log(state.search.results);
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
  state.recipe.ingredients.forEach(
    ingredient =>
      (ingredient.quantity =
        (ingredient.quantity * newServings) / state.recipe.servings)
    //newquantity = oldquantity * newServings/oldServings
  );
  //->servings gets updated by newServing
  state.recipe.servings = newServings;
};
