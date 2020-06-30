import pandas as pd
import numpy as np
import connector as db
import crawler as chrome
import mysql.connector


def add_where(where_sql, sql_list):
    for sql in sql_list:
        if sql is not None:
            where_sql = f'where {sql}' if where_sql == ''\
                else f'{where_sql} and {sql}'
    return where_sql


def print_list(name, sum, unit, list):
    print(f'{name}: {sum[0]} / {unit}')
    for i in list:
        print(i)


config = {
    "user": "root",
    "password": "root",
    "host": "127.0.0.1",
    "database": "hbjs",
    "port": "3306"
}

# 학생 정보 추출 - 원래 crawl 과정에서 진행해야 함.
# res = chrome.Crawler()
# id = input('ID: ')
# pw = input('PW: ')
# res.login(id, pw)

# stud = res.get_stud()
# year = stud["학번"][:4]

# 학생 정보에 따라 스크립트 적용
# server_path = f'./rule/IT대학 컴퓨터학부/{year}/'
server_path = f'./rule/IT대학 컴퓨터학부/2017/'
df = pd.read_csv(f'{server_path}script.csv', encoding='UTF-8-SIG')

with db.Connector(config) as conn:
    for i in df.index:

        # 구분명, 교과 구분, 요구 학점
        line = df.iloc[i]
        name = line["name"]
        division = line["division"]
        unit = line["unit"]

        # total(전체 과목) core(필수 과목) 정보 불러오기
        total = None if pd.isna(line['total'])\
            else pd.read_csv(f'{server_path}total/{line["total"]}.csv', encoding='UTF-8-SIG')

        core = None if pd.isna(line['core']) \
            else pd.read_csv(f'{server_path}core/{line["core"]}.csv', encoding='UTF-8-SIG')

        try:
            division_sql = None if pd.isna(line["division"]) \
                else f'subject = "{line["division"]}"'

            # 해당 구분명에 들어가는 과목들 추출.
            total_tp = '' if total is None else tuple(total["key"])
            total_sql = None if total is None else f'code in {total_tp}'
            where_sql = add_where('', [division_sql, total_sql])
            sql = f'select * from test {where_sql};'
            total_list = conn.fetch(sql)

            # 현재 이수 학점 - 설계 학점에 대한 특수 연산 필요.
            sql = f'select sum(score) from test {where_sql};'
            sum = conn.fetch(sql)[0]
            print_list(name, sum, unit, total_list)

        except mysql.connector.Error:
            print('Process is interrupted by the error.')

