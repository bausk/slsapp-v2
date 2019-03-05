from datetime import datetime as dt
from datetime import timedelta


def extract_from_df(df, date):
    relevant_df = df.loc[df['DateTime'].dt.date == date.date()]
    if relevant_df.size < 1:
        relevant_df = df.tail(1)
    return relevant_df


def date_from_timeline(start, end, coeff):
    days = (end - start).days
    days_offset = days * coeff
    date = start + timedelta(days=round(days_offset))
    return date


def normalize(df):
    df['T'] = df['T'].str.replace(",", ".").astype(float).fillna(0.0)
    df.X1 = df.X1.str.replace(",", ".").astype(float).fillna(0.0)
    df.X2 = df.X2.str.replace(",", ".").astype(float).fillna(0.0)
    df.X3 = df.X3.str.replace(",", ".").astype(float).fillna(0.0)
    df.X4 = df.X4.str.replace(",", ".").astype(float).fillna(0.0)
    df.Y1 = df.Y1.str.replace(",", ".").astype(float).fillna(0.0)
    df.Y2 = df.Y2.str.replace(",", ".").astype(float).fillna(0.0)
    df.Y3 = df.Y3.str.replace(",", ".").astype(float).fillna(0.0)
    df.Y4 = df.Y4.str.replace(",", ".").astype(float).fillna(0.0)
    return df


def all_to_average(df):
    return df.mean(numeric_only=True)
