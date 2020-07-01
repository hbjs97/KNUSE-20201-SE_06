import mysql.connector

'''
기기와 데이터베이스의 연결을 담당하는 클래스.
'''


class Connector:

    def __init__(self, param):
        try:
            self.conn = mysql.connector.connect(**param)
        except mysql.connector.Error as err:
            print(err)
            raise err

    def __del__(self):
        if self.conn is not None:
            self.conn.quit()

    def __enter__(self):
        return self

    def __exit__(self, type, value, traceback):
        self.conn.close()
        self.conn = None

    # 데이터베이스 커서 등록.
    def __connect__(self):
        self.cur = self.conn.cursor()

    # 데이터베이스 커서 종료.
    def __disconnect__(self):
        self.cur.close()

    # 데이터베이스 쿼리 실행 및 회복.
    def __action__(self, sql):
        try:
            self.cur.execute(sql)
        except mysql.connector.Error:
            self.conn.rollback()

    # 반환값이 존재하는 쿼리 실행.
    def fetch(self, sql):
        self.__connect__()
        self.__action__(sql)
        result = self.cur.fetchall()
        self.__disconnect__()
        return result

    # 반환값이 존재하지 않는 쿼리 실행.
    def execute(self, sql):
        self.__connect__()
        self.__action__(sql)
        self.conn.commit()
        self.__disconnect__()
