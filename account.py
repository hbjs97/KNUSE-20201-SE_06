import mysql.connector
import csv

config = {
    "user": "root",
    "password": "root",
    "host": "127.0.0.1",
    "database": "hbjs",
    "port": "3306"
}


def db_open(param):
    conn = None
    try:
        conn = mysql.connector.connect(**param)
    except mysql.connector.Error as err:
        print("[Error] {}".format(err))
    finally:
        return conn


def db_close():
    conn.close()


# account 테이블이 없으면 테이블 생성.
def is_exist_table():
    sql = ('create table if not exists account ('
           'id char(20),'
           'pwd char(20)'
           ');'
           )
    cur.execute(sql)


# id, pw 기록
def add_account(id, pw):
    sql = f'insert into account value ("{id}", "{pw}");'
    cur.execute(sql)
    conn.commit()


# 적용 예시
conn = db_open(config)
if conn is None:
    exit("데이터베이스 연결 상태가 원활하지 않습니다.")

cur = conn.cursor()
is_exist_table()

id = input('ID: ')
pw = input('PW: ')
add_account(id, pw)

cur.execute('select * from account')
result = cur.fetchall()
print(result)

db_close()
