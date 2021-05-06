# Backend

### To run locally:
 - pip install all requirements with "pip install -r requirements.txt"
 - If the above fails, install the packages in order (ignore unsupported version warning for Djongo/Django, Djongo's dependencies haven't been updated but it functions fine)
 - Open a terminal in the "src" folder
 - run "python manage.py runserver"
 - The backend server is now running on localhost:8000. Check out our frontend repo to view the website, or ping our API endpoints with Postman to test it out!

All API endpoints can be found in the urls.py files in django_base and backend, with the latter having "backend/" as a prefix for all urls.
