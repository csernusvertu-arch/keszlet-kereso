import json
import pandas as pd

# Excel beolvasása
df = pd.read_excel("../data/keszlet.xls")

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
    "../data/keszlet.json",
    orient="records",
    force_ascii=False,
    indent=4
)

print(f"{len(df)} termék exportálva.")