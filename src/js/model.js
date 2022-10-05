import 'regenerator-runtime/runtime.js';
import { API_URL } from './config.js';

export const state = {
  recipe: {},
};

export const loadRecipe = async function (id) {
  try {
    //-->Load recipe data
    const response = await fetch(`${API_URL}/${id}`);
    const data = await response.json();

    //->Serverside fetch err check
    if (!response.ok) throw new Error(`${data.message} (${response.status})`);
    // console.log(response, data, data.data);

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
    alert(err);
  }
};
