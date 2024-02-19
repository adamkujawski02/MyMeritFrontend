import React from 'react';
import "./login.css";

import Input from '../../components/login/Input';
import Divider from '../../components/login/Divider';
import OAuthLogin from '../../components/login/OAuthLogin';

import { useAuth } from "../../hooks/useAuth";

const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form submitted");

    const { signIn } = useAuth();

    const email = (event.target as any).email.value;
    const password = (event.target as any).password.value;

    signIn({ email, password });
}

const Login: React.FC = () => {
    return (
        <div className="login-box">
            <h1>Welcome back!</h1>
            <form onSubmit={onSubmit}>
                <Input type="text" id="email" name="email" placeholder="email" />
                <Input type="password" id="password" name="password" placeholder="password" />

                <a className="forgot-password" href="#">forgot password?</a>

                <button type="submit">
                    Log In
                </button>
            </form>
            <Divider>or</Divider>
            <OAuthLogin />

            <p className="signup-link">Don't have an account? <a href="#">Sign up</a></p>
        </div>
    );
}

export default Login;