import requests
url = 'http://localhost:5000/api/auth/login'
payload = {
    'email': 'test@example.com',
    'password': 'Test1234!'
}
try:
    r = requests.post(url, json=payload)
    print('STATUS', r.status_code)
    print('TEXT', r.text)
    try:
        print('JSON', r.json())
    except Exception as e:
        print('JSON ERR', e)
except Exception as e:
    print('ERROR', e)
