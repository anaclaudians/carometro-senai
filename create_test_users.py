import urllib.request
import urllib.error
import json

URL = 'https://zdhpyflnyopwhgvbpibf.supabase.co'
KEY = 'sb_publishable_xZGVQv0UWu_cauVfQoiL6Q_RRytQozQ'

users = [
    {"email": "11111111111@senai.br", "password": "senaiadmin", "role": "admin", "cpf": "11111111111"},
    {"email": "22222222222@senai.br", "password": "senaiviewer", "role": "viewer", "cpf": "22222222222"}
]

def signup(email, password, cpf, role):
    print(f"Creating {role} ({cpf})...")
    req = urllib.request.Request(f"{URL}/auth/v1/signup", 
        data=json.dumps({"email": email, "password": password}).encode('utf-8'),
        headers={'apikey': KEY, 'Authorization': f'Bearer {KEY}', 'Content-Type': 'application/json'},
        method='POST'
    )
    try:
        urllib.request.urlopen(req)
        print(" -> Auth: OK")
    except urllib.error.HTTPError as e:
        print(" -> Auth Error:", e.read().decode('utf-8'))

    req2 = urllib.request.Request(f"{URL}/rest/v1/usuarios", 
        data=json.dumps({"cpf": cpf, "role": role}).encode('utf-8'),
        headers={'apikey': KEY, 'Authorization': f'Bearer {KEY}', 'Content-Type': 'application/json', 'Prefer': 'resolution=merge-duplicates'},
        method='POST'
    )
    try:
        urllib.request.urlopen(req2)
        print(" -> DB (usuarios): OK")
    except urllib.error.HTTPError as e:
        print(" -> DB Error:", e.read().decode('utf-8'))

for u in users:
    signup(u['email'], u['password'], u['cpf'], u['role'])
