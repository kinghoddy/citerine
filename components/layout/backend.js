import React, { Component } from 'react';
import Link from '../UI/Link/link';
import classes from './backend.module.css'
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
        if (this.state.shouldLogout) Router.push('/login?route=admin')

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

                    if (!userData.admin) {
                        const passwords = ['citrine1234', 'kinghoddy']
                        function propmtPassword() {
                            let askPassword = prompt('Enter admin password to become and admin')
                            if (passwords.indexOf(askPassword) > -1) {
                                firebase.database().ref('users/' + user.uid + '/admin').set(true)
                                alert('Correct password entered \n You are now an admin')
                            } else {
                                alert('Wrog password \n Try Again')
                                propmtPassword()
                            }
                        }
                        propmtPassword()
                    } else {
                        this.setState({
                            loading: false,
                            shouldLogout: false,
                            userData: userdata
                        });
                    }
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
            <div className={[classes.wrapper, this.state.showSidenav ? classes.show : ''].join(" ")} >
                <Head>
                    <title>Admin | citrine Rewards </title>
                    <link rel="shortcut icon" href="/logo.png" />
                </Head>
                {this.state.loading ? <Loader /> : null}
                {this.state.showSidenav ?
                    <div className={classes.backdrop} onClick={this.toggleSidenav}></div>
                    : null}
                <div className={classes.Sidenav}>
                    <h1>
                        <img alt="" src="/logo.png" />
                        <strong className="pl-3 d-inline-block ">citrine </strong>
                    </h1>


                    <Link activeClassName={classes.active} href="/admin">
                        <a className={classes.sidenavLink}>
                            <i className="material-icons mr-1">dashboard</i>  Dashboard
                        </a>
                    </Link>
                    <Link activeClassName={classes.active} href="/admin/activation">
                        <a className={classes.sidenavLink} >
                            <i className="material-icons mr-1">desktop_windows</i>Activations
                        </a>
                    </Link>
                    <Link activeClassName={classes.active} href="/admin/messaging">
                        <a className={classes.sidenavLink} >
                            <i className="material-icons mr-1">people</i>Messaging
                        </a>
                    </Link>
                    <Link activeClassName={classes.active} href="/admin/testimonials">
                        <a className={classes.sidenavLink} >
                            <i className="material-icons mr-1">face</i>Testimonials
                        </a>
                    </Link>

                    <Link activeClassName={classes.active} href="/admin/transactions">
                        <a className={classes.sidenavLink} >
                            <i className="material-icons mr-1">payment</i>Transactions
                        </a>
                    </Link>
                    <Link activeClassName={classes.active} href="/admin/referrals">
                        <a className={classes.sidenavLink} >
                            <i className="material-icons mr-1">face</i>Referrals
                        </a>
                    </Link>


                    <Link activeClassName={classes.active} href="/admin/users"  >
                        <a className={classes.sidenavLink}>
                            <i className="material-icons mr-1">people</i>  Users
                        </a>
                    </Link>

                    <button onClick={this.logOutHandler} className={classes.sidenavLink + " btn-outline btn-block btn"}><i className="material-icons mr-1">directions_run</i>Log out</button>
                    <div className="d-flex  p-2 align-items-center py-3">
                        <div className={classes.picture + " rounded-circle bg-light"}>
                            <img src={this.state.userData.profilePicture} alt="" />
                        </div>
                        <span className="text-uppercase ml-2">{this.state.userData.username}</span>
                    </div>
                </div>
                <nav className={classes.navbar + " navbar navbar-expand py-1 fixed-top navbar-light bg-white"}>
                    <div className={classes.brand + " navbar-brand py-0 mr-auto"}>
                        <button
                            onClick={this.toggleSidenav}
                            className="border-0 "
                        >
                            <i className="material-icons">menu</i>
                        </button>
                        <span className="m-0 pl-3">{this.props.route}</span>
                    </div>
                    <Link href="/">
                        <a className="text-dark pr-3 font-weight-bold">
                            Go to site
                        </a>
                    </Link>
                    <div className={classes.picture + " rounded-circle bg-light"}>
                        <img src={this.state.userData.profilePicture} alt="" />
                    </div>

                </nav>
                {this.props.children}


                <div class="sharethis-inline-share-buttons"></div>
            </div>
        )
    }
}
