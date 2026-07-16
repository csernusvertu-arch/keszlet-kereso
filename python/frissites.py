from pathlib import Path
import pandas as pd

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

# JSON mentése
df.to_json(
    DATA_DIR / "keszlet.json",
    orient="records",
    force_ascii=False,
    indent=4
)

print(f"{len(df)} termék exportálva.")