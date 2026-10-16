"""Készletlista frissítése a Raktárkezelő programból (a Naturasoft-os Excel export helyett).

A Raktárkezelő adatbázisából olvas (csak olvasás, semmit nem módosít), és elkészíti a
data/keszlet.json fájlt, amit a Készlet kereső weboldal megjelenít.
Csak a termék neve, cikkszáma és készlete kerül bele – vevők, árak, bizonylatok nem.
"""
import json
import os
import sqlite3
import sys
from datetime import datetime
from pathlib import Path

# A frissites.py mappája és a data mappa
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR.parent / "data"

# A Raktárkezelő adatbázisa (ha máshová kerül a program, itt kell átírni,
# vagy a RAKTARKEZELO_DB környezeti változóval megadni)
RAKTARKEZELO_DB = Path(os.environ.get(
    "RAKTARKEZELO_DB",
    Path.home() / "Desktop" / "Csernus és Társa Kft" / "Sajat_Keszletnyilvantarto" / "data" / "keszlet.db",
))

if not RAKTARKEZELO_DB.exists():
    print(f"HIBA: nem találom a Raktárkezelő adatbázisát:\n  {RAKTARKEZELO_DB}")
    sys.exit(1)

con = sqlite3.connect(RAKTARKEZELO_DB, timeout=10)
con.row_factory = sqlite3.Row
rows = con.execute(
    """
    SELECT f.name AS family, s.size, coalesce(s.code, '') AS code,
           coalesce((SELECT SUM(m.qty) FROM movements m WHERE m.sku_id = s.id), 0) AS stock
    FROM skus s
    JOIN families f ON f.id = s.family_id
    JOIN product_types t ON t.code = f.type
    WHERE s.active = 1 AND f.active = 1
    ORDER BY f.name, s.sort_key, s.size
    """
).fetchall()
con.close()

# Termékek listája – ugyanaz a formátum, mint korábban (nev, cikkszam, keszlet)
products = [
    {"nev": f"{r['family']} {r['size']}", "cikkszam": r["code"], "keszlet": int(round(r["stock"]))}
    for r in rows
]

output = {
    "lastUpdated": datetime.now().strftime("%Y.%m.%d. %H:%M"),
    "products": products,
}

with open(DATA_DIR / "keszlet.json", "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=4)

print(f"{len(products)} termék exportálva a Raktárkezelőből "
      f"(összesen {sum(p['keszlet'] for p in products)} db).")
