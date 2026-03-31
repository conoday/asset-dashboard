import json
import re
import argparse
import difflib
from pathlib import Path


def load_cities(path: Path):
    if path.exists():
        with path.open(encoding='utf-8') as f:
            return [line.strip() for line in f if line.strip()]
    # fallback small list
    return [
        'Jakarta', 'Jakarta Barat', 'Jakarta Utara', 'Jakarta Selatan', 'Jakarta Pusat',
        'Bandung', 'Bekasi', 'Tangerang', 'Tangerang Selatan', 'Bogor', 'Depok',
        'Surabaya', 'Malang', 'Semarang', 'Yogyakarta', 'Solo', 'Cirebon', 'Medan',
        'Pekanbaru', 'Padang', 'Palembang', 'Pontianak', 'Banjarmasin', 'Makassar',
        'Manado', 'Kupang', 'Dili', 'Pangkal Pinang', 'Aceh Besar', 'Sukabumi', 'Karawang',
        'Cikarang', 'Karang Tengah', 'Sragen', 'Brebes', 'Cirebon', 'Samarinda', 'Kota Raja'
    ]


def normalize(s: str) -> str:
    s = s or ''
    s = s.replace('/', ' ').replace('-', ' ')
    s = re.sub(r"[^0-9a-zA-Z\u00C0-\u024F\s,]", ' ', s)
    return re.sub(r'\s+', ' ', s).strip().lower()


def extract_by_keyword(addr_norm: str):
    # look for patterns like 'kota X', 'kabupaten Y', 'kab X'
    m = re.search(r'\b(kabupaten|kab\.?|kota)\s+([a-z\s]+)', addr_norm)
    if m:
        return m.group(2).strip().title()
    return None


def find_city_from_list(addr_norm: str, cities: list):
    matches = []
    for c in cities:
        if c.lower() in addr_norm:
            matches.append(c)
    if matches:
        # prefer longest match (more specific)
        return sorted(matches, key=lambda x: -len(x))[0]
    # fuzzy match using difflib
    cand = difflib.get_close_matches(addr_norm, cities, n=1, cutoff=0.6)
    if cand:
        return cand[0]
    # try matching by tokens
    tokens = [t for t in addr_norm.split() if len(t) > 3]
    for t in tokens[::-1]:
        cand = difflib.get_close_matches(t, cities, n=1, cutoff=0.8)
        if cand:
            return cand[0]
    return None


def fill_kota(records: list, cities: list):
    updated = 0
    unresolved = []
    for r in records:
        addr = r.get('alamat') or ''
        if not addr:
            unresolved.append(r.get('kode_nasabah'))
            continue
        addr_norm = normalize(addr)
        # try explicit keywords first
        found = extract_by_keyword(addr_norm)
        if not found:
            found = find_city_from_list(addr_norm, cities)
        if found:
            r['calon_kota_kabupaten'] = found
            updated += 1
        else:
            r['calon_kota_kabupaten'] = None
            unresolved.append(r.get('kode_nasabah'))
    return updated, unresolved


def main():
    p = argparse.ArgumentParser(description='Fill calon_kota_kabupaten from alamat')
    p.add_argument('input', help='input JSON file (array of objects)')
    p.add_argument('-o', '--output', help='output JSON file', default=None)
    p.add_argument('-c', '--cities', help='cities list file (one per line)', default='cities.txt')
    args = p.parse_args()

    inp = Path(args.input)
    if not inp.exists():
        print('Input file not found:', inp)
        return

    with inp.open(encoding='utf-8') as f:
        data = json.load(f)

    cities_path = Path(args.cities)
    cities = load_cities(cities_path)

    updated, unresolved = fill_kota(data, cities)

    out_path = Path(args.output) if args.output else inp.with_name(inp.stem + '_with_kota.json')
    with out_path.open('w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f'Processed {len(data)} records, updated {updated}, unresolved {len(unresolved)}')
    if unresolved:
        print('Sample unresolved kode_nasabah (first 20):', unresolved[:20])


if __name__ == '__main__':
    main()
