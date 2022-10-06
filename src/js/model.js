import { API_URL } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
  },
};

export const loadRecipe = async function (id) {
  try {
    //-->Load recipe data
    const data = await getJSON(`${API_URL}/${id}`); //we await data promise

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
  } catch (err) {
    // console.error(`${err}💥💥💥`);
    throw err; //pass onto controller catch err
  }
};

export const loadSearchResults = async function (queryString) {
  try {
    //Note: Per instructions as outlined @ forkify-api.herokuapp.com for search operations
    const data = await getJSON(`${API_URL}?search=${queryString}`);
    // console.log(data);

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

loadSearchResults('pizza');
