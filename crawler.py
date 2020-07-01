from selenium import webdriver
from bs4 import BeautifulSoup
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

'''
웹사이트의 정보를 추출하는 크롤링 클래스.
본 클래스는 오픈소스 WebDriver 중 ChromeDriver를 사용.
본 기기가 소유한 Chrome 버전과 일치하는 버전을 찾아 설치할 것.
설치 링크: https://chromedriver.chromium.org/downloads
'''

driver_path = './'
url = 'https://yes.knu.ac.kr/'
options = webdriver.ChromeOptions()
options.add_argument('headless')
options.add_argument('--disable-gpu')


class Crawler:

    def __init__(self):
        try:
            self.driver = webdriver.Chrome(f'{driver_path}chromedriver', options=options)
        except Exception as err:
            print(err)
            raise err

    def __del__(self):
        self.driver.close()

    def login(self, id, pw):
        self.driver.get(f'{url}comm/comm/support/login/login.action')
        self.driver.find_element_by_name('user.usr_id').send_keys(id)
        self.driver.find_element_by_name('user.passwd').send_keys(pw)
        self.driver.find_element_by_xpath('//*[@id="loginBtn"]').click()

    def get_stud(self):
        self.driver.get(f'{url}cour/scor/certRec/certRecEnq/list.action')
        try:
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "#certRecEnqGrid > div.data")))
            html = self.driver.page_source
        except TimeoutException:
            raise TimeoutException

        soup = BeautifulSoup(html, 'html.parser')
        name = [i.text for i in soup.select('#studInfo th')]
        value = [i.text for i in soup.select('#studInfo td')]
        stud = dict(zip(name, value))
        return stud
