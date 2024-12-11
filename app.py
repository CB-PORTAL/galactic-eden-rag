from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
from ava_ai import AvaAI
from pathlib import Path
import logging
import shutil

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()
ai = AvaAI()

def setup_directories():
    templates_dir = Path("templates")
    templates_dir.mkdir(exist_ok=True)

    static_dir = Path("static")
    static_dir.mkdir(exist_ok=True)

    source_html = Path("index.html")
    if source_html.exists():
        shutil.copy(source_html, templates_dir / "index.html")

    data_dirs = ["data/docs", "data/code", "data/vector_store"]
    for dir_path in data_dirs:
        Path(dir_path).mkdir(parents=True, exist_ok=True)

setup_directories()

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def get():
    index_file = Path("templates/index.html")
    if index_file.exists():
        return HTMLResponse(index_file.read_text(encoding='utf-8'))
    else:
        return HTMLResponse("Error: template file not found")

@app.websocket("/chat")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            question = await websocket.receive_text()
            logger.debug(f"Received question: {question}")
            response = ai.chat(question)
            logger.debug(f"Response: {response}")
            await websocket.send_text(response)
    except:
        # Client likely disconnected
        pass

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)