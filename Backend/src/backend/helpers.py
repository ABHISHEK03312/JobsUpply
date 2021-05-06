import string
import requests
import json
import numpy as np
import pandas as pd
from pandas import json_normalize # easy JSON -> pd.DataFrame
from bs4 import BeautifulSoup
import urllib
import math
import random

from linkedin_jobs_scraper import LinkedinScraper
from linkedin_jobs_scraper.events import Events, EventData
from linkedin_jobs_scraper.query import Query, QueryOptions, QueryFilters
from linkedin_jobs_scraper.filters import RelevanceFilters, TimeFilters, TypeFilters, ExperienceLevelFilters

import logging

# Change root logger level (default is WARN)
logging.basicConfig(level=logging.WARNING)

# --------------------------------------------- HELPER FUNCTIONS ----------------------------------------------------
class PasswordException(Exception):
    """
    Raised when password doesn't meet standards
    """
    pass

def connect_to_skill_auth():
    auth_endpoint = "https://auth.emsicloud.com/connect/token" # auth endpoint

    # client_id = "m4swnl3xfovq09t0" # replace 'your_client_id' with your client id from your api invite email
    # client_secret = "zAPOkRHd" # replace 'your_client_secret' with your client secret from your api invite email
    # scope = "emsi_open" # ok to leave as is, this is the scope we will used

    client_id = "omvt0kns4wewr1sh" # replace 'your_client_id' with your client id from your api invite email
    client_secret = "0aZb3T8T" # replace 'your_client_secret' with your client secret from your api invite email
    scope = "emsi_open" # ok to leave as is, this is the scope we will used


    payload = "client_id=" + client_id + "&client_secret=" + client_secret + "&grant_type=client_credentials&scope=" + scope # set credentials and scope
    headers = {'content-type': 'application/x-www-form-urlencoded'} # headers for the response
    access_token = json.loads((requests.request("POST", auth_endpoint, data=payload, headers=headers)).text)['access_token'] # grabs request's text and loads as JSON, then pulls the access token from that
    return access_token

def extract_skills_list():
    access_token=connect_to_skill_auth()
    all_skills_endpoint = "https://emsiservices.com/skills/versions/latest/skills" # List of all skills endpoint
    auth = "Authorization: Bearer " + access_token # Auth string including access token from above
    headers = {'authorization': auth} # headers
    response = requests.request("GET", all_skills_endpoint, headers=headers) # response
    response = response.json()['data'] # the data

    all_skills_df = pd.DataFrame(json_normalize(response)); # Where response is a JSON object drilled down to the level of 'data' key
    all_skills_df.drop(['id', 'infoUrl', 'type.id', 'type.name'], axis=1, inplace=True)
    all_skills_df.columns=["name"]
    return all_skills_df.to_json(orient="records")


def extract_skills_from_document(docText):
    docText = str(docText)
    docText = ''.join(ch for ch in docText if ch in string.printable)
    docText = ' '.join(docText.split())
    access_token=connect_to_skill_auth()
    skills_from_doc_endpoint = "https://emsiservices.com/skills/versions/latest/extract"
    text=docText
    # text = "Requirements: Knowledge of SQL, R and Python Good to have: Experience with geospatial analysis Experience with Looker, Tableau platforms Understanding of Unit Economics of Asset-heavy businesses Past proven experience: Degree in Statistics or other Mathematical Degree. For example: Master's Degree in Operations Research, Industrial Engineering, Applied Mathematics, Statistics, Physics, Computer Science, or related fields Not open to fresh graduates, preferred experience in fast going startup for at least 3 years Demonstrated experience applying data science methods to real-world data problems (please highlight this experience in CV) Experience utilising visualisation tools to take advantage of the growing volume of available information ( please highlight this experience in CV)"
    confidence_interval = str(0.975)
    payload = "{ \"text\": \"... " + text + " ...\", \"confidenceThreshold\": " + confidence_interval + " }"

    headers = {
        'authorization': "Bearer " + access_token,
        'content-type': "application/json"
        }

    response = requests.request("POST", skills_from_doc_endpoint, data=payload.encode('utf-8'), headers=headers)
    try:
        skills_found_in_document_df = pd.DataFrame(json_normalize(response.json()['data'])); # Where response is a JSON object drilled down to the level of 'data' key
        skills_found_in_document_df.drop(['confidence','skill.type.name','skill.id', 'skill.type.id','skill.infoUrl', 'skill.tags'], axis=1, inplace=True)
        skills_found_in_document_df.columns=["name"]                                     
        return skills_found_in_document_df.to_json(orient="records")
    except Exception as e:
        print(e)
        return json.dumps([])



def scrapeLinkedinJobs(industries):
    
    scraper = LinkedinScraper(
    # chrome_executable_path='D:/chromedriver.exe', # Custom Chrome executable path (e.g. /foo/bar/bin/chromedriver) 
    chrome_executable_path='C:/Users/iyeng/Desktop/NTU/NTU Sem 4/CZ2006/JobsUpply/JobsUpply/chromedriver.exe',
    chrome_options=None,  # Custom Chrome options here
    headless=True,  # Overrides headless mode only if chrome_options is None
    max_workers=len(industries),  # How many threads will be spawned to run queries concurrently (one Chrome driver for each thread)
    slow_mo=2,  # Slow down the scraper to avoid 'Too many requests (429)' errors
    )
    queries=[]
    for i in range(len(industries)):
        paramQ=Query(
        query=industries[i],
        options=QueryOptions(
            locations=['Singapore'],
            optimize=True,
            limit=6,
            filters=QueryFilters(
                company_jobs_url=None,  # Filter by companies
                relevance=RelevanceFilters.RECENT,
                time=TimeFilters.MONTH,
                type=[TypeFilters.FULL_TIME],
                experience=None,
                )
            )
        )
        queries.append(paramQ)

    JobList={}
    def on_data(data: EventData):
        jobData={}
        jobData["title"]=data.title
        jobData["company"]=data.company
        jobData["place"]=data.place
        jobData["description"]=data.description
        jobData["linkedinUrl"]=data.link
        jobData["descriptionHTML"]=data.description_html
        jobData["employmentType"]=data.employment_type
        jobData["applyUrl"]=data.apply_link
        jobData["date"]=data.date
        jobData["seniority"]=data.seniority_level
        jobData["jobFunction"]=data.job_function
        jobData["industries"]=data.industries
        jobData["skills"] = json.loads(extract_skills_from_document(data.description))
        if data.query not in JobList.keys():
            JobList[data.query]=[]
            JobList[data.query].append(jobData)
        else:
            JobList[data.query].append(jobData)
        del data
        del jobData


    
    def on_error(error):
        print('[ON_ERROR]', error)


    def on_end():
        print('[ON_END]')

    scraper.on(Events.DATA, on_data)
    scraper.on(Events.ERROR, on_error)
    scraper.on(Events.END, on_end)

    scraper.run(queries)

    JobList = [{"queryText":q, "jobList":JobList[q]} for q in JobList.keys()]
    return JobList


def pullGraduateData(course, year):
    url = 'https://data.gov.sg/api/action/datastore_search?resource_id=115bf8a7-46df-466c-b7fc-375ef3c1b425&q={'
    queryList = ['\"sex\":\"mf\"']
    if course:
        course = course.replace(" ", "%20")  # replaces spaces with %20
        queryList.append('\"course\":\"'+course+'\"')  # queries by course
    if year:
        queryList.append('\"year\":\"'+year+'\"')  # queries by year
    url += ",".join(queryList)
    url += "}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36'})
    with urllib.request.urlopen(req) as fileobj:
        result = fileobj.read()
        json_result = result.decode('utf8').replace("'", '"')  # replace ' with " just in case, make it json format
        data = json.loads(json_result)
        clean_result = {}  # creating a clean dict with filtered results
        for item in data['result']['records']:
            cname = item["course"]
            yr = item["year"]
            if year and year!=yr:  # skips record if year parameter is input and does not match
                continue
            if cname not in clean_result.keys():
                clean_result[cname] = {}
            clean_result[cname][yr] = int(item["graduates"])
        
        # sorting the results of each course by descending order of year
        clean_result = {k: dict(sorted(clean_result[k].items(), reverse=True)) for k in clean_result.keys()}
    
    return clean_result

def pullJobVacancyData(quarter, industry):
    url = "https://data.gov.sg/api/action/datastore_search?resource_id=f590306d-160a-4b20-9f3c-15e234dd64ce&q={"
    queryList = []
    if industry:
        industry = industry.replace(" ", "%20")  # replaces spaces with %20
        queryList.append('\"industry2\":\"'+industry+'\"')  # queries by industry2
    if quarter:
        queryList.append('\"quarter\":\"'+quarter+'\"')  # queries by quarter in YYYY-QN format
    url += ",".join(queryList)
    url += "}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36'})
    with urllib.request.urlopen(req) as fileobj:
        result = fileobj.read()
        json_result = result.decode('utf8').replace("'", '"')  # replace ' with " just in case, make it json format
        data = json.loads(json_result)
        clean_result = {}  # creating a clean dict with filtered results
        for item in data['result']['records']:
            ind = item["industry2"]
            q = item["quarter"]
            if quarter and quarter!=q:  # skips record if quarter parameter is input and does not match
                continue
            if ind not in clean_result.keys():
                clean_result[ind] = {}
            clean_result[ind][q] = int(item["job_vacancy"])
        
        # sorting the results of each course by descending order of year
        clean_result = {k: dict(sorted(clean_result[k].items(), reverse=True)) for k in clean_result.keys()}
    
    return clean_result

def get_list_courses(i, q):
    courses = []
    for j in range(1,i+1):
        courses_url = []
        courses_name = []
        coursera_website = requests.get("https://www.coursera.org/courses?query="+q+"&page="+str(j)+"&index=test_skills_update_prod_all_products_term_optimization")
        coursera_website_content = BeautifulSoup(coursera_website.content,'html.parser')

        try:
            coursera_courses_content = coursera_website_content.findAll('a',class_="color-primary-text card-title headline-1-text")
            for k in range(0,len(coursera_courses_content)):
                courses_url.append("https://www.coursera.org"+coursera_courses_content[k]['href'])
            for l in range(0,len(coursera_courses_content)):
                courses_name.append(coursera_courses_content[l].get_text())

            name = 0
            for url in courses_url:
                dict1 = {}
                coursera_website = requests.get(url)
                coursera_website_content = BeautifulSoup(coursera_website.content,'html.parser')

                coursera_whatuwilllearn = coursera_website_content.findAll('div',class_='rc-CML styled show-soft-breaks')
                coursera_skill = coursera_website_content.findAll('span',class_='_1q9sh65')
                coursera_about = coursera_website_content.findAll('div',class_='description')
                coursera_instructor = coursera_website_content.findAll('h3',class_='instructor-name headline-3-text bold')
                coursera_ratings1 = coursera_website_content.findAll('div',class_='_wmgtrl9 color-white ratings-count-expertise-style')
                coursera_numenrolled = coursera_website_content.findAll('div',class_="_1fpiay2")
                coursera_stars = coursera_website_content.findAll('span',class_="_16ni8zai m-b-0 rating-text number-rating number-rating-expertise")
                coursera_esttime = coursera_website_content.findAll('div',class_="_16ni8zai m-b-0")
                coursera_suggested_time = coursera_website_content.findAll('div',class_="font-sm text-secondary")
                coursera_univname = coursera_website_content.findAll('img',class_="_1g3eaodg")

                courses_whatuwilllearn = {}
                for i in range(0,len(coursera_whatuwilllearn)):
                    courses_whatuwilllearn[i] = coursera_whatuwilllearn[i].get_text()
                courses_skill = {}
                for j in range(0,len(coursera_skill)):
                    courses_skill[j] = coursera_skill[j].get_text()
                courses_instructor = {}
                for k in range(0,len(coursera_instructor)):
                    courses_instructor[k] = coursera_instructor[k].get_text()

                dict1['course'] = courses_name[name]
                dict1['url'] = url
                
                dict1['content'] = courses_whatuwilllearn
                dict1['skills'] = courses_skill
                try:
                    dict1['about'] = coursera_about[0].get_text()
                except:
                    dict1['about'] = "None"
                dict1['instructor'] = courses_instructor
                try:
                    dict1['numratings'] = coursera_ratings1[0].get_text()
                except:
                    dict1['numratings'] = "None"
                try:
                    dict1['numenrolled'] = coursera_numenrolled[0].get_text()
                except:
                    dict1['numenrolled'] = "None"
                try:
                    dict1['rating'] = coursera_stars[0].get_text()
                except:
                    dict1['rating'] = "None"
                # course_esttime.append(coursera_esttime)
                # try:
                #   course_suggested_time.append(coursera_suggested_time[4].get_text())
                # except:
                #   course_suggested_time.append("None")
                try:
                    dict1['university'] = coursera_univname[0]['alt']
                except:
                    dict1['university'] = "None"    

                name = name+1    

                if dict1 in courses:
                    raise ValueError
                courses.append(dict1)
        except:
            break

    return courses

def find_by_skill_name(SkillDict):
    skillsString=", ".join(SkillDict.values())
    return (extract_skills_from_document(skillsString))

def generateOTP() :
    digits = "0123456789"
    OTP = ""
  
    for i in range(4) :
        OTP += digits[math.floor(random.random() * 10)]
  
    return OTP