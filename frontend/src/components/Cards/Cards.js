import React from 'react';
import './Cards.css';
import { CardItem, JobCardItem, CourseCardItem } from './CardItem';
import Linkedin from "../../Images/LinkedinLogo.jpg";
import Coursera from "../../Images/coursera.png";

export function Cards() {
  return (
    <div className='cards'>
      <div className="cards__container">
        <div className="cards__wrapper">
          <ul className='cards__items'>
            <CardItem
              src='Images/bg-masthead.jpg'
              text='Profile-based Job Recommendations'
              label='Job Title 3'
              path='/se'
            />
            <CardItem
              src='Images/profilechecker.jpg'
              text='LinkedIn Profile Checker'
              label='Job Title 4'
              path='/profile-checker'
            />
            <CardItem
              src='Images/courserecom.jpg'
              text='Job-wise Course Recommendations'
              label='Job Title 5 '
              path='/log-out'
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export function JobCards(props) {
  let {linkedinUrl,Jobtitle, Company, Industry, matched, missing} = props;
  return (
    <div className='jobcards'>
      <div className="jobcards__container">
        <div className="jobcards__wrapper">
          <ul className='jobcards__items'>
            <JobCardItem
              src='Images/bg-masthead.jpg'
              linkedinUrl = {linkedinUrl}
              text1= {Jobtitle}
              text2= {Company} 
              text3= {Industry}
              text4='Skills needed:  '
              src2 = {Linkedin}
              matched = {matched}
              missing = {missing}
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export function CourseCards(props) {
  let {url,Title, Institution, Rating, NumRatings} = props;
  return (
    <div className='coursecards'>
      <div className="coursecards__container">
        <div className="coursecards__wrapper">
          <ul className='coursecards__items'>
         <a href = {url} target = "_blank" style={{ textDecoration: 'none' }}>
            <CourseCardItem
              src={Coursera}
              Title={Title}
              Institution={Institution}
              Rating={Rating}
              NumRatings={NumRatings}
            /> 
            </a>
          </ul>
        </div>
      </div>
    </div>
  );
}