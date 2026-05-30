import pandas as pd
import json
import os

# Config
EXCEL_FILE = 'Database Study Turtle.xlsx'
OUTPUT_DIR = 'src/data/alumni'
MENTORS = [
    'Muhamad Hudya Ramadhana',
    'Mutia Ayu DIanita',
    'Tivo Yudha Perwira',
    'Natasha Syeikinah Marsauli',
    'Ugi Ispoyo Widodo',
    'Jasmine Nabilla',
    'Jasmine Nabila Novel',
    'Mudzakki Ahmad',
]

def is_mentor(name):
    if pd.isna(name):
        return True
    name_clean = str(name).strip()
    for mentor in MENTORS:
        if name_clean.lower() == mentor.lower():
            return True
    return False

def normalize_verified(val):
    if pd.isna(val):
        return False
    if isinstance(val, bool):
        return val
    if isinstance(val, (int, float)):
        return bool(val)
    return str(val).strip().lower() in ['true', '1', 'yes']

def main():
    df = pd.read_excel(EXCEL_FILE, sheet_name=None)
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    for sheet_name, sheet_df in df.items():
        if sheet_name == 'List Mentor':
            continue
        if sheet_name == 'Database 2022':
            continue
        
        # Extract year from sheet name (e.g., "Database 2015" -> 2015)
        year_str = sheet_name.replace('Database ', '').strip()
        try:
            year = int(year_str)
        except ValueError:
            print(f"Skipping unknown sheet: {sheet_name}")
            continue
        
        # Clean data
        sheet_df = sheet_df.dropna(subset=['Name'])
        
        alumni_list = []
        seq = 1
        
        for _, row in sheet_df.iterrows():
            name = str(row['Name']).strip()
            
            if is_mentor(name):
                print(f"  Skipping mentor: {name} (year {year})")
                continue
            
            # Build JSON object
            alumni = {
                "id": f"alumni-{year}-{seq:03d}",
                "name": name,
                "role": "Anggota",
                "batch": year,
                "consent": False,
            }
            
            # Optional fields
            if 'Main Skills' in row and not pd.isna(row['Main Skills']):
                alumni["currentPosition"] = str(row['Main Skills']).strip()
            
            linkedin = None
            if 'Linkedin' in row and not pd.isna(row['Linkedin']):
                linkedin = str(row['Linkedin']).strip()
                if linkedin:
                    alumni["contact"] = {"linkedin": linkedin}
            
            alumni["achievements"] = []
            
            alumni_list.append(alumni)
            seq += 1
        
        # Sort by name
        alumni_list.sort(key=lambda x: x['name'])
        
        # Save JSON
        output_file = os.path.join(OUTPUT_DIR, f"{year}.json")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(alumni_list, f, indent=2, ensure_ascii=False)
        
        print(f"Generated {output_file}: {len(alumni_list)} alumni")
    
    # Remove dummy files
    dummy_files = ['2023.json', '2024.json']
    for dummy in dummy_files:
        dummy_path = os.path.join(OUTPUT_DIR, dummy)
        if os.path.exists(dummy_path):
            os.remove(dummy_path)
            print(f"Removed dummy file: {dummy_path}")
    
    print("\nDone!")

if __name__ == '__main__':
    main()
