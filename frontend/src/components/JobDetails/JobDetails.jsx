import React from "react";
import styled from "styled-components";
import { CourseCards, JobCards } from "../Cards/Cards"

const OuterContainer = styled.div`
  width: 58%;
  min-height: 550px;
  display: flex;
  flex-direction: column;
  border-radius: 19px;
  box-shadow: 0px 0px 2.7px rgba(15, 15, 15, 0.28);
  position: relative; 
  overflow: hidden;
  background: rgb(0,0,0,0.5);
  margin: 2em;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content:space-evenly;
  width: 100%;
  min-height: 50px;
  clear: both;

`;

const RowOneThird = styled.div`
  display: flex;
  justify-content: center;
  width: 33%;
  min-width:80px;
  min-height:50px;
`;

export const JobContainer = styled.div`
  width: 100%;
  min-height: 490px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 19px;
  margin-top: 0em;
`;

export const CourseContainer = styled.div`
  width: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 0.2em;
  justify-content: center;
`

export function JobDetail(props){
  let { jobData, courseData } = props;
  console.log(jobData.recommendations);

  const courseText = () => {
    if (courseData.length == 0) {
      console.log("No courses.");
      return <font color="white" size="3">Sorry, no courses were found for missing skills (if any).</font>
    }
  }

  return(
        <OuterContainer>
            <JobContainer>
                <CourseContainer>
                <a href = {jobData.linkedinUrl} target = "_blank" style={{ width: "100%", textDecoration: 'none' }}>
                  <JobCards
                  Jobtitle = {jobData.title}
                  Company = {jobData.company}
                  Industry = {jobData.industry}
                  matched = {jobData.matched}
                  missing = {jobData.missing}
                  />
                  </a>
                  {courseText()}
                  {courseData.map((data) =>
                    <CourseCards key = {data.url}
                    url = {data.url}
                    Title = {data.course}
                    Institution = {data.university}
                    Rating = {data.rating} 
                    NumRatings = {data.numratings}/>
                )}
                </CourseContainer>
            </JobContainer>
        </OuterContainer>
    )
}