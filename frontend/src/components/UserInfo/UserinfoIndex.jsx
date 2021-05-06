import React, {Component} from "react";
import styled from "styled-components";
import {Button, JobHave, JobNo, JobProfileHave} from '../Button/Button';
const OuterContainer = styled.div`
  width: 15%;
  min-width: 180px;
  display: flex;
  flex-direction: column;
  border-radius: 19px;
  box-shadow: 0px 0px 2.7px rgba(15, 15, 15, 0.28);
  position: relative; 
  overflow: hidden;
  margin: 2em;
  margin-left: 10%;
`;

export const ProfileContainer = styled.div`
  width: 95%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(15, 15, 15, 0.45);
  border-radius: 19px;
  border: 1px solid bisque;
`;

export const SkillContainer = styled.div`
  width: 95%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(15, 15, 15, 0.45);
  border-radius: 19px;
  margin-top: 1em;
  border: 1px solid bisque;
`;

export const FormContainer = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 0vh;
`;

export const RowContainer = styled.div`
  width: 100%;
  line-height: 26px;
  clear: both;
  margin-top: 0px;
  display: flex;
  align-items: baseline;
  justify-content: center;
`;

export const RowLeft = styled.div`
  width: 20%;
  text-align: left;
  float: left;
  margin-top: 1vh;
  text-align: left;
`;

export const RowRight = styled.div`
  width: 60%;
  padding-left: 10px;
  text-align: left;
  float: left;
  text-align: end;
`;

export const InnerText = styled.h3`
  font-weight: 500;
  color: #fff;
  z-index: 10;
  margin-top: 0;
  font-size: 14px;
  line-height: 20px;
  vertical-align: middle;
`;

const DPContainer = styled.div`
  margin-top: 0.5em;
  display: flex;
  align-items: center;
  margin-bottom: 0.5em;
  border: 1px solid #fff;
`;

const DPImage = styled.div`
  width: ${({ size }) => (size ? size + "px" : "3em")};
  height: ${({ size }) => (size ? size + "px" : "3em")};
  
  img {
    width: 100%;
    height: 100%;
  }
`;

export const Title = styled.h4`
    margin: 0;
    font-size: ${({ size }) => size ? size + "px" : "20px"};
    color: rgb(255, 255, 255, 0.9);
    line-height: 1.2;
    width: 80%;
    margin-top: 0.5em;
`;

const SkillList = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 90%;
  align-items: center;
  justify-content: center;
  margin-bottom: 1em;
  margin-top: 1em;
  overflow-y: auto;
`;

export function UserInfo(props){
  let {Name, University, Major, Minor, Skillsss} = props;
    return(
        <OuterContainer>
            <ProfileContainer>
              <DPContainer>
                <DPImage>
                  <img src = '../Images/jobsupplyLogo.png' alt = "User DP" style={{borderRadius: 100} }/>
                </DPImage>
              </DPContainer>
              <FormContainer>
                <RowContainer>
                  <RowLeft>
                    <InnerText>Name:</InnerText>
                  </RowLeft>
                  <RowRight>
                    <InnerText>{Name}</InnerText>
                  </RowRight>
                </RowContainer>
                <RowContainer>
                  <RowLeft>
                    <InnerText>University:</InnerText>
                  </RowLeft>
                  <RowRight>
                  <InnerText>{University}</InnerText>
                  </RowRight>
                </RowContainer>
                <RowContainer>
                  <RowLeft>
                    <InnerText>Major:</InnerText>
                  </RowLeft>
                  <RowRight>
                  <InnerText>{Major}</InnerText>
                  </RowRight>
                </RowContainer>
                <RowContainer>
                  <RowLeft>
                    <InnerText>Minor:</InnerText>
                  </RowLeft>
                  <RowRight>
                  <InnerText>{Minor}</InnerText>
                  </RowRight>
                </RowContainer>
              </FormContainer>
            </ProfileContainer>
            <SkillContainer>
              <Title>Your skills</Title>
              <SkillList>
                {console.log(Skillsss)}
                {Skillsss.map((item) =>
                  // <JobHave key = {item.id} item = {item} />
                  <JobProfileHave key = {item.name}>
                    {item.name}
                  </JobProfileHave>
                  )}
              </SkillList>
            </SkillContainer>
        </OuterContainer>


    
    )
}