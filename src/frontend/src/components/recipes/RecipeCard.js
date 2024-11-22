import React, { useState, createContext } from 'react';

const RecipeCard = ({ recipe, onSave, onRate }) => {
    return (
      <div className="max-w-sm rounded overflow-hidden shadow-lg m-4">
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{recipe.title}</div>
          <p className="text-gray-700 text-base">{recipe.description}</p>
          <div className="mt-4">
            <span className="text-sm text-gray-600">Rating: {recipe.average_rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="px-6 pt-4 pb-2">
          <button
            onClick={() => onRate(recipe.id)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Rate
          </button>
          <button
            onClick={() => onSave(recipe.id)}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Save
          </button>
        </div>
      </div>
    );
  };

  export default RecipeCard;