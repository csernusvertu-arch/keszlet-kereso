from pathlib import Path
import pandas as pd
import json
from datetime import datetime

# A frissites.py mappája
BASE_DIR = Path(__file__).resolve().parent

# A data mappa
DATA_DIR = BASE_DIR.parent / "data"

# Excel beolvasása
df = pd.read_excel(DATA_DIR / "keszlet.xls")

# Csak a szükséges oszlopok
df = df[["Megnevezés", "Cikkszám", "Készlet"]]

# Oszlopnevek átnevezése
df = df.rename(columns={
    "Megnevezés": "nev",
    "Cikkszám": "cikkszam",
    "Készlet": "keszlet"
})

# Hiányzó cikkszámok kezelése
df["cikkszam"] = df["cikkszam"].fillna("").astype(str)

# Termékek listája
products = df.to_dict(orient="records")

# JSON összeállítása
output = {
    "lastUpdated": datetime.now().strftime("%Y.%m.%d. %H:%M"),
    "products": products
}

# Mentés
with open(DATA_DIR / "keszlet.json", "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=4)

print(f"{len(products)} termék exportálva.")