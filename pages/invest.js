import React from 'react';
import firebase from '../firebase';
import 'firebase/database';
import Layout from '../components/layout/appLayout';
import Router from 'next/router'

export default class Transactions extends React.Component {
    state = {
        error: null,
        amount: 5000
    }
    componentDidMount() {
        this.setState({ loading: true })
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                firebase.database().ref('users/' + user.uid).on('value', s => {
                    if (s.val().pendingInvestment) {
                        this.setState({ pending: true })
                    }
                })
                this.setState({
                    userData: {
                        uid: user.uid,
                        username: user.displayName
                    },
                    loading: false
                })
            }
        })
    }
    validate = (e) => {
        this.setState({ error: null, loading: true });
        e.preventDefault();
        if (this.state.amount < 5000) {
            this.setState({ error: 'You cannot invest less than ₦5,000' });
        } else {
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'NGN',
                minimumFractionDigits: 2
            })
            const c = confirm('You are about to invest ' + formatter.format(this.state.amount));
            if (c) {
                const ref = firebase.database().ref('transactions').push()
                const trans = {
                    date: Date.now(),
                    amount: this.state.amount,
                    uid: this.state.userData.uid,
                    username: this.state.userData.username
                }
                ref.set(trans).then(() => {
                    firebase.database().ref('users/' + this.state.userData.uid + '/pendingInvestment').set(ref.key)
                    Router.push('/transactions')
                });
            }
        }
    }

    render() {
        return (
            <Layout route="Transactions">
                {this.state.error && <div className="animated fadeIn alert alert-danger shadow-sm">{this.state.error}</div>}
                {this.state.pending ? <div className="alert alert-info shadow">You Have a pending investment  </div> : <React.Fragment>
                    <p>Enter The amount Your Wish To Invest </p>
                    {this.state.loading ? <div className="spinner-border text-center text-primary" /> : <form className="d-flex align-items-center" onSubmit={this.validate}>
                        <span className="am" >Amount</span>
                        <div className="form-group mx-2">
                            <label>₦</label>
                            <input required value={this.state.amount} onChange={e => this.setState({ amount: e.target.value })} type="number" placeholder="0.00" />
                        </div>
                        {this.state.amount && <button className="btn btn-primary shadow">Next</button>}
                    </form>}
                </React.Fragment>}
                <style jsx>{`
                 form {
                           flex-direction : column;
                       }
                   .form-group {
                       margin : 20px 0;
                       position : relative;
                   }
                   .am {
                       font-size : 25px;
                       color : orangered;
                   }
                   label {
                       position : absolute ;
                       left : 15px;
                       top : 50%;
                       transform : translateY(-50%);
                   }
                   input {
                       border : 0;
                       outline : 0;
                       border-bottom : 2px solid orangered;
                       padding : 10px;
                       padding-left : 40px;
                       flex : 1;
                       font-size : 20px;
                   }
                   input:focus {
                       outline : 0;
                   }
                   @media only screen and (min-width : 760px){
                       form {
                           flex-direction : row
                       }
                   }
                `}</style>
            </Layout>
        )
    }
}