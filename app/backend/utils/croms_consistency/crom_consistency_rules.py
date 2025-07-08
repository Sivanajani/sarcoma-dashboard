from datetime import datetime, date
import re
from sqlalchemy import text

def normalize(value):
    if value is None:
        return ""
    return re.sub(r"\s+", " ", str(value).strip().lower()
                  .replace("_", " ")
                  .replace("-", " ")
                  .replace(":", " ")
                  .replace("/", " ")
                  .replace(",", " "))