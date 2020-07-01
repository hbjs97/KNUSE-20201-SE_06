import mysql.connector
import sys
import requests
from mysql.connector import errorcode
from bs4 import BeautifulSoup as bs
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

config = {
    "user": "software",
    "password": "1q2w3e4r!",
    "host": "lunapreya.ddns.net",
    "database": "hbjs",
    "port": "3307"
}

def Create_DB(tbl_name):
    try:
        conn = mysql.connector.connect(**config, charset='utf8')
        cur = conn.cursor()
        cur.execute(
            '''CREATE TABLE {tab} (
             login_id VARCHAR(50),
             id VARCHAR(50),
             stud_name VARCHAR(50),
             major VARCHAR(50),
             state VARCHAR(50),
             course VARCHAR(50),
             year VARCHAR(50),
             subject VARCHAR(50),
             code VARCHAR(50),
             sub_name VARCHAR(50),
             score INT(11),
             grade VARCHAR(50),
             grade_num VARCHAR(50),
             PRIMARY KEY(id, code) );'''.format(tab=tbl_name)
        )
    except mysql.connector.Error as err:    #table 이미 존재하면 내용비움
        if err.errno == errorcode.ER_TABLE_EXISTS_ERROR:
            conn = mysql.connector.connect(**config, charset='utf8')
            cur = conn.cursor()
            cur.execute(
                '''
                TRUNCATE TABLE {tab}
                '''.format(tab=tbl_name)
            )
        else:
            print(err.msg)

def Insert_DB(score_info, list2, login_id) :
    try :
        # db 연결 객체 생성
        conn = mysql.connector.connect(**config, charset='utf8')
        # SQL 실행 객체 생성
        cur = conn.cursor()

        for i in range(0, len(list2)-1):
            sql = '''INSERT INTO {tab} (login_id, id, stud_name, major, state, course, year, subject, code, sub_name, score, grade, grade_num) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            '''.format(tab=login_id)
            cur.execute(sql, (login_id, stud_info[0], stud_info[1], stud_info[2], stud_info[3], stud_info[4], score_info[i][0], score_info[i][1], score_info[i][2], score_info[i][3], int(score_info[i][4]), score_info[i][5], score_info[i][6]))
            conn.commit()
        # DB 연결 예외 처리
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print('id or password 오류')
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print('db 연동 오류')
        else:
            print('기타 에러:', err)
        conn.rollback()  # 롤백 처리
    finally :
        conn.close()

def Retrieve_DB(tbl_name):  #지금은 출력, 파라미터와 리턴수정해 필요한 데이터 로드.
    try:
        conn = mysql.connector.connect(**config)
        print(conn)
        # db select, insert, update, delete 작업 객체
        cur = conn.cursor()
        # 실행할 select 문 구성
        sql = '''SELECT * FROM {tab} ORDER BY 1 DESC'''.format(tab=tbl_name)
        # cursor 객체를 이용해서 수행한다.
        cur.execute(sql)
        # select 된 결과 셋 얻어오기
        resultList = cur.fetchall()  # tuple 이 들어있는 list
        print(resultList)
        # DB 에 저장된 rows 출력해보기
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print('id or password 오류')
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print('db 연동 오류')
        else:
            print('기타 에러:', err)
        conn.rollback()  # 롤백 처리
    finally :
        conn.close()

options = webdriver.ChromeOptions()
options.add_argument('headless')
options.add_argument('--disable-gpu')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')

driver = webdriver.Chrome("./home/node/app/drivers/chromedriver", options=options)

#로그인
id = sys.argv[1]
passwd = sys.argv[2]
session = requests.session()
res = session.post('https://yes.knu.ac.kr/comm/comm/support/login/login.action',
                   data={'user.usr_id': id, 'user.passwd': passwd})
res.raise_for_status()
driver.get('https://yes.knu.ac.kr/')

for c in session.cookies:
    driver.add_cookie({'name': c.name, 'value': c.value})
driver.refresh()

#상담페이지
res = session.post('https://yes.knu.ac.kr/stud/smar/advcStu/stuAdvcAll/list.action')
html = res.text
soup = bs(html, 'html.parser')
advc = soup.select_one('.form4 td').text
#print('상담 : ' + advc)

#성적페이지
driver.get('https://yes.knu.ac.kr/cour/scor/certRec/certRecEnq/list.action')
try:
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "#certRecEnqGrid > div.title")))
except TimeoutException:
    print("Time out")
html = driver.page_source
soup = bs(html, 'html.parser')

#학적정보//list1
list1 = soup.select('#studInfo td')
stud_info = []
for i in list1:
    stud_info.append(i.text)
#stud_info[0~4] : 학번, 이름, 학과, 학적상태, 과정구분
#print(stud_info)

list2 = soup.select('#certRecEnqGrid .data')
score_info = []
for i in list2:
    subject = []
    subject.append(i.select_one('.yr_trm').text)  # 년도/학기
    subject.append(i.select_one('.subj_div_cde').text)  # 교과구분
    subject.append(i.select_one('.subj_cde').text)  # 과목코드
    subject.append(i.select_one('.subj_nm').text)  # 과목명
    subject.append(i.select_one('.unit').text)  # 학점
    subject.append(i.select_one('.rec_rank_cde').text)  # 점수
    subject.append(i.select_one('.grd').text)  # 평점
    score_info.append(subject)
del score_info[0]  # 빈 리스트(구분) 삭제

#print(score_info)
driver.quit()

Create_DB(id)
Insert_DB(score_info, list2, id)
