import React, {Component} from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Marginer } from "../marginer";
import { Link } from "react-router-dom";
import AuthService from "../../services/auth.service.js";
import { BoldLink, Input, MutedLink } from "./common";

const OuterContainer = styled.div`
  width: 250px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  border-radius: 19px;
  background-color: #fff;
  box-shadow: 0px 0px 2.7px rgba(15, 15, 15, 0.28);
  border: 1px solid rgb(244,98,58);
  position: relative; 
  overflow-x: hidden;
  overflow-y: visible;
`;

const TopContainer = styled.div`
  width: 90%;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0 1.2em;
`;

const BackDrop = styled(motion.div)`
  position: absolute;
  width: 250%;
  height: 450px;
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


export const BoxContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
`;

export const FormContainer = styled.form`
  width: 90%;
  display: flex;
  flex-direction: column;
`;

export const SubmitButton = styled.button`
padding: 11px 0%;
width: 12em;
flex: center;
color: #fff;
font-size: 15px;
font-weight: 600;
border: none;
border-radius: 100px 100px 100px 100px;
cursor: pointer;
transition: all, 240ms ease-in-out;

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

&:focus {
  outline: none;
}

&:hover {
  filter: brightness(1.03);
}
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: -15px;
`;

const HeaderText = styled.h2`
  font-weight: 600;
  color: #000;
  z-index: 10;
  margin-bottom: 0;
  font-size: 30px;
  line-height: 1.24;
`;

const SmallText = styled.h5`
  font-weight: 500;
  color: #000;
  z-index: 10;
  margin-bottom: 10;
  font-size: 13px;
  line-height: 1.24;
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

const RowContainer = styled.div`
  width: 100%;
  line-height: 26px;
  clear: both;
  display: flex;
  justify-content: space-evenly;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
`;

class PasswordBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      newPass: "",
      inpOTP: "",
      realOTP: undefined
    }
    this.emailForm = React.createRef();
    this.newPassForm = React.createRef();
    this.OTPForm = React.createRef();
  }

  handleSend = async () => {
    console.log(this.state.email)
    let otp = await AuthService.getOTP(this.state.email);
    console.log(otp);
    if (otp != "404") {
        this.setState({ realOTP: otp });
    }
    else {
      console.log("Bad request - no such email found");
    }
    console.log(this.state.realOTP);
    return;
  }

  handleSubmission = async () => {
    console.log(this.state.email);
    console.log(this.state.inpOTP);
    console.log(this.state.realOTP);
    if (this.state.inpOTP == this.state.realOTP) {
      let res = await AuthService.updatePassword(this.state.email, this.state.newPass);
      if (res == 1) {
        this.props.closePopup();
      }
    }
    else {
      console.log("Incorrect OTP")
    }
    return;
  }

  onChangeEmail = (e) => {
    const Email = e.target.value;
    this.setState({ email: Email });
  };

  onChangePassword = (e) => {
    const password = e.target.value;
    this.setState({ newPass: password });
  };

  onChangeOTP = (e) => {
    const otp = e.target.value;
    this.setState({ inpOTP: otp });
    console.log(this.state.realOTP);
  };

  render() {
    var left = 5000 + 'px';
    var top = 5000 + 'px';
    var padding = 5000 + 'px';
    return (
    <OuterContainer>
        <TopContainer>
            <HeaderContainer>
                <HeaderText>Reset Password</HeaderText>
            </HeaderContainer>
            <SmallText>Click "Send OTP" after entering your email below, then enter your new password and OTP before clicking submit.</SmallText>
        </TopContainer>
        <BoxContainer>
            <FormContainer>
            <Input
              placeholder="Email"
              type="text"
              className="form-control"
              onChange={this.onChangeEmail}
              ref={this.emailForm}
            />
            </FormContainer>
            <FormContainer>
            <Input
              placeholder="New password"
              type="password"
              className="form-control"
              onChange={this.onChangePassword}
              ref={this.newPassForm}
            />
            </FormContainer>
            <FormContainer>
            <Input
              placeholder="OTP"
              type="text"
              className="form-control"
              onChange={this.onChangeOTP}
              ref={this.OTPForm}
            />
            </FormContainer>
          </BoxContainer>
         <RowContainer>
            <ForgotButton onClick={this.handleSend}>Send OTP</ForgotButton>
            <Marginer direction="horizontal" margin="0.5em" />
            <ForgotButton onClick={this.handleSubmission}>Confirm</ForgotButton>
         </RowContainer>
      </OuterContainer>
  );
}
}

export const ForgotButton = styled.button`
  padding: 10px 10%;
  width: 12em;
  color: #000;
  font-size: 13px;
  font-weight: 600;
  border: #434343;
  border-radius: 100px 100px 100px 100px;
  cursor: pointer;
  transition: all, 240ms ease-in-out;

  &:focus {
    outline: none;
  }

  &:hover {
    filter: brightness(1.03);
  }
`;

export class PasswordPopup extends Component {
  constructor() {
    super();
    this.state = {
      showPopup: false
    };
  }
  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }
  offset = {right:0,left:10}
  render() {
    return (
      <div>
        <BoldLink onClick={this.togglePopup.bind(this)}>Forgot Password?</BoldLink>
        <Marginer direction="vertical" margin="1em" />
        {this.state.showPopup ? 
          <PasswordBox
            closePopup={this.togglePopup.bind(this)}
          />
          : null
        }
      </div>
    );
  }
};
