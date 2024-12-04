from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID, uuid4


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
