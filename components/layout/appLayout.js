import React, { Component } from 'react';
import Link from '../UI/Link/link';
import firebase from '../../firebase';
import 'firebase/auth'
import 'firebase/database'
import Loader from '../UI/loader/loader'
import Head from 'next/head'
import Router from 'next/router'

export default class extends Component {
    state = {
        userData: {
            profilePicture: ""
        },
        shouldLogout: false,
        showSidenav: false
    }
    componentDidUpdate() {
        if (this.state.shouldLogout) Router.push('/login?route=dashboard')
    }
    componentDidMount() {

        this.setState({ loading: true });
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                const userdata = {
                    ...this.state.userData
                };
                userdata.profilePicture = user.photoURL;
                userdata.uid = user.uid;
                userdata.username = user.displayName.toLowerCase();
                firebase.database().ref('users/' + user.uid).on('value', s => {
                    let userData = s.val();
                    this.setState({
                        loading: false,
                        shouldLogout: false,
                        userData: userdata
                    });

                })

            } else {
                this.setState({ shouldLogout: true, loading: false });
            }

        });

    }
    logOutHandler = () => {
        this.setState({ loading: true });
        firebase
            .auth()
            .signOut()
            .then(() => {
                this.setState({ loading: false, shouldLogout: true });
            })
            .catch(error => {
                this.setState({ loading: false });
                console.log(error);
                // An error happened.
            });
    };
    toggleSidenav = () => {
        this.setState({ showSidenav: !this.state.showSidenav });
    };
    render() {

        return (
            <div className="con">
                <Head>
                    <title>{this.props.route}  | Citrine Rewards </title>
                    <meta property="og:image" content="/favicon.png" />
                    <link rel="shortcut icon" href="/logo_text.png" />
                </Head>
                <div className={['wrapper', this.state.showSidenav ? 'show' : 's'].join(" ")} >

                    {this.state.loading ? <Loader /> : null}
                    {this.state.showSidenav ?
                        <div className={'backdrop'} onClick={this.toggleSidenav}></div>
                        : null}
                    <div className="Sidenav">
                        <div className="mb-3">
                            <Link href="/">
                                <a className="text-light d-flex align-items-center py-3 px-2">
                                    <img src="/img/logo/logo_dark_2.png" style={{ width: "80%" }} />
                                </a>
                            </Link>
                            <Link activeClassName={'active'} href="/dashboard">
                                <a className={'sidenavLink'}>
                                    <i className="material-icons mr-1">dashboard</i>  Dashboard
                        </a>
                            </Link>
                            <Link activeClassName={'active'} href="/transactions">
                                <a className={'sidenavLink'}>
                                    <i className="fal fa-sack-dollar mr-1"></i>  Transactions
                        </a>
                            </Link>
                            <Link activeClassName={'active'} href="/testimonials">
                                <a className={'sidenavLink'}>
                                    <i className="fal fa-newspaper mr-1"></i>  Testimonials
                        </a>
                            </Link>
                            <Link activeClassName={'active'} href="/account">
                                <a className={'sidenavLink'}>
                                    <i className="material-icons mr-1">people</i>  My account
                        </a>
                            </Link>
                            <Link activeClassName={'active'} href="/referrals">
                                <a className={'sidenavLink'}>
                                    <i className="fal fa-user-plus mr-1"></i>  Referrals
                        </a>
                            </Link>
                            <Link activeClassName={'active'} href="/notifications">
                                <a className={'sidenavLink'}>
                                    <i className="fal fa-bell mr-1"></i> Notifications
                        </a>
                            </Link>
                        </div>
                        <div className="lower" >
                            <img src={this.state.userData.profilePicture} alt="" />
                            <h5>{this.state.userData.username} </h5>
                        </div>
                    </div>
                    <div className="content position-relative">
                        <nav className=" d-flex sticky-top bg-white border-bottom justify-content-between px-3 py-1">
                            <div className="d-flex align-items-center">

                                <button className="btn" onClick={this.toggleSidenav} >
                                    <i className="fa fa-bars" ></i>
                                </button>
                                <h3 className="h5 mb-0 ml-3">{this.props.route}</h3>
                            </div>
                            <div className="d-flex align-items-center">

                                <img src={this.state.userData.profilePicture} className="rounded-circle" alt="" style={{ height: '30px' }} />
                                <button onClick={this.logOutHandler} className="btn btn-dark btn-sm ml-3">  Logout </button>
                            </div>
                        </nav>
                        <div className="p-2 w-100">
                            {this.props.children}
                        </div>
                    </div>
                </div>
                <style jsx>{`
                .con {
                    background : linear-gradient(to  bottom , #f82, #d20);
                }
                .wrapper {
                    box-shadow : 0 10px 30px rgba(0,0,0,.3);
                    display : flex;
                    min-height: 100vh;
                    overflow-x : hidden;
                    overflow-y : visible;
                    transition: 0.3s ease-out;
                }
                .content {
                    flex : 1;
                    max-width : 100vw;
                    background : #f7f8fc;
                }
                
                .Sidenav {
                    transition: 0.3s ease-out;
                    color: #222;
                    background: url("/img/nav-bg.png"), linear-gradient(to  bottom, #fff, #fff);
                    background-size: cover;
                    width : 13rem;
                    z-index : 2000;
                    flex-shrink : 0;
                    margin-left : -13rem;
                    display : flex;
                    flex-direction : column;
                    justify-content : space-between
                }
                .show .Sidenav{
                    margin-left : 0;
                }
                .lower {
                    background : #ddd5;
                    padding : 10px;
                    display  : flex ;
                    align-items : center;
                }
                .lower img {
                    height : 30px;
                    width : 30px;
                    object-fit : cover;
                    border-radius : 50%;
                }
                .lower h5 {
                    margin : 0;
                    margin-left : 20px;
                    text-transform : capitalize;
                    font-size : 14px;
                }
.sidenavLink {
  color: #555;
  padding-left : calc(1rem + 8px);
  display: flex;
  text-decoration: none !important;
  align-items: center;
  height: 3rem;
  border-radius : 0 40px 40px 0;
  transition : all .4s;
}
.sidenavLink:hover,
.active {
  background: rgba(100, 40, 0, 0.5);
  color: white;
  padding-left : 1rem;
  border-left : 8px solid  #f81
}
.backdrop {
  width: 100vw;
  height: 100vh;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1100;
  background-color: rgba(0, 0, 0, 0.7);
  transition: all 0.3s;
}
@media only screen and (min-width: 1200px) {
    .con {
        padding : 2rem 0 4rem;
    }
    .backdrop {
        display: none;
    }
  .wrapper {
      width : 80vw;
      margin : 0 auto;
  }
  .Sidenav {
      margin-left: 0;
      
    }
    .show .Sidenav {
        margin-left: -13rem;
  }
}
                `}</style>
            </div>
        )
    }
}
