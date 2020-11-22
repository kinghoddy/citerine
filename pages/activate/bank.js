import React from 'react';
import Layout from '../../components/layout/appLayout';
import firebase from '../../firebase';
import 'firebase/database';
import 'firebase/auth';
import Router from 'next/router';

class Bank extends React.Component {
    state = {
        userData: {
            username: '',
            uid: null,
            profilePicture: ''
        },
        bankData: {
            bank: '',
            name: '',
            num: ''
        },
        loading: false,
        submitted: false
    }
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                firebase.database().ref('users/' + user.uid).once('value', s => {
                    let userdata = { ...s.val(), uid: user.uid };
                    if (s.val().bankDetails) {
                        this.setState({ bankData: s.val().bankDetails, submitted: true })
                    }
                    this.setState({ userData: userdata })
                });

            }
        })
    }
    inputChanged = (e, type) => {
        const form = { ...this.state.bankData }
        form[type] = e.target.value
        this.setState({ bankData: form })
    }

    addBank = (e) => {
        e.preventDefault();
        this.setState({ submitting: true, error: null })
        const ref = firebase.database().ref('users/' + this.state.userData.uid);
        const bank = { ...this.state.bankData };
        ref.child('bankDetails').set(bank).then(() => {
            this.setState({ submitted: true, submitting: false })
        }).catch((e) => {
            this.setState({ error, e, submitting: false })
        })
    }
    requestActivation = () => {
        const ref = firebase.database().ref('activationReq')
        ref.child(this.state.userData.uid).set({
            date: Date.now(),
            bankData: this.state.bankData,
            username: this.state.userData.username
        }).then(() => {
            firebase.database().ref('users/' + this.state.userData.uid + '/activated').set('requested')
            Router.push('/dashboard')
        })
    }

    render() {
        return (
            <Layout route="Add Bank details">
                {this.state.submitted ? <div className="">
                    <h5>You Bank Data has Been Saved Successfully </h5>
                    <div className="alert alert-info">
                        Next , click on the <b>Pay Activation Fee</b> button below.
                        You will be required to pay a one time Activation fee of ₦1,000.00 to Citrine Rewards. You are to make this payment within 24 hours.
                    </div>
                    <button onClick={this.requestActivation} className="btn btn-info" >Pay Activation Fee</button>
                </div> :
                    <form onSubmit={this.addBank}>
                        <div className="bg-warning p-3  mb-3 text-light">
                            <h3 className="font-weight-light"  >Add Your Bank Details Here</h3>
                        </div>
                        {this.state.error && <div className="alert alert-danger">
                            {this.state.error}
                        </div>}
                        <div className="form-group">
                            <label>Bank Name</label>
                            <select required onChange={(e) => this.inputChanged(e, 'bank')}>
                                <option value="">Select your Bank</option>
                                <option value="Access Bank">Access Bank</option>
                                <option value="Access Bank (Diamond)">Access Bank (Diamond)</option>
                                <option value="ALAT by WEMA">ALAT by WEMA</option>
                                <option value="ASO Savings and Loans">ASO Savings and Loans</option>
                                <option value="Citibank Nigeria">Citibank Nigeria</option>
                                <option value="Ecobank Nigeria">Ecobank Nigeria</option>
                                <option value="Ekondo Microfinance Bank">Ekondo Microfinance Bank</option>
                                <option value="Fidelity Bank">Fidelity Bank</option>
                                <option value="First Bank of Nigeria">First Bank of Nigeria</option>
                                <option value="First City Monument Bank (FCMB)">First City Monument Bank (FCMB)</option>
                                <option value="Guaranty Trust Bank">Guaranty Trust Bank</option>
                                <option value="Heritage Bank">Heritage Bank</option>
                                <option value="Jaiz Bank">Jaiz Bank</option>
                                <option value="Keystone Bank">Keystone Bank</option>
                                <option value="Kuda Bank">Kuda Bank</option>
                                <option value="PAGA (PAGATECH)">PAGA (PAGATECH)</option>
                                <option value="Parallex Bank">Parallex Bank</option>
                                <option value="Polaris Bank">Polaris Bank</option>
                                <option value="Providus Bank">Providus Bank</option>
                                <option value="Stanbic IBTC Bank">Stanbic IBTC Bank</option>
                                <option value="Standard Chartered Bank">Standard Chartered Bank</option>
                                <option value="Sterling Bank">Sterling Bank</option>
                                <option value="Suntrust Bank">Suntrust Bank</option>
                                <option value="Union Bank of Nigeria">Union Bank of Nigeria</option>
                                <option value="United Bank For Africa (UBA)">United Bank For Africa (UBA)</option>
                                <option value="Unity Bank">Unity Bank</option>
                                <option value="Wema Bank">Wema Bank</option>
                                <option value="Zenith Bank">Zenith Bank</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Account Name</label>
                            <input onChange={e => this.inputChanged(e, 'name')} value={this.state.bankData.name} />
                        </div>
                        <div className="form-group">
                            <label>Account Number</label>
                            <input type="number" onChange={e => this.inputChanged(e, 'num')} value={this.state.bankData.num} />
                        </div>
                        <p>Next ,
                        You will have to state your request on the system by clicking the "Pay Activation Fee" button
                    </p>
                        <button className="btn btn-primary"><i className="fal fa-arrow-right"></i> {this.state.submitting ? <div style={{ height: '22px', width: '22px' }} className=" px-3 spinner-border" ></div> : 'Next Step'}</button>
                    </form>
                }    <style>{`
                   form {
                       max-width : 30rem;
                       margin : 1rem auto;
                       box-shadow : 0 10px 10px rgba(0 ,0, 0, .1);
                       padding : 2rem;
                   }
                  .form-group {
                    position: relative;
                    height : 50px
                }
                .form-group label {
                    position : absolute ;
                    font-size : 10px;
                    top : 5px;
                    color : #d50;
                    font-family : arial;
                    left : 12px;
                }
                  .form-group input ,
                  .form-group select{
                      height : 100%;
                      border : 0;
                      outline : 0;
                      padding-top : 20px;
                       font-size : .8rem;
                       width : 100%;
                       border-bottom : 2px solid #38a;
                       max-width : 30rem;
                  }
                `}</style>
            </Layout>
        )
    }
}

export default Bank