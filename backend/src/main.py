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

class CreateRoomRequest(BaseModel):
    roomName: str

class CreateMessageRequest(BaseModel):
    id: str
    message: str

@app.get("/")
async def root():
    return {"msg": "Hello World!!!!"}

#新規ルーム作成
@app.post("/rooms")
async def create_room(room_request:CreateRoomRequest):
    return {
      "roomId": uuid.uuid4(),
      "roomName": room_request.roomName
    }

#ルーム情報取得
@app.get("/rooms/{room_id}")
async def room(room_id:str):
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
async def create_message(room_id:str, message_request:CreateMessageRequest):
    return {
      "id": message_request.id,
      "roomId": room_id,
      "message": message_request.message,
      "createdAt": int(time.time())
    }