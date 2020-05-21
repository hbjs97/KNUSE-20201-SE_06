import requests
from selenium import webdriver
from bs4 import BeautifulSoup
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

options = webdriver.ChromeOptions()
options.add_argument('headless')

driver = webdriver.Chrome('./chromedriver', options = options)

# 로그인
url = 'https://yes.knu.ac.kr/'

user_id = input('ID: ')
user_pw = input('PW: ')

session = requests.session()

res = session.post(url + 'comm/comm/support/login/login.action', data = {'user.usr_id': user_id, 'user.passwd': user_pw})

res.raise_for_status()

driver.get(url)
for c in session.cookies:
	driver.add_cookie({'name': c.name, 'value': c.value})
driver.refresh()

# 성적
driver.get(url + 'cour/scor/certRec/certRecEnq/list.action')
try:
	WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, "#certRecEnqGrid > div.data")))
	html = driver.page_source
except TimeoutException:
	print("Time out!")
finally:
	driver.quit()

soup = BeautifulSoup(html, 'html.parser')

list = soup.select('#certRecEnqGrid .data')
scoreList = []

for i in list:
	subject = []
	subject.append(i.select_one('.yr_trm').text)		# 년도/학기
	subject.append(i.select_one('.subj_div_cde').text)	# 교과구분
	subject.append(i.select_one('.subj_cde').text)		# 과목코드
	subject.append(i.select_one('.subj_nm').text)		# 과목명
	subject.append(i.select_one('.unit').text)			# 학점
	subject.append(i.select_one('.rec_rank_cde').text)	# 점수
	subject.append(i.select_one('.grd').text)			# 평점
	scoreList.append(subject)
del scoreList[0]	# 빈 리스트(구분) 삭제

print(scoreList)

# 상담
res = session.post(url + 'stud/smar/advcStu/stuAdvcAll/list.action')
html = res.text
soup = BeautifulSoup(html, 'html.parser')
advc = soup.select_one('.form4 td').text

print('상담 : ' + advc)