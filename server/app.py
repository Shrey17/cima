import io
import asyncio
import logging
from typing import Annotated
from contextlib import asynccontextmanager

from dotenv import load_dotenv
load_dotenv()

import polars as pl
from fastapi import Depends, FastAPI, HTTPException, Response
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

from server.airtable import CIMA_DATASTORE, upsert_mailing, fetch_data, fetch_events, fetch_people
from server.models import Document, Event, MetadataStore, Person

logging.basicConfig(level=logging.INFO)


async def get_data_meta():
    return pl.read_parquet(f"{CIMA_DATASTORE}/data.parquet")

async def refresh_data():
    while True:
        print("Refreshing data from airtable...")
        await fetch_data()
        await fetch_events()
        await fetch_people()
        logging.info("Refreshed data from airtable!")
        await asyncio.sleep(300)
        

@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(refresh_data())
    try:
        yield
    finally:
        task.cancel()
        try:
            await task
        except asyncio.CancelledError:
            pass

app = FastAPI(lifespan=lifespan)

# Add CORS middleware to allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
DataDep = Annotated[pl.DataFrame, Depends(get_data_meta)]
EventsDep = Annotated[
    pl.DataFrame, Depends(lambda: pl.read_parquet(f"{CIMA_DATASTORE}/{MetadataStore.EVENTS}"))
]
PeopleDep = Annotated[
    pl.DataFrame, Depends(lambda: pl.read_parquet(f"{CIMA_DATASTORE}/{MetadataStore.PEOPLE}"))
]


@app.get("/data")
async def get_data_previews(df: DataDep) -> list[Document]:
    return df.drop("attachment", "data").to_dicts()


@app.get("/data/text/{id}")
async def get_data(id: str, df: DataDep) -> Document:
    return df.filter(id=id).head(1).to_dicts()[0]


@app.get("/data/attachments/{id}")
async def get_attachment(id: str, df: DataDep) -> Response:
    filepath = df.filter(id=id).select("attachment").item()
    with open(filepath, "rb") as f:
        buffer = io.BytesIO(f.read())
    headers = {"Content-Disposition": f"attachment; filename={id}.pdf"}
    return Response(buffer.getvalue(), headers=headers, media_type="application/pdf")


@app.get("/events")
async def get_events_previews(df: EventsDep) -> list[Event]:
    cols = [c for c in df.columns if c != "attachment"]
    return df.select(cols).to_dicts()


@app.get("/events/{id}")
async def get_event(id: str, df: EventsDep) -> Event:
    return df.filter(id=id).head(1).to_dicts()[0]


@app.get("/events/attachments/{id}")
async def get_event_attachment(id: str, df: EventsDep) -> Response:
    filepath = df.filter(id=id).select("attachment").item()
    with open(filepath, "rb") as f:
        buffer = io.BytesIO(f.read())
    headers = {"Content-Disposition": f"attachment; filename={id}.pdf"}
    return Response(buffer.getvalue(), headers=headers, media_type="application/pdf")


@app.get("/people")
async def get_people(df: PeopleDep) -> list[Person]:
    # Map photo filesystem path to API url
    people = df.to_dicts()
    for p in people:
        if p.get("photo"):
            p["attachmentUrl"] = f"/people/attachments/{p['id']}"
        else:
            p["attachmentUrl"] = None
        # Do not expose local file path
        p.pop("photo", None)
    return people


@app.get("/people/{id}")
async def get_person(id: str, df: PeopleDep) -> Person:
    records = df.filter(id=id).to_dicts()
    if not records:
        raise HTTPException(status_code=404, detail="Person not found")
    p = records[0]
    if p.get("photo"):
        p["attachmentUrl"] = f"/people/attachments/{p['id']}"
    else:
        p["attachmentUrl"] = None
    p.pop("photo", None)
    return p


@app.get("/people/attachments/{id}")
async def get_person_attachment(id: str, df: PeopleDep):
    records = df.filter(id=id).select("photo").to_dicts()
    if not records:
        raise HTTPException(status_code=404, detail="Person not found")
    filepath = records[0].get("photo")
    if not filepath:
        raise HTTPException(status_code=404, detail="Photo not available")
    # Serve inline so the PDF can render in the browser/embed
    headers = {"Content-Disposition": f"attachment; filename={id}.pdf"}
    return FileResponse(path=filepath, media_type="application/pdf", headers=headers)


@app.post("/mailing")
async def add_to_mailing_list(email: str):
    await upsert_mailing([email])
