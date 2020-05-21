import mysql.connector
from mysql.connector import errorcode

from bs4 import BeautifulSoup as bs
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import getpass

options = webdriver.ChromeOptions()
options.add_argument('headless')
options.add_argument('--disable-gpu')

driver = webdriver.Chrome("./driver/chromedriver", options=options)

config = {
    "user": "root",
    "password": "root",
    "host": "127.0.0.1",
    "database": "hbjs",
    "port": "3306"
}

#로그인
driver.get('https://yes.knu.ac.kr/comm/comm/support/login/login.action')
id = input('ID: ')
passwd = input('passwd: ')
driver.find_element_by_name('user.usr_id').send_keys(id)
driver.find_element_by_name('user.passwd').send_keys(passwd)
driver.find_element_by_xpath('//*[@id="loginBtn"]').click()

#상담페이지
driver.get('https://yes.knu.ac.kr/stud/smar/advcStu/stuAdvcAll/list.action')
html_consult = driver.page_source
soup_consult = bs(html_consult, 'html.parser')

#파싱
data_consult = soup_consult.find('table', {'class': 'form4'})
tmp1 = data_consult.find('td', {'style': 'color:red;font-weight: bold;'})
consult = tmp1.getText()
print(consult)  #총 상담횟수


#성적페이지
driver.get('https://yes.knu.ac.kr/cour/scor/certRec/certRecEnq/list.action')
try:
    WebDriverWait(driver, 10).until(
         EC.presence_of_element_located((By.CSS_SELECTOR, "#certRecEnqGrid > div.title")))
except TimeoutException:
    print("10sec, time out")
html = driver.page_source
soup = bs(html, 'html.parser')

#파싱
data = soup.find('div', {'id': 'content'})
#학적정보//data1, list1
data1 = data.find('table', {'class': 'form4'})
list1 = data1.findAll('td')
stud_info = []
for i in range(0, len(list1)):
    stud_info.append(list1[i].getText())
#stud_info[0~4] : 학번, 이름, 학과, 학적상태, 과정구분
print(stud_info)

#전체성적//data2, list2
data2 = data.find('div', {'id': 'certRecEnqGrid'})
list2 = data2.findAll('td')
score_info = []
group_num = int(len(list2)/7)   #강의 갯수
i = 0
for j in range(0, group_num):
    score_info.append([list2[i].text,
                       list2[i+1].text,
                       list2[i+2].text,
                       list2[i+3].text,
                       list2[i+4].text,
                       list2[i+5].text])
    i = i+7

print(score_info)
driver.quit()


try:
    # db 연결 객체 생성
    conn = mysql.connector.connect(**config, charset='utf8')
    # SQL 실행 객체 생성
    cur = conn.cursor()

    i=0
    for i in range(i, int(len(list2)/7)):
        sql = 'INSERT INTO test (id, stud_name, major, state, course, year, subject, code, sub_name, score, grade) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'
        cur.execute(sql, (stud_info[0], stud_info[1], stud_info[2], stud_info[3], stud_info[4], score_info[i][0], score_info[i][1], score_info[i][2], score_info[i][3], score_info[i][4], score_info[i][5]))
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

finally:
    conn.close()
