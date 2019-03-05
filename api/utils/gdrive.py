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


def time_to_pd(row):
    return pd.to_datetime(row['DateTime'], infer_datetime_format=True)


def get_dataframe():
    data = get_data()
    headers = data.pop(0)
    df = pd.DataFrame(data, columns=headers)
    df['DateTime'] = df.apply(time_to_pd, axis=1)
    return normalize(df)
