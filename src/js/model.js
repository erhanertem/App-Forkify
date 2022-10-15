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
  bookmarks: [],
};

export const addBookmark = function (recipe) {
  //when we create we would need the data
  //-->Add bookmark
  state.bookmarks.push(recipe);

  //-->Mark current recipe as bookmarked
  state.recipe.bookmarked = true;
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
