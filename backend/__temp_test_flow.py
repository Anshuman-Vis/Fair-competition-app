import requests

base = 'http://localhost:5000/api/auth'
register_payload = {
    'email': 'verify@example.com',
    'password': 'Verify123!',
    'full_name': 'Verify User',
    'roll_number': 'VER001'
}
login_payload = {
    'email': 'verify@example.com',
    'password': 'Verify123!'
}
for name, payload in [('register', register_payload), ('login', login_payload)]:
    r = requests.post(f'{base}/{name}', json=payload)
    print(name.upper(), r.status_code)
    print(r.text)
