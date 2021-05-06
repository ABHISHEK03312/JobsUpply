import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ProfileBox } from "../../components/profileBox/ProfileBoxIndex";
import { Footer } from "../../components/Footer/FooterIndex";
import { Navbar } from "../../components/Navbar/Navbar";
import {InnerPageContainer,  PageContainer } from "../../components/pageContainer/PageContainerindex";
import AuthService from "../../services/auth.service";
import {Login} from "../../containers/Login/LoginIndex";
import TopSectionBackgroundImg from "../../Images/bg-orange.png";
import  { Redirect } from 'react-router-dom';
import { UserDetails } from "../../data";

const ProfilepageContainer = styled.div`
    width: 100%;
    height: 683px;
    background: url(${TopSectionBackgroundImg});
    background-size: cover; 
    display: flex;
    align-items: center;
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


export function ProfileEdit(props) {
    return(
        <PageContainer>
            <ProfilepageContainer>
                <BackgroundFilter>
                    <Navbar />
                    <StyledInnerContainer>
                        <ProfileBox />
                    </StyledInnerContainer>
                </BackgroundFilter>
            </ProfilepageContainer>
            <Footer />
        </PageContainer>
    )

}