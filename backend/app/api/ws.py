from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
import json

router = APIRouter(tags=["WebSocket"])


class ConnectionManager:
    """Manages WebSocket connections for generation progress updates."""

    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, task_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[task_id] = websocket

    def disconnect(self, task_id: str):
        self.active_connections.pop(task_id, None)

    async def send_progress(self, task_id: str, step: str, progress: int):
        """Send a progress update to the client for a specific task."""
        ws = self.active_connections.get(task_id)
        if ws:
            await ws.send_json({
                "task_id": task_id,
                "step": step,
                "progress": progress,
            })

    async def send_complete(self, task_id: str, model_id: int):
        """Notify the client that generation is complete."""
        ws = self.active_connections.get(task_id)
        if ws:
            await ws.send_json({
                "task_id": task_id,
                "step": "complete",
                "progress": 100,
                "model_id": model_id,
            })


manager = ConnectionManager()


@router.websocket("/ws/generation/{task_id}")
async def generation_progress(websocket: WebSocket, task_id: str):
    """WebSocket endpoint for real-time generation progress updates."""
    await manager.connect(task_id, websocket)
    try:
        while True:
            # Keep connection alive, wait for client messages
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        manager.disconnect(task_id)
