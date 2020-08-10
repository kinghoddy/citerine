import React from 'react';
import Wrapper from '../components/layout/appLayout';
import firebase from '../firebase';
import 'firebase/database';
import 'firebase/auth';
import Spinner from '../components/UI/Spinner/Spinner'

class Account extends React.Component {
    state = {
        userData: {
            username: '',
            profilePicture: ''
        },
        bankData: {
            bank: '',
            name: '',
            num: ''
        },
        loading: false,
        activated: false
    }
    checkActivationState = () => {
        this.setState({ loading: true })
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                const ref = firebase.database().ref('users/' + user.uid);
                ref.on('value', s => {
                    if (s.val().activated) {
                        this.setState({ activated: true })
                    }
                    const userdata = { ...s.val(), uid: user.uid.substr(0, 6) };

                    this.setState({ loading: false, userData: userdata })
                });
            }
        })
    }
    componentDidMount() {
        this.checkActivationState()
    }
    render() {
        return (
            <Wrapper route="My account"  >
                <div className="wow fadeIn d-flex profile">
                    <div className="d-flex align-items-center flex-column">
                        <img src={this.state.userData.profilePicture} alt="" />
                        <button className="btn btn-light rounded-pill mt-3 btn-sm" > <i className="fal fa-edit"></i> Change</button>
                    </div>
                    <div className="pl-3" style={{ flex: 1 }} >
                        <div className="form-group">
                            <label>Username</label>
                            <input disabled className=" form-control text-capitalize" value={this.state.userData.username} />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input disabled className="form-control" value={this.state.userData.email} />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input className="form-control" value={this.state.userData.phoneNumber} />
                        </div>
                    </div>
                </div>
                <h1 className="uid" >User id : <span>{this.state.userData.uid}</span> </h1>
                <div className="bank" style={{ flex: 1 }} >
                    <h4>Bank Details</h4>
                    <div className="form-group">
                        <label>Bank Name</label>
                        <input disabled className=" form-control text-capitalize" value={this.state.bankData.bank} />
                    </div>
                    <div className="form-group">
                        <label>Account Name</label>
                        <input disabled className="form-control" value={this.state.bankData.name} />
                    </div>
                    <div className="form-group">
                        <label>Account Number</label>
                        <input disabled className="form-control" value={this.state.bankData.num} />
                    </div>

                </div>
                <style jsx>{`
                 .form-group {
                    position: relative;
                    height : 40px
                }
                .form-group label {
                    position : absolute ;
                    font-size : 10px;
                    top : 5px;
                    color : #d50;
                    font-family : arial;
                    left : 12px;
                }
                  .form-group input{
                      height : 100%;
                      padding-top : 20px;
                       font-size : .8rem;
                       width : 100%;
                       max-width : 30rem;
                  }

                  .profile img {
                      height : 5rem;
                      width : 5rem;
                      border-radius : 50%;
                  }
                  .uid {
                      font-size : 2rem;
                    color : #f80;
                    font-weight : 300;
                  }
                  .uid span {
                      text-transform : none;
                    font-weight : 500;
                  }

                `} </style>
            </Wrapper >
        )
    }
}

export default Account