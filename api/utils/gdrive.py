import os
import json
import gspread
import pandas as pd
from utils.data import normalize
from oauth2client.service_account import ServiceAccountCredentials


def get_data():
    url = os.getenv('GSHEETS_SHEET')
    scope = ['https://spreadsheets.google.com/feeds']
    credfile = json.loads(os.getenv('GSPREAD_CREDENTIALS'))
    creds = ServiceAccountCredentials.from_json_keyfile_dict(credfile, scope)
    gdrive_client = gspread.authorize(creds)
    data_sheet = gdrive_client.open_by_url(url)
    data = data_sheet.get_worksheet(0).get_all_records()
    return data


def get_dataframe():
    data = get_data()
    headers = data.pop(0)
    df = pd.DataFrame(data, columns=headers)
    origin = df['DateTime']
    df['DateTime'] = pd.to_datetime(origin, format='%d.%m.%Y %H:%M:%S', errors='coerce')
    mask = df['DateTime'].isnull()
    df.loc[mask, 'DateTime'] = pd.to_datetime(origin[mask], format='%d.%m.%Y %H:%M',
        errors='coerce')
    mask = df['DateTime'].isnull()
    df.loc[mask, 'DateTime'] = pd.to_datetime(origin[mask], format='%Y-%m-%d %H:%M:%S',
        errors='coerce')
    mask = df['DateTime'].isnull()
    df.loc[mask, 'DateTime'] = pd.to_datetime(origin[mask], format='%Y-%m-%d %H:%M',
        errors='coerce')
    return normalize(df.sort_values(by='DateTime',ascending=True))
