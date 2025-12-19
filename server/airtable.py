import asyncio
import logging
import os

from dotenv import load_dotenv
load_dotenv()

import polars as pl
from pyairtable import Api

from server import models


CIMA_BASE = "appDwuBzzUFQKZqrx"
DATA_TABLE = "tblhrPSM9atIrQquv"
EVENTS_TABLE = "tblz2kaxgRjPtr102"
PEOPLE_TABLE = "tblDzrBK7Mb7Zxe8o"
MAILING_TABLE = "tblSHOisjiHmIFd5P"

CIMA_DATASTORE = os.environ.get("CIMA_DATASTORE", "./server/data")
AIRTABLE_PAT = os.environ.get("AIRTABLE_CIMA_PAT", "")

api = Api(AIRTABLE_PAT)


async def fetch_data():
    data_table = api.table(CIMA_BASE, DATA_TABLE)
    entities = map(models.Document.load_airtable, data_table.all())
    metadata_path = f"{CIMA_DATASTORE}/{models.MetadataStore.DATA}"
    pl.from_dicts(map(vars, entities)).write_parquet(metadata_path)
    logging.info("Successfully loaded all data from airtable!")


async def fetch_events():
    events_table = api.table(CIMA_BASE, EVENTS_TABLE)
    events = map(models.Event.load_airtable, events_table.all())
    metadata_path = f"{CIMA_DATASTORE}/{models.MetadataStore.EVENTS}"
    pl.from_dicts(map(vars, events)).write_parquet(metadata_path)
    logging.info("Successfully loaded all events from airtable!")


async def fetch_people():
    people_table = api.table(CIMA_BASE, PEOPLE_TABLE)
    events = map(models.Person.load_airtable, people_table.all())
    metadata_path = f"{CIMA_DATASTORE}/{models.MetadataStore.PEOPLE}"
    pl.from_dicts(map(vars, events)).write_parquet(metadata_path)
    logging.info("Successfully loaded all people from airtable!")


async def upsert_mailing(emails: list[str]):
    mailing_table = api.table(CIMA_BASE, MAILING_TABLE)
    records = mailing_table.batch_upsert([
        {"fields": {"email": email}}
        for email in emails
    ], ["email"])
    logging.info(f"Successfully wrote to airtable!")
    logging.info(records)


async def main():
    await fetch_data()
    await fetch_events()
    await fetch_people()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(main())
