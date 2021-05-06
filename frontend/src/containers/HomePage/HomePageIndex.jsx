import React, { useState, useEffect } from "react";
import styled from "styled-components";
import TopSectionBackgroundImg from '../../earth.png';
// import TopSectionBackgroundVideo from "../../video.mp4"
import { Marginer} from "../../components/marginer";
import { Link } from "react-router-dom";
import { InnerPageContainer, PageContainer } from "../../components/pageContainer/PageContainerindex";
import { Navbar } from "../../components/Navbar/NavbarBefore";
import { Button } from '../../components/Button/Button';
import { Cards } from '../../components/Cards/Cards';
import { Footer } from '../../components/Footer/FooterIndex';

export const ContentContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
    background: #000;
`;

export const Sectionhead = styled.h1`
    font-weight: 700;
    color: #fff;
    margin-top: 50px;
`;
// background: url(${TopSectionBackgroundImg});
export const TopSectionContainer = styled.div`
    width: 100%;
    height: 683px;
    background: url(${TopSectionBackgroundImg});
    background-size: cover; 
    display: flex;
    align-items: center;
`;

export const BackgroundFilter = styled.div`
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
`;

export const TopSectionInnerContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;
`;

export const HeadlineContainer = styled.div`
    display: flex;
    align-items:center;
    flex-direction: column;
`;

export const Title = styled.h1`
    margin: 0;
    font-size: ${({ size }) => size ? size + "px" : "60px"};
    color: rgb(255, 255, 255, 0.9);
    line-height: 1.2;
    width: 80%;
`;

export const SloganText = styled.h2`
    margin: 0;
    line-height: 1.4;
    color: rgb(255, 255, 255, 0.8);
    font-weight: 1000;
    font-size: 25px;
    width: 70%
    text-align: center;
`;

export const Line = styled.hr`
  margin: 30px;
  width: 10%;
  border-width: 0.1em;
  border-color: rgb(244,98,58);
`;

export function HomePage(props){
    const { children, textSize } = props;
    return (<PageContainer>
            <TopSectionContainer>
                {/* <video>
                <source src = {TopSectionBackgroundImg} type = "video/mp4"/>
                </video> */}
                <BackgroundFilter>
                    <Navbar />
                    {children}
                    <TopSectionInnerContainer>
                        <HeadlineContainer>
                            <Title size = {textSize}>YOUR FIRST STEP INTO THE WORKING WORLD</Title>
                            <Line />
                            <SloganText>Sign in to see the best job only for you!</SloganText>
                            <Marginer direction = "vertical" margin = {30} />
                            <Link style={{ textDecoration: 'none', color: 'white' }} to = "/login">
                                <Button buttonStyle='btn-orange'>Get Started!</Button>
                            </Link>
                        </HeadlineContainer>
                    </TopSectionInnerContainer>
                </BackgroundFilter>
            </TopSectionContainer>
            <InnerPageContainer>
                <ContentContainer>
                    <Sectionhead>What we have here</Sectionhead>
                    <Cards />
                </ContentContainer>
            </InnerPageContainer>
        <Footer />
    </PageContainer>)
}