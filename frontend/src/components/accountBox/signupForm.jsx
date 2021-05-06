import { useContext } from "react";
import { Marginer } from "../marginer";
import {
  BoldLink,
  BoxContainer,
  FormContainer,
  Input,
  MutedLink,
  SubmitButton,
} from "./common";
import { AccountContext } from "./context";
import { useHistory } from "react-router-dom";

import React, { useState, useRef } from "react";
import Form from "react-validation/build/form";
// import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";

import AuthService from "../../services/auth.service";

export const required = (value) => {
  if (!value) {
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

const validEmail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
  else {
    return 1;
  }
};

const isLegalPassword = (pass) => {
  let sp=0, up=0, lo=0;
  let special = "!@#$%^&*()-_=+~{}[];:,<.>/?\'\"\\|`1234567890";
  for(let i=0; i<pass.length; i++) {
    let ch = pass[i];
    if (special.includes(ch)) sp+=1;
    else if (ch == ch.toUpperCase()) up+=1;
    else if (ch == ch.toLowerCase()) lo+=1;
  }
  if (sp>0 && up>0 && lo>0) return true;
  return false;
}

const vpassword = (value) => {
  if (value.length < 8 || value.length > 40 || !isLegalPassword(value)) {
    return 0;
  }
  else {
    return 1;
  }
};

export const SignupForm = (props) => {
  const form = useRef();
  const checkBtn = useRef();
  const hist = useHistory();

  // const [username, setUsername] = useState("");
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [formIsValid, setFormIsValid] = useState(false);

  const onChangeEmail = (e) => {
    const Email = e.target.value;
    setEmail(Email);
    if (required(Email) === 1 && validEmail(Email) === 1){
      setFormIsValid(true);
      setMessage("")
    }
    else {
      setFormIsValid(false)
      setMessage("Invalid email!")
    }
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
    if (required(password) === 1 && vpassword(password) === 1){
      setFormIsValid(true);
      setMessage("")
    }
    else {
      setFormIsValid(false)
      setMessage("Invalid password! (must be between 8 and 40 characters, and have at least one uppercase, lowercase, and special character.)")
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();

    setMessage("");
    setSuccessful(false);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0 && formIsValid === true) {
      AuthService.register(Email, password).then(
        (response) => {
          setSuccessful(true);
          hist.push("/Settings");
          window.location.reload();
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setMessage(resMessage);
          setSuccessful(false);
        }
      );
    }
    else {
      setSuccessful(false);
    }
  };

// export function SignupForm(props) {
  const { switchToSignin } = useContext(AccountContext);

  return (
    <BoxContainer>
      <Form onSubmit={handleRegister} ref={form}>
      {!successful && (
            <div>
              <div className="form-group">
                <Input
                  placeholder="Email"
                  type="text"
                  className="form-control"
                  name="email"
                  value={Email}
                  onChange={onChangeEmail}
                  validations={[required, validEmail]}
                />
              </div>

              <div className="form-group">
                <Input
                  placeholder="Password"
                  type="password"
                  className="form-control"
                  name="password"
                  value={password}
                  onChange={onChangePassword}
                  validations={[required, vpassword]}
                />
              </div>

              {/* <div className="form-group">
                <button className="btn btn-primary btn-block">Sign Up</button>
              </div> */}
            </div>
          )}

          {message && (
            <div className="form-group">
              <div
                className={ successful ? "alert alert-success" : "alert alert-danger" }
                role="alert"
              >
              <font size="1">{message}</font>
              </div>
            </div>
          )}
      <Marginer direction="vertical" margin="2em" />
      <CheckButton ref={checkBtn}>
        <SubmitButton SubmitButton>Sign Up</SubmitButton>
      </CheckButton>
      <Marginer direction="vertical" margin={5} />
      <MutedLink href="#">
        Already have an account?
        <BoldLink href="#" onClick={switchToSignin}>
          Sign in
        </BoldLink>
      </MutedLink>
      </Form>
    </BoxContainer>
  );
}
