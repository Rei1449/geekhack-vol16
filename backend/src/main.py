from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time
import uuid

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins = ["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

class Room(BaseModel):
    roomName: str

@app.get("/")
async def root():
    return {"msg": "Hello World!!!!"}

#新規ルーム作成
@app.post("/rooms")
async def root(room_request:Room):
    return {
      "roomId": uuid.uuid4(),
      "roomName": room_request.roomName
    }

#ルーム情報取得
@app.get("/rooms/{room_id}")
async def root(room_id:str):
    return{
    "id": room_id,
    "name": "Sample Room Name",
    "messages": [
        {
            "id": "eee9a636-ea03-408e-86b6-5b75813a7d19",
            "message": "Hello, World!",
            "createdAt": 1729249549
        },
        {
            "id": "eee9a636-ea03-408e-86b6-5b75813a7d19",
            "message": "Goodbye, World!",
            "createdAt": 1729249549
        }
    ]
}

#メッセージ新規作成
@app.post("/rooms/{room_id}/messages")
async def root(room_id:str):
    return {
      "id": "33d9c826-f54d-4b94-8551-005e276c1108",
      "roomId": room_id,
      "message": "Hello, World!",
      "createdAt": int(time.time())
    }