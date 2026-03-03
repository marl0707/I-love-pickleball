import os
import json
import shutil

DATA_DIR = 'data'
SALVAGED_DIR = 'salvaged_data'

def load_json(path):
    if not os.path.exists(path):
        return []
    with open(path, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
            if not isinstance(data, list):
                if isinstance(data, dict):
                    # Sometimes it's a dict, convert to list of 1 if needed or just return dict
                    return [data]
                return []
            return data
        except Exception as e:
            print(f"Error loading {path}: {e}")
            return []

def save_json(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
        
def merge_lists_by_id(list1, list2):
    """Merge two lists of dicts based on 'id'. list1 takes precedence if conflict, but missing fields from list2 are added."""
    merged = {}
    for item in list1:
        if 'id' in item:
            merged[item['id']] = item
        else:
            # no id, generate a temp one or just add
            merged[str(hash(str(item)))] = item
            
    for item in list2:
        if 'id' in item:
            if item['id'] in merged:
                # Merge fields
                for k, v in item.items():
                    if k not in merged[item['id']]:
                        merged[item['id']][k] = v
            else:
                merged[item['id']] = item
        else:
             merged[str(hash(str(item)))] = item
             
    return list(merged.values())

def process_file(src_name, dest_dir, dest_name=None):
    if not dest_name:
        dest_name = src_name
    
    src_path = os.path.join(SALVAGED_DIR, src_name)
    dest_path = os.path.join(DATA_DIR, dest_dir, dest_name)
    
    if not os.path.exists(src_path):
        return
        
    os.makedirs(os.path.join(DATA_DIR, dest_dir), exist_ok=True)
    
    src_data = load_json(src_path)
    
    if os.path.exists(dest_path):
        dest_data = load_json(dest_path)
        merged = merge_lists_by_id(dest_data, src_data)
        save_json(dest_path, merged)
        print(f"Merged {src_name} into {dest_dir}/{dest_name}")
    else:
        save_json(dest_path, src_data)
        print(f"Copied {src_name} to {dest_dir}/{dest_name}")

# Mapping of salvaged files to their destinations
mappings = [
    ('activity_logs.json', 'community'),
    ('announcements.json', 'community'),
    ('apparel_and_bags.json', 'gears', 'apparel_and_bags.json'),
    ('awards.json', 'events'),
    ('drills_beginner_intermediate.json', 'drills', 'drills_master.json'), # Merge into master
    ('dummy_communities.json', 'community', 'communities.json'),
    ('dummy_threads.json', 'community', 'threads.json'),
    ('dummy_users.json', 'community', 'users.json'),
    ('expert_reviews.json', 'reviews'),
    ('glossary.json', 'articles'),
    ('promotions_coupons.json', 'events'),
    ('tournaments_comprehensive.json', 'events', 'tournaments_and_events.json') # Merge
]

for src, d_dir, *d_name in mappings:
    dest_n = d_name[0] if d_name else src
    process_file(src, d_dir, dest_n)

# Also merge gear/ into gears/
if os.path.exists(os.path.join(DATA_DIR, 'gear')):
    for f in os.listdir(os.path.join(DATA_DIR, 'gear')):
        if f.endswith('.json'):
            src_p = os.path.join(DATA_DIR, 'gear', f)
            dest_p = os.path.join(DATA_DIR, 'gears', f)
            d1 = load_json(src_p)
            d2 = load_json(dest_p)
            m = merge_lists_by_id(d2, d1)
            save_json(dest_p, m)
            print(f"Merged gear/{f} into gears/{f}")
