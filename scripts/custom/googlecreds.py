import json

def script():
    with open('.secrets/googlekey.json', 'r') as credfile:
        key = credfile.read()
        serialized = json.dumps(json.loads(key))
    return serialized
