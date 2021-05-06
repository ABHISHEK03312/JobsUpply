from .helpers import *
import json
#----------------------------- Recommender Functions ----------------------------------------------------

def userIndustryMap(usersData):
    # uersData is a dict of users info: major and minor
    usersData=usersData

    MajorIndustryMap={
        "Computer Science": ["Software Engineering","Information Technology", "Data Science", "Robotics"],
        "Computer Engineering": ["Network Sciences","Information Technology", "Robotics"],
        "Data Science and Artificial Intelligence": ["Data Science", "Information Technology", "Software Engineering", "Robotics"],
        "Chemical Engineering": ["Petrochemical"],
        "Civil Engineering": ["Civil Engineer", "Structural Engineer"],
        "Mechanical Engineering": ["Robotics", "Information Technology"],
        "Aerospace Engineering": [],
        "Material Science": ["fabricated metal products, machinery and equipment"],
        "Electrical and Electronics Engineering": ["Contol Systems", "IoT", "Information Technology"],
        "Business": ["financial and insurance services", "Business Administration"],
        "Finance": ["financial and insurance services"],
        "Accountancy": ["Accountancy"]
    }

    UserJobs=list()
    if usersData["major"] in MajorIndustryMap.keys():
        UserJobs.extend(MajorIndustryMap[usersData["major"]])
    
    try:
        if usersData["minor"] in MajorIndustryMap.keys():
            UserJobs.extend(MajorIndustryMap[usersData["minor"]])
    except:  # only happens with old default values i.e. {}
        pass

    RecIndustries=dict()
    vacRatio=dict(returnVacancyDemandDifference())
    for i in UserJobs:
        RecIndustries[i]=vacRatio[i]
    RecIndustries=sorted(RecIndustries.items(),key=lambda x:x[1], reverse=True)
    num = min(3, len(RecIndustries))
    return RecIndustries[:num]


def getVacancyDemandDifference():
    CourseindustryMap={
        "Information Technology":["information and communications", "financial and insurance services"],
        "Engineering Sciences":["fabricated metal products, machinery and equipment", "electronic, computer and optical products", "construction", "information and communications"],
        "Business & Administration":["financial and insurance services", "administrative and support services"],
        "Accountancy":["financial and insurance services"],
        "Humanities & Social Sciences":["financial and insurance services"]
    }
    industryCourseMap={
        "information and communications":['Information Technology', "Engineering Sciences" ],
        "fabricated metal products, machinery and equipment":["Engineering Sciences"],
        "financial and insurance services":["Business & Administration","Accountancy", "Humanities & Social Sciences", 'Information Technology'],
        "administrative and support services":["Business & Administration"],
        "electronic, computer and optical products":["Engineering Sciences"],
        "construction":["Engineering Sciences"]
    }
    
    VacRatio={}
    GradData={}
    for i in CourseindustryMap.keys():
        data=pullGraduateData(i.replace('&', 'and'), "2019")
        grad=data[i]["2019"]
        if len(CourseindustryMap[i]):
            grad=grad/len(CourseindustryMap[i])
            GradData[i]=grad
    for j in industryCourseMap.keys():
            indData=pullJobVacancyData("2020-Q4", j)
            vac=indData[j]["2020-Q4"]
            grad=0
            for i in industryCourseMap[j]:
                grad+=GradData[i]
            vac_ratio=vac/grad
            VacRatio[j]=vac_ratio
    VacRatio=sorted(VacRatio.items(),key=lambda x:x[1], reverse=True)
    VacRatio=dict(VacRatio)
    IndustrySearchTerm={
        "Software Engineering":"information and communications",
        "Information Technology":"information and communications",
        "Data Science":"information and communications",
        "Network Sciences":"information and communications",
        "Robotics": "electronic, computer and optical products",
        "Contol Systems": "electronic, computer and optical products",
        "IoT": "electronic, computer and optical products",
        "Civil Engineer": "construction",
        "Structural Engineer":"construction",
        "Petrochemical": "fabricated metal products, machinery and equipment",
        "fabricated metal products, machinery and equipment":"fabricated metal products, machinery and equipment",
        "financial and insurance services":"financial and insurance services",
        "Accountancy": "financial and insurance services",
        "Business Administration": "administrative and support services"
    }
    detailed_Vac={}
    for i in IndustrySearchTerm.keys():
        detailed_Vac[i]= VacRatio[IndustrySearchTerm[i]]

    detailed_Vac=sorted(detailed_Vac.items(),key=lambda x:x[1], reverse=True)
    return detailed_Vac

def returnVacancyDemandDifference():
    with open("./backend/DetailedVac.json", 'r') as f:
        detailed_vac= json.load(f)
        return detailed_vac