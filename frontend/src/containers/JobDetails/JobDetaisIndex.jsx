import React from 'react';
import { useState, useEffect } from "react";
import styled from "styled-components";
import TopSectionBackgroundImg from "../../Images/bg-orange.png";
import { Marginer} from "../../components/marginer";
import { Link } from "react-router-dom";
import { InnerPageContainer, PageContainer } from "../../components/pageContainer/PageContainerindex";
import { Navbar } from '../../components/Navbar/Navbar'
import { Footer } from '../../components/Footer/FooterIndex'
import { UserInfo } from '../../components/UserInfo/UserinfoIndex'
import { JobDetail } from'../../components/JobDetails/JobDetails'
import { UserDetails } from "../../data";
import AuthService from "../../services/auth.service";
import {Login} from "../../containers/Login/LoginIndex";
import Redirect from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import APIService from "../../services/JobData";


export const TopSectionContainer = styled.div`
    width: 100%;
    height: 683px
    ;
    background: url(${TopSectionBackgroundImg});
    background-size: cover; 
    display: flex;
    align-items: center;
`;

export const BackgroundFilter = styled.div`
    width: 100%;
    height: 100%;
    background-color: rgba(72, 60, 50, 0);
    display: flex;
    flex-direction: column;
`;


export const ContentContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0;
    overflow: auto;
`;

export const Title = styled.h1`
    margin: 0;
    font-size: ${({ size }) => size ? size + "px" : "60px"};
    color: rgb(255, 255, 255, 0.9);
    line-height: 1.2;
    width: 80%;
`;

export function JobDetails(props){
    let singleData = props.location.state;
    console.log(singleData);
    const [currentUser, setCurrentUser] = useState({token:"temp", user: UserDetails[0]});
    const [courseData, setCourseData] = useState([]);

    useEffect( async () => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
        else {
            console.log("oops")
        }
        let courses = [];
        for(let i=0; i<singleData.recommendations.length; i++){
            courses[i] = await APIService.courseQuery(singleData.recommendations[i]);
            console.log(courses[i]);
        }
        setCourseData(courses);
    }, []);

    return (
    <PageContainer>
        <TopSectionContainer>
            <BackgroundFilter>
                <Navbar />
                <ContentContainer>
                {[currentUser.user, ].map((data) => {
                    let m;
                    if (data.minor.constructor == Object || data.minor == "" || data.minor == "{}"){
                        m = "None";
                    }
                    else {
                        m = data.minor;
                        console.log(m);
                    }
                    return(
                        <UserInfo key = {data.email}
                        Name = {data.name}
                        University = {data.university}
                        Major = {data.major}
                        Minor = {m}
                        Skillsss = {data.skills}
                    />)}
                )}
                    <JobDetail jobData={singleData} courseData={courseData} />
                </ContentContainer>
            </BackgroundFilter>
        </TopSectionContainer>
        <Footer />
    </PageContainer>)
}