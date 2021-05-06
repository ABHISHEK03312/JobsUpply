
import React from "react";
import styled from "styled-components";
import { AccountBox } from "../../components/accountBox/AccountIndex";
import { Footer } from "../../components/Footer/FooterIndex";
import { Navbar } from "../../components/Navbar/NavbarBefore";
import {InnerPageContainer,  PageContainer } from "../../components/pageContainer/PageContainerindex";
import TopSectionBackgroundImg from "../../Images/bg-orange.png"
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { useState, useEffect, userRef } from "react";
import AuthService from "../../services/auth.service";
import  { Redirect } from 'react-router-dom'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { JobList } from "../../components/Jobs/JobsIndex";
import { UserDetails } from "../../data";

// import AuthService from "../services/auth.service";

const Loginpagecontainer = styled.div`
    width: 100%;
    height: 700px;
    background: url(${TopSectionBackgroundImg});
    background-size: cover; 
    display: flex;
    align-items: center;
    overflow-x:hidden;
    overflow-y:scroll;
    webkit-scrollbar : none;
`;

const BackgroundFilter = styled.div`
    width: 100%;
    height: 100%;
    background-color: rgba(72, 60, 50, 0);
    display: flex;
    flex-direction: column;
`;

const StyledInnerContainer = styled(InnerPageContainer)`
    margin-top: 1em;
`;
export function Login(props) {
    const [currentUser, setCurrentUser] = useState({token:"temp", user: UserDetails[0]});

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
        else {
            console.log("oops")
        }
        if(currentUser.token!="temp") {
            console.log(currentUser);
        }
    }, []);

    return(
        <PageContainer>
            <Loginpagecontainer>
                <BackgroundFilter>
                    <Navbar />
                    <StyledInnerContainer>
                        <AccountBox />
                    </StyledInnerContainer>
                </BackgroundFilter>
            </Loginpagecontainer>
            <Footer />
        </PageContainer>
    )

}