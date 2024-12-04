import os

class Config:
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb+srv://zhouzih:mCsxb1e9lJR1CTe8@recipeshare.agzmm.mongodb.net/?retryWrites=true&w=majority&appName=recipeShare')
    SECRET_KEY = os.getenv('SECRET_KEY', '3333')
