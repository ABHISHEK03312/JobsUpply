import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {ProfileForm} from "./ProfileForm";
import { Marginer } from "../marginer";
import { Link } from "react-router-dom";
import BackImg from "../../Images/Backorange.png";

const BoxContainer = styled.div`
  width: 500px;
  min-height: 450px;
  max-height: 600px;
  display: flex;
  flex-direction: column;
  border-radius: 19px;
  background-color: #fff;
  box-shadow: 0px 0px 2.7px rgba(15, 15, 15, 0.28);
  position: relative; 
  overflow-x: hidden;
  overflow-y: auto;
  webkit-scrollbar : none;
`;

const TopContainer = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 0 1.8em;
  padding-bottom: 0em;

`;

const BackDrop = styled(motion.div)`
  position: absolute;
  width: 190%;
  height: 550px;
  border-radius: 50%;
  transform: rotate(160deg);
  top: -400px;
  left: -260px;
  background: rgb(244,98,58); /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #FDC830,
    rgb(244,98,58)
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #FDC830,
    rgb(244,98,58)
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: -15px;
  margin-top: 2em;
`;

const HeaderText = styled.h2`
  font-weight: 600;
  color: #fff;
  z-index: 10;
  margin-bottom: 0;
  font-size: 30px;
  line-height: 1.24;
  margin-top:0.5em;
`;

const SmallText = styled.h5`
  font-weight: 500;
  color: #fff;
  z-index: 10;
  margin-bottom: 10;
  font-size: 13px;
  line-height: 1.24;
`;

const InnerContainer = styled.div`
  width: 100%;
  display: inline-block;
  flex-direction: row;
  align-items: flex-start;
`;

const BackImage = styled.div`
  width: 2em;
  height: 1.3em;
  position: absolute;

  img {
    width: 100%;
    height: 100%;
  }
`;


export function ProfileBox(props) {
  return (
    <BoxContainer>
      <TopContainer>
        <BackDrop/>
          <HeaderContainer>
          <Link style={{ textDecoration: 'none', color: 'white' }} to = "/jobs">
            <BackImage>
              <img src={BackImg} alt="Back" />
            </BackImage>
          </Link>
            <Marginer direction="vertical" margin="2em" />
            <HeaderText>Edit Profile</HeaderText>
          </HeaderContainer>
          <SmallText>Let us know more about you!</SmallText>
      </TopContainer>
      <InnerContainer>
        <ProfileForm />
      </InnerContainer>
    </BoxContainer>
  );
}
