from bson import ObjectId
from typing import List, Dict, Any
from datetime import datetime


async def add_recipe_to_db(
    recipe_collection, recipe_data: Dict[str, Any]
) -> Dict[str, Any]:
    recipe_data["created_at"] = datetime.utcnow()
    recipe_data["updated_at"] = datetime.utcnow()

    result = await recipe_collection.insert_one(recipe_data)

    new_recipe = await recipe_collection.find_one({"_id": result.inserted_id})

    new_recipe["_id"] = str(new_recipe["_id"])
    return new_recipe


async def get_all_recipes(
    recipe_collection, skip: int = 0, limit: int = 10
) -> List[Dict[str, Any]]:
    cursor = recipe_collection.find().skip(skip).limit(limit)
    recipes = []
    async for recipe in cursor:
        recipe["_id"] = str(recipe["_id"])
        recipes.append(recipe)
    return recipes


async def get_recipe_by_id(
    recipe_collection, recipe_id: str
) -> Dict[str, Any]:
    """Retrieve a specific recipe by ID"""
    try:
        recipe = await recipe_collection.find_one(
            {"_id": ObjectId(recipe_id)}
        )
        if recipe:
            recipe["_id"] = str(recipe["_id"])
        return recipe
    except:
        return None


async def update_recipe(
    recipe_collection, recipe_id: str, recipe_data: Dict[str, Any]
) -> Dict[str, Any]:
    recipe_data["updated_at"] = datetime.utcnow()

    recipe_data.pop("_id", None)

    await recipe_collection.update_one(
        {"_id": ObjectId(recipe_id)}, {"$set": recipe_data}
    )

    updated_recipe = await get_recipe_by_id(recipe_collection, recipe_id)
    return updated_recipe


async def delete_recipe(recipe_collection, recipe_id: str) -> bool:
    result = await recipe_collection.delete_one({"_id": ObjectId(recipe_id)})
    return result.deleted_count > 0
