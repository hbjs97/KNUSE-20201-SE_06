import mysql.connector
import csv
from mysql.connector import errorcode


config = {
    "user": "root",
    "password": "root",
    "host": "127.0.0.1",
    "database": "hbjs",
    "port": "3306"
}

try:
    conn = mysql.connector.connect(**config)
    cur = conn.cursor()

    # 코드 읽기/실행 여부를 확인하기 위해 테이블 생성으로 테스트 중.
    cur.execute('CREATE TABLE summary(domain CHAR(20), cur int, dest int)')
    conn.commit()

    path = "./script/IT_COMP_2012.csv"
    with open(path, encoding='UTF-8') as f:
        reader = csv.reader(f, delimiter=',')
        next(reader)
        for txt in reader:

            cur.execute(txt[2])
            result = cur.fetchone()[0]

            sql = 'INSERT INTO summary(domain, cur, dest) VALUES(%s, %s, %s)'
            cur.execute(sql, (txt[0], result, txt[1]))
            conn.commit()

        cur.execute('SELECT * FROM summary')
        resultList = cur.fetchall()
        print(resultList)
except mysql.connector.Error as err:
    if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
        print('id or password 오류')
    elif err.errno == errorcode.ER_BAD_DB_ERROR:
        print('db 연동 오류')
    else:
        print('기타 에러:', err)
    conn.rollback()  # 롤백 처리
finally :
    cur.execute('DROP TABLE summary')
    conn.commit()
    conn.close()
