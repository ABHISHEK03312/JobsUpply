from django.http.response import JsonResponse
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect

import json
from rest_framework.parsers import JSONParser 
from rest_framework import permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view

from .models import *
from .serializers import *

from .helpers import *
from .recommenders import *

from timeit import default_timer as timer

# --------------------------------------------- GOV DATA APIS ----------------------------------------------------

def index(request):
    return HttpResponse("Hello, world. You're at the JobsUpply index.")

def testJsonResponse(request):
    message = request.GET.get('val')
    if message:
        return JsonResponse({"Test Successful": message})
    else:
        return JsonResponse({"Test Unscuccessful": "No parameter detected"})

def graduateGovAPI(request):
    course = request.GET.get("course")
    year = request.GET.get("year")

    if (not course) and (not year):
        return JsonResponse({"Test Unscuccessful": "No parameter detected"})
    
    result = pullGraduateData(course, year)

    # jsonify and return clean dictionary
    try:
        return JsonResponse(result)
    except:
        print("Result was not directly serializable, check code.")
        return JsonResponse(result, safe=False)

def jobVacancyAPI(request):
    industry = request.GET.get("industry")
    quarter = request.GET.get("quarter")

    if (not industry) and (not quarter):
        return JsonResponse({"Test Unscuccessful": "No parameter detected"})
    
    result = pullJobVacancyData(quarter, industry)

    # jsonify and return clean dictionary
    try:
        return JsonResponse(result)
    except:
        print("Result was not directly serializable, check code.")
        return JsonResponse(result, safe=False)

@api_view(['GET'])
def recommendIndustries(request):
    """
    Returns list of recommended industries for user.
    """

    email = request.GET.get('email')
    users = User.objects.get(email__iexact=email)
    try:
        serializer = UserSerializer(users, many=False)  # gets user data from token
        data = serializer.data
    except Exception as e:
        print(e)
        return HttpResponse("0")
    
    rec = dict(userIndustryMap(data))
    return JsonResponse(rec, safe=False)

@api_view(['GET'])
def OTPCall(request):
    """
    Returns OTP generated.
    """
    try:
        email = request.GET.get('email')
        users = User.objects.get(email__iexact=email)
    
        OTP=generateOTP()
        users.email_user(OTP)
        resp = OTP
        return Response(resp)
    except:
        return Response("404")

# ------------------------------------------- DATABASE FUNCTIONS ----------------------------------------------------

@api_view(['GET'])
def current_user(request):
    """
    Determine the current user by their token, and return their data
    """
    try:
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    except:
        return HttpResponse("0")


@api_view(['GET', 'POST', 'PUT'])
def User_DB(request):
    """
    Handles User-related functions - searching, getting, creating and updating user data.
    """

    if request.method == 'GET':
        users = User.objects.all()
        deets = ('name', 'email', 'university', 'major')
        kwargs = {key: request.GET.get(key) for key in request.GET if key in deets}
        if len(kwargs):
            users = users.filter(**kwargs)
        
        user_serializer = UserSerializer(users, many=True)
        return JsonResponse(user_serializer.data, safe=False)

    elif request.method == 'POST':
        user_data = JSONParser().parse(request)
        try:
            if not (len(user_data['password']) >= 8):
                raise PasswordException("Password is not long enough")
        except Exception as e:
            return HttpResponse(e)
        user_serializer = UserSerializerWithToken(data=user_data)
        if user_serializer.is_valid():
            print(user_serializer.validated_data)
            user_serializer.save()
            return JsonResponse(user_serializer.data, status=status.HTTP_201_CREATED, safe=False) 
        return JsonResponse(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST, safe=False)

    elif request.method == "PUT":
        user_data = json.loads(request.body)
        if "email" in user_data:
            try:
                user = User.objects.filter(email__iexact = user_data['email'])
                if len(user) == 1:
                    user_data = {k: user_data[k] for k in user_data if k != "email"}
                    user.update(**user_data)
                    return JsonResponse(user.values()[0], safe=False)
            except Exception as e:
                return HttpResponse(e)
        return HttpResponse("Error - no such email")


@api_view(['POST', 'PUT'])
def authDB(request):
    """
    Only for auth stuff, actual user/password creation is in User_DB
    Post request - verify login
    Put request - update password
    """

    if request.method == 'POST':
        user = User.objects.all()
        email = request.data.get('email')
        password = request.data.get('password')
        try :
            user = User.objects.get(email__iexact = email)
            if user.check_password(password):
                return HttpResponse("1")
            else:
                raise PasswordException("Wrong password")
        except Exception as e:
            print(e)
            return HttpResponse("0")
            
    elif request.method == 'PUT':
        email = request.data.get('email')
        # password = request.data.get('password')
        newpassword = request.data.get('newpassword')
        if email is not None and newpassword is not None:
            try:
                user = User.objects.get(email__iexact = email)
                # if not user.check_password(password):
                #     raise PasswordException("Wrong password")
                user.set_password(newpassword)
                user.save()
                return HttpResponse("1")
            except Exception as e:
                print(e)
    return HttpResponse("0")


@api_view(['GET', 'POST', 'PUT'])
def Skill_DB(request):
    if request.method == 'GET':
        scrapeFlag = request.GET.get('scrape')

        # scrape parameter is 1, scrapes all skills
        if scrapeFlag is not None and int(scrapeFlag)==1:
            scrapeRes = json.loads(extract_skills_list())
            for i, res in enumerate(scrapeRes):  # doing this to track progress
                skill_serializer = SkillSerializer(data=res)
                if skill_serializer.is_valid():
                    skill_serializer.save()
                    print("#{}. Details for skill {} saved successfully".format(i+1, res['name']))
                else:
                    print(json.dumps(skill_serializer.errors))

        # regardless of scrape, pull whatever is in the DB and filter
        skills = Skill.objects.all()
        name = request.GET.get('name')
        exact = request.GET.get('exact')  # whether or not to have exact name matching, default=1
        if name is not None:
            if exact is not None and int(exact) == 0:
                skills = skills.filter(name__icontains=name)
            else:
                skills = skills.filter(name__iexact=name)
        
        skill_serializer = SkillSerializer(skills, many=True)
        return JsonResponse(skill_serializer.data, safe=False)
    elif request.method == 'POST':
        skill_data = JSONParser().parse(request)
        skill_serializer = SkillSerializer(data=skill_data, many=True)
        if skill_serializer.is_valid():
            skill_serializer.save()
            return JsonResponse(skill_serializer.data, status=status.HTTP_201_CREATED, safe=False) 
        return JsonResponse(skill_serializer.errors, status=status.HTTP_400_BAD_REQUEST, safe=False)


@api_view(['GET'])
def LinkedIn_Jobs_Cache(request):
    industries = request.GET.get('industries')
    if industries == None:
        return JsonResponse({"Test Unscuccessful": "No parameter detected"})
    industries = industries.split(',')
    industries = [x.strip() for x in industries]
    industries = [x for x in industries if x != '']
    cache = JobQuery.objects.all()
    queryInd = []
    result = []
    for industry in industries:
        q = cache.filter(queryText__iexact=industry)
        if len(q):
            print("Pulled query for",industry,"from cache")
            result.append(dict(q.values()[0]))
        else:
            queryInd.append(industry)
    if len(queryInd):
        scrapeList = scrapeLinkedinJobs(queryInd)
        result.extend(scrapeList)
        job_serializer = JobQuerySerializer(data=scrapeList, many=True)
        if job_serializer.is_valid():
            job_serializer.save()
            print("Successfuly saved queries to cache")
        else:
            print("Error in validating queries")
            print(json.dumps(job_serializer.errors))

    return JsonResponse(result, safe=False)


@api_view(['GET'])
def Course_DB(request):
    limit = request.GET.get('limit')
    query = request.GET.get('query')
    if query is not None:
        query = query.split(';')
    else:
        query = []
        with open("../list_domains.csv", "r") as fileobj:
            text = fileobj.read()
            query.extend([x.lower() for x in text.strip().split('\n')][1:])
        print("Course domains pulled from csv")
    if limit == None:
        limit = 100
        print("Page limit for course pull defaulted to 100")
    else:
        limit = int(limit)
    result = []
    for q in query:
        courseList = get_list_courses(limit, q)
        result.extend(courseList)
        for i, course in enumerate(courseList):
            course_serializer = CourseSerializer(data=course)
            if course_serializer.is_valid():
                course_serializer.save()
                print("Successfuly saved course #", i+1, sep="")
            else:
                print("Error - data for course #", i+1, " already in database", sep="")
        print("All courses for",q,"extracted.\n\n")
    return JsonResponse(result, safe=False)

@api_view(['GET'])
def update_Course_Skills(request):
    courses = Courses.objects.all()
    for i, c in enumerate(courses):
        s = c.skills
        if isinstance(s, dict):
            if not len(s):
                print("Course #{} was blank.".format(i))
                continue
            s = json.loads(find_by_skill_name(s))
            c.skills = s
            try:
                c.save()
                print("Success for course #{}".format(i))
            except:
                print("Failure for course #{}".format(i))
        else:
            print("Course #{} was already upto date.".format(i))
    return HttpResponse("Successfully updated course skills")


@api_view(['POST'])
def recommendCourses(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        jobSkills = data['jobSkills']
        userSkills = data['userSkills']
        jobCopy = [item['name'] for item in jobSkills]
        userCopy = [item['name'] for item in userSkills]
        present = set.intersection(set(jobCopy), set(userCopy))
        m = [item for item in jobCopy if item not in present]
        present = [{"name":item} for item in present]
        missing = [{"name":item} for item in m]
        rec = {}
        r = []
        if len(missing):
            with open('./backend/courseSkills.json', encoding='utf-8') as fileObj:
                courses = json.load(fileObj)
            for course in courses:
                s = json.loads(course['skills'])
                if isinstance(s, dict):
                    continue
                for skill in s:
                    if skill['name'] in m:
                        if course['url'] in rec:
                            rec[course['url']] += 1
                        else:
                            rec[course['url']] = 1
            r = sorted([item for item in rec.keys()], key=lambda x: rec[x], reverse=True)
        res = {"num_matched":len(present), "num_missing":len(missing), "matched":present, "missing":missing}
        res['recommendations'] = r
        return JsonResponse(res, safe=False)

@api_view(['POST'])
def get_course_by_url(request):
    if request.method == 'POST':
        url = request.data.get('url')
        kwargs = {"url":url}
        courses = Courses.objects.get(**kwargs)
        course_serializer = CourseSerializer(courses, many=False)
        return JsonResponse(course_serializer.data, safe=False)
