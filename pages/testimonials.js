import React from 'react';
import Wrapper from '../components/layout/appLayout';
import firebase from '../firebase';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage'
import Link from 'next/link';
import Card from '../components/card'
import Spinner from '../components/UI/Spinner/Spinner'
import $ from 'jquery'
import date from '../components/date';

class Testimonials extends React.Component {
    state = {
        userData: {
            username: '',
            uid: '',
            profilePicture: ''
        },
        form: {
            body: ''
        },
        testimonials: [],
        loading: false,
        activated: false
    }
    checkActivationState = () => {
        this.setState({ loading: true })
        firebase.auth().onAuthStateChanged(user => {

            if (user) {
                this.getTest(user.uid)
                const ref = firebase.database().ref('users/' + user.uid);
                ref.on('value', s => {
                    if (s.val().activated) {
                        let a = s.val().activated
                        if (a.declined) {
                            this.setState({
                                error: <span>Your payment was not approved because of the following reasons : <br /> <b>{a.declined}</b> <br />
                                    <button onClick={this.openModal} className="btn btn-primary btn-sm"  >Retry</button>
                                </span>
                            })
                        }
                        this.setState({ activated: a })
                    }
                    const userdata = { ...s.val(), uid: user.uid };
                    this.setState({ loading: false, userData: userdata })
                });
            }
        })
    }
    changed(e, type) {
        const f = { ...this.state.form };
        f[type] = e.target.value;
        this.setState({ form: f })
    }
    getTest = (uid) => {
        firebase.database().ref('testimonials').orderByChild('uid').equalTo(uid).on('value', s => {
            const p = [];
            for (let key in s.val()) {
                p.push({ ...s.val()[key] })
            }
            this.setState({ testimonials: p.reverse() })
        })
    }
    send = (e) => {
        e.preventDefault();
        const post = {
            body: this.state.form.body.split('\n').join('<br/>'),
            date: Date.now(),
            uid: this.state.userData.uid,
            username: this.state.userData.username,
            profilePicture: this.state.userData.profilePicture
        }
        firebase.database().ref('testimonials').push(post).then(() => {
            let f = {
                body: ''
            }
            this.setState({ form: f })
        })
    }
    componentDidMount() {
        this.checkActivationState()
    }
    render() {
        return (
            <Wrapper route="Testimonials">
                {this.state.error && <div className="alert alert-danger">{this.state.error}</div>}
                {this.state.loading ? <div style={{ height: '50vh' }}> <Spinner /> </div> : <div>
                    <h3 className="hello" >Hello  {this.state.userData.username} </h3>

                    {!this.state.activated ? <div className="activate shadow">
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
                    </div> :
                        <form className="form" onSubmit={this.send} >
                            <textarea required value={this.state.form.body} onChange={e => this.changed(e, 'body')} rows="5" className="form-control" placeholder="Your Testimonial...." />
                            <button className="btn btn-success shadow-sm my-2">Send</button>
                        </form>
                    }
                    <div>
                        <h5>Your Testimonials {this.state.testimonials.length} </h5>
                        <div className="row">
                            {this.state.testimonials.map(cur => <div className="col-lg-6 mb-3">
                                <div className="shadow card">
                                    <div className="card-header border-0">
                                        <i className="fa fa-quote-left" />
                                        <span className="mx-2 text-capitalize text-danger" >{cur.username}</span>
                                    </div>
                                    <div className="card-body">
                                        <div dangerouslySetInnerHTML={{ __html: cur.body }} ></div>

                                        <small className="text-primary mt-2 d-block">
                                            {date(cur.date)}
                                        </small>
                                    </div>
                                </div>
                            </div>)}
                        </div>
                    </div>
                </div>
                }
                <style jsx>{`
                .form {
                    max-width : 040rem;
                }
                .card {
                    border : 0;
                }
                .card-body {
                    font-size: .8rem;
                }
         
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
                `}</style>
            </Wrapper >
        )
    }
}

export default Testimonials