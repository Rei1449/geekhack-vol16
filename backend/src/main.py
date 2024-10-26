from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time
import uuid
from typing import List
from collections import defaultdict
import json
from dotenv import load_dotenv
import os
import psycopg2
from psycopg2.extensions import connection

load_dotenv()

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins = ["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

class CreateRoomRequest(BaseModel):
    name: str

class CreateMessageRequest(BaseModel):
    id: str
    message: str

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, List[WebSocket]] = defaultdict(lambda: [])

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

def get_connection() -> connection:
    return psycopg2.connect(os.getenv("DATABASE_URL"))

@app.get("/test/get")
async def get_test():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM rooms")
    print(cur.fetchall())
    cur.close()
    conn.close()
    print("test")
    return {"test": "test"}

@app.get("/")
async def root():
    return {"msg": "Hello World!!!!"}

#新規ルーム作成
@app.post("/rooms")
async def create_room(room_request:CreateRoomRequest):
    id = str(uuid.uuid4())
    room = {
      "id": id,
      "name": room_request.name,
      "messages":[]
    }

    conn = get_connection()
    cur = conn.cursor()
    cur.execute(f"INSERT INTO rooms (id,name) VALUES('{room['id']}','{room['name']}')")
    conn.commit()
    cur.close()
    conn.close()

    return room

#ルーム情報取得
@app.get("/rooms/{room_id}")
async def room(room_id:str):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(f"SELECT name FROM rooms WHERE id = '{room_id}';")
    room_name = cur.fetchall()
    print(room_name)
    if room_name == []:
        return None
    cur.execute(f"SELECT id,message,created_at FROM messages WHERE room_id = '{room_id}';")
    messages = cur.fetchall()

    room_data = {
        "id": room_id,
        "name": room_name[0][0],
        "messages": []
    }

    for item in messages:
        room_data["messages"].append(
            {
                "id":item[0],
                "message": item[1],
                "createdAt": item[2]
            })
    cur.close()
    conn.close()

    return room_data

#メッセージ新規作成
@app.post("/rooms/{room_id}/messages")
async def create_message(room_id:str, message_request:CreateMessageRequest):
    now = int(time.time())
    message = {
      "type":"messages/new",
      "id": message_request.id,
      "message": message_request.message,
      "createdAt": now
    }
    await manager.broadcast(room_id, json.dumps(message))

    conn = get_connection()
    cur = conn.cursor()
    cur.execute(f"INSERT INTO messages (id,message,created_at,room_id) VALUES('{message['id']}','{message['message']}','{message['createdAt']}','{room_id}')")
    conn.commit()
    cur.close()
    conn.close()

    return {
      "id": message_request.id,
      "message": message_request.message,
      "createdAt": now
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
