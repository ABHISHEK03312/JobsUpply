import React from "react";
import styled from "styled-components";

const PageWrapper = styled.div`
  width: 100%;
  padding: 0!important;
  margin: 0!important;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: none;
  background: #000;
`;

export function PageContainer(props) {
  return <PageWrapper>{props.children}</PageWrapper>;
}

export const InnerPageContainer = styled.div`
  flex: 1;
  width: 100%;
  max-width: ${({ maxWidth }) => (maxWidth ? maxWidth : "auto")};
  display: flex;
  flex-direction: column;
  align-items: center;

`;
