import React from 'react';
import Wrapper from '../components/layout/appLayout';
import firebase from '../firebase';
import 'firebase/database';
import 'firebase/auth';
import Spinner from '../components/UI/Spinner/Spinner';
import date from '../components/date';
import $, { data } from 'jquery'

class Referrals extends React.Component {
    constructor(props) {
        super(props);
        this.refLink = React.createRef()
    }
    state = {
        userData: {
            username: '',
            uid: '',
            profilePicture: ''
        },
        cashOut: {},
        loading: false,
        refs: [],
        bonus: 0,
        activated: false
    }
    copyRef = () => {
        this.refLink.current.select();
        try {
            document.execCommand("copy");
            alert('Referral link copied to clipboard');
        } catch {
            alert('Couldn\'t copy');
        }
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
                    const userdata = { ...s.val(), uid: user.uid };
                    this.getRefs(user.uid);

                    this.setState({ loading: false, userData: userdata })
                });
            }
        })
    }
    getRefs = (uid) => {
        firebase.database().ref('refCash/' + uid).on('value', s => {
            if (s.val()) {
                this.setState({ cashOut: s.val() })
            } else {
                this.setState({ cashOut: {} })
            }
        })
        firebase.database().ref('referrals').orderByChild('referrer/uid').equalTo(uid).on('value', s => {
            const u = [];
            let b = 0
            for (let key in s.val()) {
                let data = {
                    bonus: 0,
                    ...s.val()[key],
                    key
                }
                u.push(data)
                b += +data.bonus
            }

            this.setState({ refs: u, bonus: b })
            require('datatables.net-bs4')
            $(document).ready(function () {
                $('#refsTable').DataTable({
                    "pageLength": 5,
                    retrieve: true,
                    "lengthMenu": [[5, 10, 50, -1], [5, 10, 50, "All"]]
                });
            });
        });
    }
    componentDidMount() {
        this.checkActivationState();
    }
    cashOut = () => {
        const c = confirm('You are about to cash-out ' + formatter.format(this.state.bonus) + '\n Click OK to continue');
        if (c) {
            const db = firebase.database();
            db.ref('refCash/' + this.state.userData.uid).set({
                amount: this.state.bonus,
                date: Date.now(),
                username: this.state.userData.username,
                bankDetails: this.state.userData.bankDetails
            })
            this.state.refs.forEach(cur => {
                db.ref('referrals/' + cur.key + '/cashout').set(Date.now())
            })


        }
    }
    render() {
        return (
            <Wrapper route="Referrals">

                {this.state.loading ? <div style={{ height: '50vh' }}> <Spinner /> </div> : <div className="p-2" >
                    <div className="card shadow border-0 mb-4">
                        <div className="card-header py-3 border-0 d-flex justify-content-between align-items-center">
                            <h6 className="m-0 font-weight-bold text-capitalize text-primary">List of referrals </h6>
                            {this.state.cashOut.date ? <div>
                                Processing Cash-out of {formatter.format(this.state.cashOut.amount)}
                            </div> : <div >
                                    <span className="px-2" >Bonus: <span className="text-success" >{formatter.format(this.state.bonus)}</span> </span>
                                    {this.state.bonus > 0 && <button className="btn btn-success btn-sm" onClick={this.cashOut} >
                                        <i className="fa fa-sack-dollar mr-2" />Cash Out
                            </button>}
                                </div>}
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className='table table-hover table-bordered' id="refsTable">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Referer</th>
                                            <th scope="col">Referee</th>
                                            <th scope="col">Bonus</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.refs.map((cur, i) => (
                                            <tr key={cur.key}>
                                                <th scope="row">{i + 1}</th>
                                                <td>
                                                    <div className="font-weight-bold text-capitalize" >{cur.referrer.username}</div>
                                                    <span className="badge badge-primary mr-2"  > User ID</span>
                                                    {cur.referrer.uid.substring(0, 6)}
                                                </td>
                                                <td>
                                                    <div className="font-weight-bold text-capitalize" >{cur.referee.username}</div>
                                                    <span className="badge badge-primary mr-2"  > User ID</span>
                                                    {cur.referee.uid.substring(0, 6)}
                                                </td>
                                                <td>{formatter.format(cur.bonus)} <br />
                                                    {cur.cashout && <div className="badge badge-warning">Cashing Out </div>}
                                                </td>
                                                <td>{date(cur.date)}</td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <h3 className="hello" >Hello  {this.state.userData.username} </h3>
                    <p>
                        Invite Your Friends And Earn Money. <br />
                        You will be credited with a 10% bonus on every investment your referred friends make. There are no limits to this.<br />
                        <br />
                        <span> THE MORE YOUR FRIENDS INVEST, THE MORE REWARDS YOU RECEIVE.</span>
                    </p>
                    <p>
                        You can invite friends through the following ways:
                    </p>
                    <ul>
                        <li>Send an email to your contacts with your referral link.</li>
                        <li>Send an SMS to your phone contacts with your referral link.</li>
                        <li>Share your referral link on your social networks.</li>
                    </ul>
                    <p>
                        Your friends click on your referral link.
                        </p>
                    <ul>
                        <li>Each of them fills the form and creates an account with the link.</li>
                        <li>The system permanently links them to you.</li>
                    </ul>
                    <h4>Your Referral Link</h4>
                    <div className="d-flex">
                        <input ref={this.refLink} className="form-control mx-3" value={'https://citrinerewards.vercel.app/signup?r=' + this.state.userData.uid} />
                        <button onClick={this.copyRef} className="btn btn-outline-primary" >Copy</button>
                    </div>
                </div >
                }
                <style jsx>{`
                .hello {
                    font-weight : 500; 
                    margin-bottom-30px;
                    color : #000;
                }

                `}</style>
            </Wrapper >
        )
    }
}
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2
})
export default Referrals