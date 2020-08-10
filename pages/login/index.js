import React, { Component } from "react";
import Link from 'next/link';
import firebase from "../../firebase";
import "firebase/auth";
import "firebase/database";
import Input from "../../components/UI/Input/Input";
import Spinner from "../../components/UI/Spinner/Spinner";
import Toast from "../../components/UI/Toast/Toast";
import Alert from "../../components/UI/Alert/Alert";
import Wrapper from '../../components/auth.js'
import Head from 'next/head';
import Router from 'next/router'


class Login extends Component {
    state = {
        form: {
            email: {
                elementType: "input",
                elementConfig: {
                    type: "email",
                    placeholder: "Email",
                    required: true
                },
                value: "",
                id: "email",
                label: "Email"
            },
            password: {
                elementType: "input",
                elementConfig: {
                    required: true,
                    type: "password",
                    minLength: 6,
                    placeholder: "Your password"
                },
                value: "",
                label: "Your password",
                id: "password"
            }
        },
        errorMessage: null,
        sMessage: "Please Wait ! ! !",
        loading: false,
        userExist: null,
        shouldLogin: false,
        toast: null
    };
    inputChanged = (e, id) => {
        const updatedForm = {
            ...this.state.form
        };
        const updatedFormEl = { ...updatedForm[id] };
        updatedFormEl.value = e.target.value;
        updatedForm[id] = updatedFormEl;
        this.setState({ form: updatedForm });
    };

    componentDidMount() {
        this.checkUser()
        console.log(Router.query);
    }
    fetchUser = user => {
        if (user !== null) {
            this.setState({ loading: false, errorMessage: null, shouldLogin: true });
        } else {
            var errorMessage = <strong>Failed</strong>;
            this.setState({ loading: false, errorMessage: errorMessage });
        }
        if (this.state.shouldLogin) {
            var search = Router.query.route;

            if (search) {
                Router.push("/" + search);
            } else {
                Router.push("/dashboard");
            }
        }
    };
    signInHandler = event => {
        event.preventDefault();
        this.setState({ loading: true });
        const formData = {};
        for (let formId in this.state.form) {
            formData[formId] = this.state.form[formId].value;
        }
        firebase
            .auth()
            .signInWithEmailAndPassword(formData.email, formData.password)
            .then(res => {
                // User is signed in.
                var user = res.user;
                this.fetchUser(user);
            })
            .catch(error => {
                // Handle Errors here.
                var errorMessage = error.message;
                this.setState({ loading: false, errorMessage: errorMessage });
                // ...
            });
    };
    checkUser = () => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                const userdata = {
                    username: user.displayName,
                    profilePicture: user.photoURL
                }
                this.setState({ userData: userdata })
            }
        })
    }
    forget = (e) => {
        e.preventDefault()
        this.setState({ errorMessage: null, toast: null })
        const emailAddress = prompt('Email address. \n A password reset email will be sent to your email address')
        firebase.auth().sendPasswordResetEmail(emailAddress).then(() => {
            this.setState({ toast: 'A password reset email was sent to ' + emailAddress })
        }).catch((error) => {
            this.setState({ errorMessage: error.message })
        });
    }
    render() {
        const formElementArray = [];
        for (let key in this.state.form) {
            formElementArray.push({
                id: key,
                config: this.state.form[key]
            });
        }
        return <Wrapper>
            <Head>
                <title>Login | Citrine rewards</title>
                <meta property="og:title" content="Login | Citrine Rewards" />
                <meta property="og:description"
                    content=" Admin login citrine rewards" />
            </Head>
            {this.state.loading ? (
                <Spinner message={this.state.sMessage} />
            ) : (
                    <form className="form" onSubmit={this.signInHandler}>
                        <h4 className="my-3" >Sign in to your account</h4>
                        <p style={{ fontSize: ".8rem" }} className="mb-4">
                            Citrine Rewards  is a full-featured and affordable ecommerce solution that includes web, mobile and social stores.
                        </p>
                        {this.state.errorMessage ? (
                            <Alert type="warning" show={true}>
                                {this.state.errorMessage}
                            </Alert>
                        ) : null}
                        {this.state.userData ? <div className=" py-4 mx-auto d-flex text-light align-items-center justify-content-center">
                            <img style={{ height: "4rem", flexShrink: 0, width: "4rem", objectFit: "cover" }} src={this.state.userData.profilePicture} className="bg-light rounded-circle " alt="" />
                            <div className="text-light px-3 ">

                                <h4 style={{ fontSize: ".8rem" }} className="text-dark h6">{this.state.userData.username} is already logged in</h4>
                                <button style={{ fontSize: ".6rem" }} onClick={() => Router.back()} className="btn btn-outline-dark px-3 btn-sm  rounded-pill"> Continue as {this.state.userData.username}
                                </button>

                            </div>
                        </div>
                            : null}
                        {this.state.toast ? <Toast>{this.state.toast}</Toast> : null}


                        {formElementArray.map(el => (
                            <Input
                                elementType={el.config.elementType}
                                elementConfig={el.config.elementConfig}
                                value={el.config.value}
                                id={el.id}
                                key={el.config.id}
                                label={el.config.label}
                                changed={e => {
                                    this.inputChanged(e, el.id);
                                }}
                            />
                        ))}

                        <button
                            className='btn-warning btn btn-block  text-uppercase font-weight-bold mb-2'
                            type="submit"
                        >
                            Sign in
        </button>

                        <div className="text-center">
                            <a onClick={this.forget} href="#" className="small">
                                Forgot password?
                            </a>
                            <br />
                            <Link className="small" href="/signup">
                                <a className="small">
                                    Create new account
                            </a>
                            </Link>
                        </div>
                        <style jsx >{`
                        .form {
                        width : 90%;
                        }
 .googleBtn {
                            background: #66f;
                            color: white;
                            position : relative;
                            overflow : hidden;
                            font-size : 1rem;
                            font-weight : bold;
                        }
.googleBtn img {
    position : absolute;
    left : 0;
    background : white;
    top : 0;
    height : 100%;
}
@media only screen and (min-width : 760px ){
    .form {
        width : 60%
    }
}
    `}</style>
                    </form>
                )}</Wrapper>
    }
}

export default Login;
