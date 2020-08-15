import React from 'react';
import Wrapper from '../components/layout/appLayout';
import firebase from '../firebase';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage'
import Link from 'next/link';
import Spinner from '../components/UI/Spinner/Spinner'
import dateFormat from '../components/date'
import Router from 'next/router'

class Dashboard extends React.Component {
    state = {
        userData: {
            username: '',
            profilePicture: ''
        },
        unread: 0,
        notifications: []
    }
    checkActivationState = () => {
        this.setState({ loading: true })
        firebase.auth().onAuthStateChanged(user => {

            if (user) {
                const ref = firebase.database().ref('users/' + user.uid);
                ref.on('value', s => {
                    if (s.val().activated) {
                        let a = s.val().activated
                        this.setState({ activated: a })
                        if (a === 'payee') {
                            firebase.database().ref('activationReq/' + user.uid + '/payee').once('value', snap => {
                                firebase.database().ref('users/' + snap.val()).once('value', s => {
                                    console.log(snap.val());
                                    const pData = {
                                        username: s.val().username,
                                        uid: snap.val().substring(0, 6),
                                        bankDetails: s.val().bankDetails
                                    }
                                    this.setState({ pData: pData })
                                });
                            })
                        }

                    }
                    const userdata = { ...s.val(), uid: user.uid };
                    this.getNots(user.uid)
                    this.setState({ loading: false, userData: userdata })
                });
            }
        })
    }
    handleItemClicked = (e, id, href) => {
        firebase.database().ref('users/' + this.state.userData.uid + '/notifications/' + id + '/seen').set(true)
        Router.push(href)
    }
    getNots(uid) {
        firebase.database().ref('users/' + uid + '/notifications').on('value', s => {
            let n = [];
            let unread = 0
            if (s.val()) for (let key in s.val()) {
                let d = {
                    href: '/dashboard',
                    ...s.val()[key],
                    key
                }
                if (!d.seen) unread++
                n.push(d)
            }
            this.setState({ notifications: n.reverse(), unread: unread })
        })
    }
    componentDidMount() {
        this.checkActivationState()
    }
    render() {
        return (
            <Wrapper route="Notifications">
                {this.state.loading ? <div style={{ height: '50vh' }}> <Spinner /> </div> : <div>
                    {!this.state.activated && <div className="activate shadow">
                        <div className="pr-2">
                            <h2>Your account is not activated </h2>
                            <p>
                                You can activate your account now by clicking on the 'Activate my Account' button
                            </p>
                        </div>
                        <Link href="/activate">
                            <a className="btn btn-light btn-sm btn-block font-weight-bold text-uppercase ">
                                <i className="fal fa-sign-in mr-2  "></i>
                            Activate my account</a>
                        </Link>
                    </div>}
                    <div className="container">
                        <h5>You have {this.state.unread} new notifications</h5>
                        <div className="list-group-flush">
                            {this.state.notifications.map((cur, i) =>
                                <a href="#" onClick={(e) => this.handleItemClicked(e, cur.key, cur.href)} key={cur.key} className={"shadow-sm list-group-item list-group-item-action " + (cur.seen ? '' : 'active')}>
                                    <div className="d-flex w-100 justify-content-between">
                                        <p dangerouslySetInnerHTML={{ __html: cur.title }} className="mb-1"></p>
                                        <small className="date">{dateFormat(cur.date)} </small>
                                    </div>
                                </a>
                            )}
                        </div>

                    </div>

                </div>
                }
                <style jsx>{`
                .activate {
                    background : orangered;
                    padding : 20px;
                    color : #fff;
                }
                .hello {
                    font-weight : 500; 
                    margin-bottom-30px;
                    color : #000;
                }
                .activate  h2 {
                    font-weight : 400;
                }
                .list-group-item {
                    border : 0;
                    border-left : 2px solid  #c41;
                    margin-bottom : 10px;
                }
                .active {
                    background : #c505;
                    margin-bottom : 20px;
                    color : black;
                }
                .active:hover {
                    color : #777;
                    background : #c502
                }
                .date {
                    color : #379;
                    display : inline-block;
                    min-width : 60px;
                }

                `}</style>
            </Wrapper >
        )
    }
}

export default Dashboard