from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time
import uuid
from typing import List

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

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_id: str):
        await websocket.accept()
        if room_id in self.active_connections:
            self.active_connections[room_id].append(websocket)
        else:
            self.active_connections[room_id] = [websocket]
        print("active_connections", self.active_connections)

    def disconnect(self, websocket: WebSocket, room_id: str):
        self.active_connections[room_id].remove(websocket)
        print("active_connections", self.active_connections)

    async def broadcast(self, room_id:str, message: str):
        for connection in self.active_connections[room_id]:
            await connection.send_text(message)


manager = ConnectionManager()

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

@app.websocket("/rooms/{room_id}")
async def connect_websocket(websocket: WebSocket, room_id: str):
    await manager.connect(websocket, room_id)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)
        print("websocket disconnected", websocket)
