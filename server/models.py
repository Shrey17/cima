import logging
import os
import urllib.request
from dataclasses import dataclass
from datetime import datetime
from enum import StrEnum

from dotenv import load_dotenv
load_dotenv()

from dacite import from_dict


STORE_PATH = os.environ.get("CIMA_DATASTORE", "./server/data")


class DataType(StrEnum):
    REPORT = "report"
    FLASH = "flash"
    FUNDAMENTALS = "fundamentals"

    def resolve_attachment(self, id) -> str:
        return f"{STORE_PATH}/data/{id}.pdf"


class EventStatus(StrEnum):
    PROPOSED = "proposed"
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    POSTPONED = "postponed"


class MetadataStore(StrEnum):
    DATA = "data.parquet"
    EVENTS = "event.parquet"
    PEOPLE = "people.parquet"


@dataclass
class Document:
    id: str
    name: str
    summary: str
    type: DataType
    creation_time: datetime
    last_modified: datetime
    authors: list[str]
    data: str | None = None
    attachment: str | None = None

    @classmethod
    def load_airtable(cls, airtable_data: dict[str, str]):
        data_fields = airtable_data["fields"]
        data_fields["id"] = airtable_data["id"]
        data_fields["creation_time"] = datetime.fromisoformat(data_fields["creation_time"])
        data_fields["last_modified"] = datetime.fromisoformat(data_fields["last_modified"])
        data_fields["authors"] = [record["name"] for record in data_fields["authors"]]

        record_type = data_fields["type"]
        if record_type not in DataType:
            return None

        data_fields["type"] = DataType(record_type)
        attachment = data_fields.get("attachment")

        if attachment:
            url = attachment[0]["url"]
            path = data_fields["type"].resolve_attachment(
                data_fields["id"],
            )
            logging.info(f"Found file: {path}. Downloading now...")
            urllib.request.urlretrieve(url, path)
            data_fields["attachment"] = path

        return from_dict(cls, data_fields)


@dataclass
class Person:
    id: str
    name: str
    tagline: str
    description: str
    email: str
    linkedin: str
    photo: str | None = None

    @classmethod
    def load_airtable(cls, airtable_data: dict[str, str]):
        data_fields = airtable_data["fields"]
        data_fields["id"] = airtable_data["id"]

        # Airtable provides attachments as arrays; the field may be named
        # "photo" or "attachment" depending on table schema.
        photo = (
            data_fields.get("photo")
            or data_fields.get("attachment")
            or data_fields.get("attachments")
        )

        if photo:
            url = photo[0]["url"]
            # Ensure destination directory exists
            people_dir = f"{STORE_PATH}/people"
            os.makedirs(people_dir, exist_ok=True)

            # Store as PDF to match other endpoints' behavior
            path = f"{people_dir}/{data_fields['id']}.pdf"
            logging.info(f"Found file: {path}. Downloading now...")
            urllib.request.urlretrieve(url, path)
            data_fields["photo"] = path

        return from_dict(cls, data_fields)


@dataclass
class Event:
    id: str
    name: str
    summary: str
    status: EventStatus
    tags: list[str]
    date: datetime
    location_url: str | None = None
    registration_url: str | None = None
    attachment: str | None = None

    @classmethod
    def load_airtable(cls, airtable_data: dict[str, str]):
        data_fields = airtable_data["fields"]
        data_fields["id"] = airtable_data["id"]
        data_fields["date"] = datetime.fromisoformat(data_fields["date"])

        record_status = data_fields["status"]
        if record_status not in EventStatus:
            return None

        data_fields["status"] = EventStatus(record_status)
        attachment = data_fields.get("attachment")

        if attachment:
            url = attachment[0]["url"]
            path = f"{STORE_PATH}/events/{data_fields['id']}.pdf"

            logging.info(f"Found file: {path}. Downloading now...")
            urllib.request.urlretrieve(url, path)
            data_fields["attachment"] = path

        return from_dict(cls, data_fields)
