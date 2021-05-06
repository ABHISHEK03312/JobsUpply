import React from "react";
import styled from "styled-components";
// import { BrandLogo } from "../brandLogo";
// import { deviceSize } from "../responsive";

const BottomContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70px;
  border-top: 0.6px solid rgb(0, 0, 0, 0.3);
  padding: 0 10px;

  @media screen and (max-width: 100%) {
    padding: 0;
  }
`;

const PrivacyText = styled.h6`
  color: #a3a3a3;
  font-size: 11px;
  margin: 0;
  margin-left: 10px;
  display: flex;
  margin-top: 5px;
  align-items: center;

  @media screen and (max-width: 100%) {
    font-size: 8px;
  }
`;

export function Footer(props) {

  return (
    <BottomContainer>
        {/* <BrandLogo hideLogo color="#8A8A8A" textSize={25} /> */}
        <PrivacyText> &#169; All Rights Reserved. 2021</PrivacyText>
    </BottomContainer>
  );
}