# app/routers/recipes.py

from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import List
from app.models import Recipe, NewRecipe
from app.database import recipe_collection

router = APIRouter(
    prefix="/recipes",
    tags=["recipes"]
)

@router.post("/", response_model=Recipe)
async def create_recipe(recipe: NewRecipe, background_tasks: BackgroundTasks):
    recipe = recipe.dict()
    recipe['score'] = 0.0  # Initialize score
    result = await recipe_collection.insert_one(recipe)
    created_recipe = await recipe_collection.find_one({"_id": result.inserted_id})
    return Recipe(**created_recipe)

@router.get("/", response_model=List[Recipe])
async def get_recipes():
    recipes = []
    async for recipe in recipe_collection.find():
        recipes.append(Recipe(**recipe))
    return recipes

@router.get("/{recipe_id}", response_model=Recipe)
async def get_recipe(recipe_id: str):
    if not ObjectId.is_valid(recipe_id):
        raise HTTPException(status_code=400, detail="Invalid recipe ID")
    recipe = await recipe_collection.find_one({"_id": ObjectId(recipe_id)})
    if recipe:
        return Recipe(**recipe)
    raise HTTPException(status_code=404, detail="Recipe not found")

@router.delete("/{recipe_id}", response_model=Recipe)
async def delete_recipe(recipe_id: str):
    if not ObjectId.is_valid(recipe_id):
        raise HTTPException(status_code=400, detail="Invalid recipe ID")
    recipe = await recipe_collection.find_one_and_delete({"_id": ObjectId(recipe_id)})
    if recipe:
        return Recipe(**recipe)
    raise HTTPException(status_code=404, detail="Recipe not found")

@router.put("/{recipe_id}", response_model=Recipe)
async def update_recipe(recipe_id: str, recipe_update: NewRecipe, background_tasks: BackgroundTasks):
    if not ObjectId.is_valid(recipe_id):
        raise HTTPException(status_code=400, detail="Invalid recipe ID")
    updated_recipe = await recipe_collection.find_one_and_update(
        {"_id": ObjectId(recipe_id)},
        {"$set": recipe_update.dict()},
        return_document=True
    )
    if updated_recipe:
        return Recipe(**updated_recipe)
    raise HTTPException(status_code=404, detail="Recipe not found")

# Additional endpoints can be added here, such as filtering by tags, cuisine, etc.
