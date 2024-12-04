# app/routers/users.py

from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import List
from app.models import User, NewUser
from app.database import user_collection, recipe_collection
from bson import ObjectId

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.post("/", response_model=User)
async def create_user(user: NewUser, background_tasks: BackgroundTasks):
    user = user.dict()
    user['saved_recipes'] = []
    try:
        result = await user_collection.insert_one(user)
        created_user = await user_collection.find_one({"_id": result.inserted_id})
        return User(**created_user)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[User])
async def get_users():
    users = []
    async for user in user_collection.find():
        users.append(User(**user))
    return users

@router.get("/{username}", response_model=User)
async def get_user(username: str):
    user = await user_collection.find_one({"username": username})
    if user:
        return User(**user)
    raise HTTPException(status_code=404, detail="User not found")

@router.delete("/{username}", response_model=User)
async def delete_user(username: str):
    user = await user_collection.find_one_and_delete({"username": username})
    if user:
        return User(**user)
    raise HTTPException(status_code=404, detail="User not found")

@router.put("/{username}", response_model=User)
async def update_user(username: str, user_update: NewUser, background_tasks: BackgroundTasks):
    updated_user = await user_collection.find_one_and_update(
        {"username": username},
        {"$set": user_update.dict()},
        return_document=True
    )
    if updated_user:
        return User(**updated_user)
    raise HTTPException(status_code=404, detail="User not found")

@router.post("/{username}/save_recipe/{recipe_id}", response_model=User)
async def save_recipe_to_user(username: str, recipe_id: str):
    # Validate recipe_id
    if not ObjectId.is_valid(recipe_id):
        raise HTTPException(status_code=400, detail="Invalid recipe ID")
    
    recipe = await recipe_collection.find_one({"_id": ObjectId(recipe_id)})
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    user = await user_collection.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if ObjectId(recipe_id) in user.get('saved_recipes', []):
        raise HTTPException(status_code=400, detail="Recipe already saved")
    
    await user_collection.update_one(
        {"username": username},
        {"$push": {"saved_recipes": ObjectId(recipe_id)}}
    )
    updated_user = await user_collection.find_one({"username": username})
    return User(**updated_user)

@router.post("/{username}/unsave_recipe/{recipe_id}", response_model=User)
async def unsave_recipe_from_user(username: str, recipe_id: str):
    # Validate recipe_id
    if not ObjectId.is_valid(recipe_id):
        raise HTTPException(status_code=400, detail="Invalid recipe ID")
    
    user = await user_collection.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if ObjectId(recipe_id) not in user.get('saved_recipes', []):
        raise HTTPException(status_code=400, detail="Recipe not saved")
    
    await user_collection.update_one(
        {"username": username},
        {"$pull": {"saved_recipes": ObjectId(recipe_id)}}
    )
    updated_user = await user_collection.find_one({"username": username})
    return User(**updated_user)
