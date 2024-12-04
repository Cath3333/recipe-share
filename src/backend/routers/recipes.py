# app/routers/recipes.py

from fastapi import APIRouter, HTTPException, Body, Query, Depends, BackgroundTasks

from typing import List, Optional
from models import Recipe, NewRecipe
from database import recipe_collection
from helpers.recipe_helper import (
    add_recipe_to_db,
    get_all_recipes,
    get_recipe_by_id,
    update_recipe,
    delete_recipe,
)


router = APIRouter(prefix="/recipe", tags=["recipe"])


@router.post("/", response_model=dict)
async def create_recipe(recipe_data: dict = Body(...)):
    try:
        new_recipe = await add_recipe_to_db(recipe_collection, recipe_data)
        return new_recipe
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=List[dict])
async def get_recipes(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1),
    category: Optional[str] = None,
):
    try:
        query = {}
        if category:
            query["category"] = category

        cursor = recipe_collection.find(query).skip(skip).limit(limit)
        recipes = []
        async for recipe in cursor:
            recipe["_id"] = str(recipe["_id"])
            recipes.append(recipe)
        return recipes
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


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
    recipe = await recipe_collection.find_one_and_delete(
        {"_id": ObjectId(recipe_id)}
    )
    if recipe:
        return Recipe(**recipe)
    raise HTTPException(status_code=404, detail="Recipe not found")


@router.put("/{recipe_id}", response_model=Recipe)
async def update_recipe(
    recipe_id: str,
    recipe_update: NewRecipe,
    background_tasks: BackgroundTasks,
):
    if not ObjectId.is_valid(recipe_id):
        raise HTTPException(status_code=400, detail="Invalid recipe ID")
    updated_recipe = await recipe_collection.find_one_and_update(
        {"_id": ObjectId(recipe_id)},
        {"$set": recipe_update.dict()},
        return_document=True,
    )
    if updated_recipe:
        return Recipe(**updated_recipe)
    raise HTTPException(status_code=404, detail="Recipe not found")


# Additional endpoints can be added here, such as filtering by tags, cuisine, etc.
