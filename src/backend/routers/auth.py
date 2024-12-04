from fastapi import APIRouter, HTTPException, Form
from bson import ObjectId
from database import user_collection

router = APIRouter(tags=["authentication"])


@router.post("/token")
async def login(email: str = Form(...), password: str = Form(...)):
    user = await user_collection.find_one(
        {"email": email, "password": password}
    )

    if not user:
        raise HTTPException(
            status_code=401, detail="Incorrect email or password"
        )

    user_data = {
        "id": str(user["_id"]),
        "email": user["email"],
        "username": user.get("username", ""),
    }

    return {"access_token": email, "token_type": "bearer", "user": user_data}
