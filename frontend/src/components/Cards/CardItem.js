import React from 'react';
import {Button, JobHave, JobNo} from '../Button/Button';

export function CardItem(props) {
  return (
    <>
      <li className="cards__item">
        <div className="cards__item__link">
          <figure className='cards__item__pic-wrap' data-category={props.label}>
            <img src={props.src} alt='Cardimage'
              className='cards__item__img' />
          </figure>
          <div className="cards__item__info">
            <h5 className="cards__item__text">{props.text}</h5>
          </div>
        </div>
      </li>
    </>
  );
}

export function JobCardItem(props) {
  let {linkedinUrl,text1, text2, text3, text4, matched, missing} = props;
  if (matched.length == 0 && missing.length == 0){
    missing = [{"name":"Unable to extract: view job details"}]
  }
  return (
    <>
      <li className="jobcards__item">
        <div className="jobcards__item__link">
          <figure className='jobcards__item__pic-wrap'>
            <img src={props.src} alt='nopic'
              className='jobcards__item__img' />
          </figure>
          <div className="jobcards__item__info">
            <h5 className="jobcards__item__text">{text1}</h5>
            <h5 className="jobcards__item__text">{text2}</h5>
            <h5 className="jobcards__item__text">{text3}</h5>
          </div>
          <a  href = {linkedinUrl}  target = "_blank">
          <figure className='jobcards__item__logo-wrap'>
            <img src={props.src2} alt='nopic'
              className='jobcards__item__img' />
          </figure>
          </a>
        </div>
        <div className="jobcards__item__info2">
        <h5 className="jobcards__item__text">{text4}</h5>
        {matched.map((item) =>
          <JobHave key = {item.name}>
            {item.name}
          </JobHave>
        )}
        {missing.map((item) =>
          <JobNo key = {item.name}>
            {item.name}
          </JobNo>
          )}
        </div>
      </li>
    </>
  );
}

export function CourseCardItem(props) {
  let {Title, Institution, Rating, NumRatings} = props;
  return (
    <>
      <li className="coursecards__item">
        <div className="coursecards__item__link">
          <figure className='coursecards__item__pic-wrap'>
            <img src={props.src} alt='coursera logo'
              className='coursecards__item__img' />
          </figure>
          <div className="coursecards__item__info">
            <h5 className="coursecards__item__text">{Title}</h5>
          </div>
        </div>
        <div className="coursecards__item__info2">
          <h5 className="coursecards__item__text">{Institution}</h5>
          <h5 className="coursecards__item__text">{Rating}</h5>
          <h5 className="coursecards__item__text">{NumRatings}</h5>
        </div>
      </li>
    </>
  );
}

