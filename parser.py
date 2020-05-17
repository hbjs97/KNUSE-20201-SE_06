import time
from bs4 import BeautifulSoup as bs
from selenium import webdriver

driver = webdriver.Chrome("./driver/chromedriver")

#로그인
driver.get('https://yes.knu.ac.kr/comm/comm/support/login/login.action')
id = input('ID: ')
passwd = input('passwd: ')
driver.find_element_by_name('user.usr_id').send_keys(id)
driver.find_element_by_name('user.passwd').send_keys(passwd)
driver.find_element_by_xpath('//*[@id="loginBtn"]').click()

#상담페이지
driver.get('https://yes.knu.ac.kr/stud/smar/advcStu/stuAdvcAll/list.action')
time.sleep(2)
html_consult = driver.page_source
soup_consult = bs(html_consult, 'html.parser')

#파싱
data_consult = soup_consult.find('table', {'class': 'form4'})
tmp1 = data_consult.find('td', {'style': 'color:red;font-weight: bold;'})
cnt = tmp1.getText()
print(cnt)  #총 상담횟수: cnt


#성적페이지
driver.get('https://yes.knu.ac.kr/cour/scor/certRec/certRecEnq/list.action')
time.sleep(2)
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
data2_num = data2.find('div', {'class': 'data'})
list2_year = data2_num.findAll('td', {'class': 'yr_trm'})
list2_sub = data2_num.findAll('td', {'class': 'subj_div_cde'})
list2_code = data2_num.findAll('td', {'class': 'subj_cde'})
list2_name = data2_num.findAll('td', {'subj_nm'})
list2_score = data2_num.findAll('td', {'class': 'unit'})
list2_grade = data2_num.findAll('td', {'class': 'rec_rank_cde'})

score_info_year = []
score_info_sub = []
score_info_code = []
score_info_name = []
score_info_score = []
score_info_grade = []

for i in range(0, len(list2_year)):
    score_info_year.append(list2_year[i].getText()),
    score_info_sub.append(list2_sub[i].getText()),
    score_info_code.append(list2_code[i].getText()),
    score_info_name.append(list2_name[i].getText()),
    score_info_score.append(list2_score[i].getText()),
    score_info_grade.append(list2_grade[i].getText())

print(score_info_year)
print(score_info_sub)
print(score_info_code)
print(score_info_name)
print(score_info_score)
print(score_info_grade)
