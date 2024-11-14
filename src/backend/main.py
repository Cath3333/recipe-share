import json
import os
from contextlib import asynccontextmanager
from typing import List, Optional
from uuid import UUID, uuid4

from fastapi import BackgroundTasks, FastAPI, HTTPException, Request
from pydantic import BaseModel

user_list: List["User"] = []
query_count: int = 0
recipe_list: List["Recipe"] = []


class NewUser(BaseModel):
    name: str
    age: int
    username: str


class User(NewUser):
    id: UUID = uuid4()


class NewRecipe(BaseModel):
    title: str
    desc: str
    steps: List[str]
    ingredients: List[str]
    tags: List[str]
    img_uri: str


class Recipe(NewRecipe):
    id: UUID = uuid4()


def save_recipe(recipes: List[Recipe]):
    pass


def load_users() -> List[dict]:
    pass
    # if os.path.exists(DB_PATH):
    #     with open(DB_PATH, "r") as f:
    #         return json.load(f)
    # return []


def save_users(users: List[User]):
    pass
    # with open(DB_PATH, "w") as f:
    #     json.dump(students, f, default=str)


@asynccontextmanager
async def lifespan(app: FastAPI):
    global user_list
    user_list = load_users()
    yield
    save_users(user_list)


app = FastAPI(lifespan=lifespan)


@app.middleware("http")
async def count_queries(request: Request, call_next):
    global query_count
    query_count += 1
    if query_count % 10 == 0:
        print(f"Query count: {query_count}")
    response = await call_next(request)
    return response


@app.get("/query_count", response_model=dict)
def get_query_count():
    return {"query_count": query_count}


@app.get("/user/{username}", response_model=User)
def get_user_id(username: str):
    for user in user_list:
        if user.username == username:
            return user
    # return None
    raise HTTPException(
        status_code=404, detail="User with given username is not found"
    )


@app.post("/user", response_model=User)
def add_student(user: NewUser, background_tasks: BackgroundTasks):
    new_user = User(id=uuid4(), **user.model_dump())
    user_list.append(new_user.model_dump())
    background_tasks.add_task(save_users, user_list)
    return new_user


@app.get("/users", response_model=List[User])
def get_users():
    return user_list


@app.delete("/user/{username}", response_model=User)
def delete_user(username: str):
    for i, user in enumerate(user_list):
        if user["username"] == username:
            user_list.pop(i)
            return user
    raise HTTPException(
        status_code=404, detail="User with given username is not found"
    )


@app.put("/user/{username}", response_model=User)
def update_student(
    username: str, user: NewUser, background_tasks: BackgroundTasks
):
    for index, old_user in enumerate(user_list):
        if old_user["username"] == username:
            updated_user = User(id=id, **user.model_dump())
            user_list[index] = updated_user.model_dump()
            # save_students(student_list)
            background_tasks.add_task(save_users, user_list)
            return updated_user

    raise HTTPException(
        status_code=404, detail="User with given username is not found"
    )


@app.post("/recipe", response_model=Recipe)
def add_recipe(recipe: NewRecipe, background_tasks: BackgroundTasks):
    new_recipe = Recipe(id=uuid4(), **recipe.model_dump())
    recipe_list.append(new_recipe.model_dump())
    background_tasks.add_task(save_recipe, recipe_list)
    return new_recipe
