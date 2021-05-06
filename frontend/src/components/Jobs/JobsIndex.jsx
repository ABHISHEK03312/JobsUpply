import React from 'react';
import { useState, useEffect } from "react";
import styled from "styled-components";
import Select from 'react-select'
import { JobCards} from "../Cards/Cards"
import { Link } from 'react-router-dom';
import './new.css';
import AuthService from "../../services/auth.service";
import APIService from "../../services/JobData"


const OuterContainer = styled.div`
  width: 58%;
  min-height: 550px;
  display: flex;
  flex-direction: column;
  border-radius: 19px;
  box-shadow: 0px 0px 2.7px rgba(15, 15, 15, 0.28);
  position: relative; 
  overflow: hidden;
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

const RowHalf = styled.div`
  display: flex;
  justify-content: center;
  width: 50%;
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

const Industryoptions = [
  { value: 'Select Industry', label: 'Select Industry'},
  { value: 'All Industries', label: 'All Industries'},
  { value: 'Industry 1', label: 'Industry 1'},
  { value: 'Industry 2', label: 'Industry 2' },
  { value: 'Industry 3', label: 'Industry 3' }
]

const Sortbyoptions = [
  { value: 'Sort by', label: 'Sort By'},
  { value: 'Industry (Default)', label: 'Industry (Default)' },
  { value: 'Most Skills Matched', label: 'Most Skills Matched' },
  { value: 'Least Skills Matched', label: 'Least Skills Matched' },
]

const SearchBar = ({keyword,setKeyword}) => {
  const BarStyling = {width:"20rem",height:"22px", background:"#F2F1F9", border:"none", padding:"0.5rem", borderRadius: "3px"};
  return (
    <input 
     style={BarStyling}
     key="random1"
     value={keyword}
     placeholder={"Search"}
    //  onChange={(e) => setKeyword(e.target.value)}
    />
  );
}

export function JobList(props){
  // const [currentUser, setCurrentUser] = useState(undefined);
  const [industries, setIndustries] = useState([]);
  const [jobListExtracted, setJobListExtracted] = useState([]);
  const [waitText, setWaitText] = useState("Please wait while we find the best jobs for you... (May take a few seconds)");
  const [jobListDisplay, setJobListDisplay] = useState([]);

  useEffect( async () => {
    console.log("useEffect called");
    if (jobListExtracted.length==0) {
      console.log("inside if statement");
      let currentUser = AuthService.getCurrentUser();
      let recJobs = await APIService.jobQuery();
      console.log(recJobs);
      if (recJobs.length > 0){
        console.log("Success");
        let indust=[];
        let jobListExt=[];
        for(let i=0; i<recJobs.length; i++){
          indust[i]=recJobs[i].queryText;
          let jobs=recJobs[i].jobList;
          for(let j=0; j<jobs.length; j++){
            let temp = jobs[j];
            temp['industry'] = indust[i];
            let response = await APIService.courseRecommendation(currentUser.user.skills, temp.skills);
            temp['matched'] = response.matched;
            temp['missing'] = response.missing;
            temp['num_matched'] = response.num_matched;
            temp['num_missing'] = response.num_missing;
            temp['recommendations'] = response.recommendations;
            jobListExt.push(temp);
          };
        };
        setIndustries(indust);
        setJobListExtracted(jobListExt);
        setJobListDisplay(jobListExt);
        setWaitText("Click on a job to know more!")
      }
    }

  }, [jobListDisplay]);

  const industryDropdown = () => {
    let res = [Industryoptions[1]];
    for(let i=0; i<industries.length; i++){
      res.push({"value":industries[i], "label":industries[i]});
    }
    return res;
  }

  function compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const A = a.num_matched;
    const B = b.num_matched;
  
    let comparison = 0;
    if (A > B) {
      comparison = 1;
    } else if (A < B) {
      comparison = -1;
    }
    return comparison;
  }

  const handleSort = (e) => {
    const opt = e.value;
    console.log(opt);
    let temp;
    switch(opt){
      case "Industry (Default)":
        console.log("default sort");
        setJobListDisplay([]);
        setJobListDisplay(jobListExtracted);
        break;
      case "Most Skills Matched":
        console.log("most matched sort");
        temp = jobListDisplay.slice().sort(compare);
        temp.reverse();
        setJobListDisplay(temp);
        break;
      case "Least Skills Matched":
        console.log("least matched sort");
        temp = jobListDisplay.slice().sort(compare);
        setJobListDisplay(temp);
        break;
      default:
        console.log("Whoops");
    }
    console.log("extracted:");
    console.log(jobListExtracted);
    console.log("display:");
    console.log(jobListDisplay);
  };

  const handleFilter = (e) => {
    const opt = e.value;
    console.log(opt);
    if (opt==="All Industries") {
      setJobListDisplay(jobListExtracted);
    }
    else {
      let temp = jobListExtracted.slice();
      temp = temp.filter(function(job) {
        return job.industry === opt;
      });
      setJobListDisplay(temp);
    }
    console.log("extracted:");
    console.log(jobListExtracted);
    console.log("display:");
    console.log(jobListDisplay);
  };
  
  return(
      <OuterContainer>
          <RowContainer>
            {/* <RowOneThird> */}
            <RowHalf>
            <div className= 'my-className-prefix'>
              <Select options={industryDropdown()} 
                      defaultValue={Industryoptions[1]} 
                      isSearchable={false}
                      onChange={handleFilter} />
            </div>
            </RowHalf>
            {/* </RowOneThird> */}
            {/* <RowOneThird> */}
            <RowHalf>
            <div className= 'my-className-prefix'>
              <Select options={Sortbyoptions.slice(1)} 
                      defaultValue = {Sortbyoptions[1]} 
                      isSearchable={false} 
                      onChange={handleSort}
                      classNamePrefix='my-className-prefix'/>
            </div>
            </RowHalf>
            {/* </RowOneThird> */}
            {/* <RowOneThird><SearchBar/></RowOneThird> */}
          </RowContainer>
          <h3><font color="white">{waitText}</font></h3>
          <JobContainer>
            {/* {console.log("from inside:")}
            {console.log(recJobs)}
            {console.log(counter)}
            {console.log(response)} */}
            {console.log(industries)}
            {console.log("Extracted:")}
            {console.log(jobListExtracted)}
            {console.log("Display:")}
            {console.log(jobListDisplay)}
          {jobListDisplay.map((data) =>
              <Link className="jobcards__item__link" to={{
                pathname: '/jobdetails',
                state: data
              }}>
                <JobCards key = {data.linkedinUrl}
                linkedinUrl = {data.linkedinUrl}
                Jobtitle = {data.title}
                Company = {data.company}
                Industry = {data.industry}
                matched = {data.matched}
                missing = {data.missing}
                />
              </Link>
            )}
          </JobContainer>
      </OuterContainer>
  )
}