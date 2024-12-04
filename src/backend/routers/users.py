# app/routers/users.py

from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import List, Dict
from models import User, NewUser
from database import user_collection, recipe_collection
from bson import ObjectId

router = APIRouter(prefix="/users", tags=["users"])


async def can_login(user_data: Dict[str, str]) -> bool:
    return user_collection.find_one(
        {"email": user_data.email, "password": user_data.password}
    )

    # result = await user_collection.find_one(
    #     {"email": user_data.email, "password": user_data.password}
    # )

    # new_recipe = await recipe_collection.find_one({"_id": result.inserted_id})

    # new_recipe["_id"] = str(new_recipe["_id"])
    # return new_recipe


@router.get("/email/{email}", response_model=User)
async def get_user_by_email(email: str):
    user = await user_collection.find_one({"email": email})
    if user:
        return User(**user)
    raise HTTPException(status_code=404, detail="User not found")


@router.post("/", response_model=User)
async def create_user(user: NewUser, background_tasks: BackgroundTasks):
    user = user.dict()
    user["saved_recipes"] = []
    try:
        result = await user_collection.insert_one(user)
        created_user = await user_collection.find_one(
            {"_id": result.inserted_id}
        )
        return User(**created_user)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=List[User])
async def get_users():
    users = []
    async for user in user_collection.find():
        users.append(User(**user))
    return users


# @router.post("/auth/", response_model=dict)
# async def authenticate(user_data: dict = Body(...)):
#     try:
#         returned_data = await can_login(user_data)
#         return returned_data
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))


# @router.get("/{username}", response_model=User)
# async def get_user(username: str):
#     user = await user_collection.find_one({"username": username})
#     if user:
#         return User(**user)
#     raise HTTPException(status_code=404, detail="User not found")


# @router.get("/{id}", response_model=User)
# async def get_user(id: str):
#     print(id)
#     try:
#         user = await user_collection.find_one({"_id": ObjectId(id)})
#         if user:
#             return User(**user)
#         raise HTTPException(status_code=404, detail="User not found")
#     except:
#         raise HTTPException(status_code=400, detail="Invalid user ID format")


@router.get("/{id}", response_model=dict)
async def get_user(id: str):
    try:
        object_id = ObjectId(id)
        user = await user_collection.find_one({"_id": object_id})
        if user:
            user["_id"] = str(user["_id"])
            for i, recipe_id in enumerate(user.get("saved_recipes", [])):
                user["saved_recipes"][i] = str(recipe_id)
            return user
        raise HTTPException(status_code=404, detail="User not found")
    except:
        raise HTTPException(status_code=400, detail="Invalid user ID format")


@router.delete("/{username}", response_model=User)
async def delete_user(username: str):
    user = await user_collection.find_one_and_delete({"username": username})
    if user:
        return User(**user)
    raise HTTPException(status_code=404, detail="User not found")


@router.put("/{username}", response_model=User)
async def update_user(
    username: str, user_update: NewUser, background_tasks: BackgroundTasks
):
    updated_user = await user_collection.find_one_and_update(
        {"username": username},
        {"$set": user_update.dict()},
        return_document=True,
    )
    if updated_user:
        return User(**updated_user)
    raise HTTPException(status_code=404, detail="User not found")


@router.post("/{id}/save_recipe/{recipe_id}", response_model=dict)
async def save_recipe_to_user(id: str, recipe_id: str):
    try:
        user_id = ObjectId(id)
        if not ObjectId.is_valid(recipe_id):
            raise HTTPException(status_code=400, detail="Invalid recipe ID")

        recipe = await recipe_collection.find_one(
            {"_id": ObjectId(recipe_id)}
        )
        if not recipe:
            raise HTTPException(status_code=404, detail="Recipe not found")

        user = await user_collection.find_one({"_id": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        if ObjectId(recipe_id) in user.get("saved_recipes", []):
            raise HTTPException(
                status_code=400, detail="Recipe already saved"
            )

        await user_collection.update_one(
            {"_id": user_id},
            {"$push": {"saved_recipes": ObjectId(recipe_id)}},
        )

        updated_user = await user_collection.find_one({"_id": user_id})
        updated_user["_id"] = str(updated_user["_id"])
        for i, recipe_id in enumerate(updated_user.get("saved_recipes", [])):
            updated_user["saved_recipes"][i] = str(recipe_id)
        return updated_user
    except:
        raise HTTPException(status_code=400, detail="Invalid user ID format")


@router.post("/{id}/unsave_recipe/{recipe_id}", response_model=User)
async def unsave_recipe_from_user(id: str, recipe_id: str):
    # Validate recipe_id
    if not ObjectId.is_valid(recipe_id):
        raise HTTPException(status_code=400, detail="Invalid recipe ID")

    # Validate user_id
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid user ID")

    user = await user_collection.find_one({"_id": ObjectId(id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if ObjectId(recipe_id) not in user.get("saved_recipes", []):
        raise HTTPException(status_code=400, detail="Recipe not saved")

    await user_collection.update_one(
        {"_id": ObjectId(id)},
        {"$pull": {"saved_recipes": ObjectId(recipe_id)}},
    )
    updated_user = await user_collection.find_one({"_id": ObjectId(id)})
    updated_user["_id"] = str(updated_user["_id"])
    for i, recipe_id in enumerate(updated_user.get("saved_recipes", [])):
        updated_user["saved_recipes"][i] = str(recipe_id)
    return updated_user

