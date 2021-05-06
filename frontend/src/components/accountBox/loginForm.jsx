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
import { Link, useHistory } from "react-router-dom";
import { PasswordPopup } from "./ForgotPasswordBox";

import React, { useState, useRef } from "react";
import Form from "react-validation/build/form";
// import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import AuthService from "../../services/auth.service";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        <font size="1">This field is required!</font>
      </div>
    );
  }
};

export const LoginForm = (props) => {
  const form = useRef();
  const checkBtn = useRef();

  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [emMessage, setMessageEm] = useState("");
  const [passMessage, setMessagePass] = useState("");

  const onChangeEmail = (e) => {
    const Email= e.target.value;
    setEmail(Email);
    setMessageEm(required(Email))
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
    setMessagePass(required(password))
  };

  const hist = useHistory();

  const handleLogin = (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.login(Email, password).then(
        () => {
          hist.push('/jobs');
          window.location.reload();
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setLoading(false);
          setMessage(resMessage);
        }
      );
    } else {
      setLoading(false);
    }
  };
// export function LoginForm(props) {
  const { switchToSignup } = useContext(AccountContext);

  return (
    <BoxContainer>
      <Form onSubmit={handleLogin} ref={form}> 
      {/* <FormContainer onSubmit={handleLogin} ref={form}> */}
        <Input
              placeholder="Email"
              type="text"
              className="form-control"
              name="Email"
              value={Email}
              onChange={onChangeEmail}
              validations={[required]}
            />
        { emMessage }
        <Input
              placeholder="Password"
              type="password"
              className="form-control"
              name="password"
              value={password}
              onChange={onChangePassword}
              validations={[required]}
            />
          { passMessage }
      {/* </FormContainer> */}
        {/* <MutedLink href="#">Forgot Password?</MutedLink> */}
        <PasswordPopup />
        <Marginer direction="vertical" margin="1em" />
        <CheckButton ref={checkBtn}>
          <SubmitButton>Login</SubmitButton>
        </CheckButton>
        <Marginer direction="vertical" margin={5} />
        <MutedLink href="#">
          Dont have an Account?
          <BoldLink href="#" onClick={switchToSignup}>
            sign up
          </BoldLink>
        </MutedLink>
      </Form>
    </BoxContainer>
  );
}
