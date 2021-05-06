import React, {Component, useState, useRef, useContext, useEffect} from "react";
import styled from "styled-components";
import { Marginer } from "../marginer";
import {
  BoxContainer,
  FormContainer,
  Input,
  SubmitButton,
  ConfirmButton,
  SkillButton
} from "./common";
import { Skillpopup } from '../SkillBox/SkillBoxIndex';
import  { Redirect } from 'react-router-dom'
// import AuthService from "../../services/auth.service";

import { Link, useHistory } from "react-router-dom";

import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";

import AuthService from "../../services/auth.service";
import { University, Major, Minor } from '../../data';
import CreatableSelect from 'react-select/creatable';

import { UserDetails } from "../../data";

const InnerText = styled.h5`
  font-weight: 500;
  color: #000;
  z-index: 10;
  margin-top: 0;
  font-size: 14px;
  line-height: 26px;
  vertical-align: middle;
`;

const RowContainer = styled.div`
  width: 100%;
  line-height: 15px;
  clear: both;
  margin-top: 10px;
  display: flex;
  text-align: center;
  justify-content: center;
`;

const RowLeft = styled.div`
  width: 20%;
  text-align: left;
  float: left;
  margin-top: 1vh;
`;

const RowRight = styled.div`
  width: 70%;
  padding-left: 10px;
  text-align: left;
  float: left;
`;

class Popup extends Component {
  render() {
    return (
      <div className='popup'>
        <div className='popup_inner'>
          <h1>{this.props.text}</h1>
        <button onClick={this.props.closePopup}>close me</button>
        </div>
      </div>
    );
  }
}
export class Popups extends Component {
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
}

export const required = (value) => {
  if (!value) {
    console.log("Error: required field")
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
  else {
    return 1;
  }
};


export function ProfileForm(props) {
  const form = useRef();
  const checkBtn = useRef();
  const hist = useHistory();

  const [currentUser, setCurrentUser] = useState({token:"temp", user: UserDetails[0]});
  const [counter, setCounter] = useState(0);

  const [name, setName] = useState(currentUser.user.name);
  const [university, setUniversity] = useState(currentUser.user.university);
  const [major, setMajor] = useState(currentUser.user.major);
  const [minor, setMinor] = useState(currentUser.user.minor);
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [formIsValid, setFormIsValid] = useState(false);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user.user.name != "Loading...") {
            setCurrentUser(user);
            console.log("Success")
            console.log(user.user)
            setName(user.user.name)
            setUniversity(user.user.university)
            setMajor(user.user.major)
            setMinor(user.user.minor)
        }
        else {
            console.log("Failure")
            console.log(user);
            setCounter(counter+1);
            console.log(counter);
        }
    }, []);

  const onChangeName = (e) => {
    const Name = e.target.value;
    if (required(Name) === 1){
      setName(Name);
      setFormIsValid(true);
      setMessage("")
    }
    else {
      setName(currentUser.user.name)
    }
  };

  const onChangeUni = (e) => {
    const Name = e.value;
    if (required(Name) === 1){
      setUniversity(Name);
      setFormIsValid(true);
      setMessage("")
    }
    else {
      setUniversity(currentUser.user.university)
    }
  };

  const onChangeMajor = (e) => {
    const Name = e.value;
    if (required(Name) === 1){
      setMajor(Name);
      setFormIsValid(true);
      setMessage("")
    }
    else {
      setMajor(currentUser.user.major)
    }
  };

  const onChangeMinor = (e) => {
    const Name = e.value;
    if (required(Name) === 1){
      setMinor(Name);
      setFormIsValid(true);
      setMessage("")
    }
    else {
      setMinor(currentUser.user.minor)
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    setMessage("");
    setSuccessful(false);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0 && formIsValid === true) {
      AuthService.update({"email":currentUser.user.email, "name": name, "university":university, "major":major, "minor":minor})
      .then(
        (response) => {
          setSuccessful(true);
          console.log({"email":currentUser.user.email, "name": name, "university":university, "major":major, "minor":minor});
          hist.push("/jobs");
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setMessage(resMessage);
          console.log(resMessage);
          setSuccessful(false);
        }
      );
    }
    else {
      setSuccessful(false);
    }
  };

  return (
    <BoxContainer>
      <Form onSubmit={handleUpdate} ref={form}>
      <FormContainer>
        <RowContainer>
          <RowLeft>
            <InnerText>Name*</InnerText>
          </RowLeft>
          <RowRight>
            <Input placeholder="Full Name" 
                  name="name"
                  value={name}
                  onChange={onChangeName}
                  validations={[required]}/>
          </RowRight>
        </RowContainer>
        <RowContainer>
          <RowLeft>
            <InnerText>University*</InnerText>
          </RowLeft>
          <RowRight>
            <CreatableSelect
              onChange={onChangeUni}
              options={University}
            />
          </RowRight>
        </RowContainer>
        <RowContainer>
          <RowLeft>
            <InnerText>Major*</InnerText>
          </RowLeft>
          <RowRight>
          <CreatableSelect
              onChange={onChangeMajor}
              options={Major}
            />
          </RowRight>
        </RowContainer>
        <RowContainer>
          <RowLeft>
            <InnerText>Minor*</InnerText>
          </RowLeft>
          <RowRight>
            <CreatableSelect
              onChange={onChangeMinor}
              options={Minor}
            />
          </RowRight>
        </RowContainer>
      </FormContainer>
      <RowContainer>
        <font size="2">Note: Editing skills will save any changes above first.</font>
      </RowContainer>
      <RowContainer>
        <Skillpopup email={currentUser.user.email} />
      </RowContainer>
      <RowContainer>
        <CheckButton ref={checkBtn}>
          <ConfirmButton>Confirm</ConfirmButton>
        </CheckButton>
      </RowContainer>
      <Marginer direction="vertical" margin={20} />
      </Form>
    </BoxContainer>
  );
}
