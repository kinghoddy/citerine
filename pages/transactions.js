import React from 'react';
import firebase from '../firebase';
import 'firebase/database';
import Link from 'next/link'
import Layout from '../components/layout/appLayout';
import Spinner from '../components/UI/Spinner/Spinner'

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2
})

export default class Transactions extends React.Component {
    state = {
        userData: {},
        investments: [],
        pending: {
        }
    }
    componentDidMount() {
        this.checkStatus()
        this.getTrans();
    }
    checkStatus = () => {
        this.setState({ loading: true })
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({
                    userData: {
                        uid: user.uid,
                        username: user.username
                    }
                })
                const db = firebase.database()
                db.ref('users/' + user.uid).on('value', s => {
                    let p = s.val().pendingInvestment
                    if (p) {
                        db.ref('transactions/' + p).on('value', snap => {
                            this.setState({ pending: { ...snap.val() }, loading: false })
                        });
                    }
                })
            }
        })
    }
    getTrans = () => {
        const $ = require('jquery')
        require('datatables.net-bs4')
        $(document).ready(function () {
            $('#transTable').DataTable({
                "pageLength": 5,
                retrieve: true,
                "lengthMenu": [[5, 10, 50, -1], [5, 10, 50, "All"]]
            });
        });
    }
    render() {
        return (
            <Layout route="Transactions">
                {this.state.loading ? <div style={{ height: '50vh' }}>
                    <Spinner />
                </div> : <React.Fragment> <p>Start investing today and get reward in 7 days</p>
                        <div className="row ">
                            <div className="col-md-6 mb-3">

                                <div className="cards shadow-sm">
                                    <div className="data" >
                                        <h5 className="text-uppercase">Earnings</h5>
                                        <span>N0.00 </span>
                                    </div>
                                    <div className="flex-column d-flex align-items-center">
                                        <i className='fa fa-sac-dollar'></i>
                                        <button className="btn btn-sm btn-primary button" >Cash Out</button>
                                    </div>


                                </div>
                            </div>
                        </div>
                        {this.state.pending && <div className="alert alert-info shadow-sm">

                            {this.state.pending.payee ? <React.Fragment>To complete your investment of <b>{formatter.format(this.state.pending.amount)}</b> , you are to pay to <b className="text-capitalize">{this.state.pending.payee.username}</b>
                                <button className="btn btn-info btn-sm mx-2" onClick={() => alert(`Account Name: ${this.state.pending.payee.bankDetails.name} \n Bank:  ${this.state.pending.payee.bankDetails.bank} `)} >View Bank Details</button>
                                <br />
                                Once payment is complete , Click on i've paid button below and upload your evidence of payment to verify your payment. Once payment is verified by the system , it will reflect in the table below.
                                <button className="btn btn-info btn-sm mx-2" >I've Paid</button>

                            </React.Fragment> : <React.Fragment>
                                    You have a pending investment of <b>{formatter.format(this.state.pending.amount)}</b> <br />
                            You would be give the account details you are to pay to
                            </React.Fragment>}
                        </div>}
                        <div className="card border-0 shadow">
                            <div className="card-header border-0 justify-content-between d-flex">
                                <span className=' text-capitalize text-primary' >investments</span>
                                <Link href="/invest">
                                    <a className="btn btn-primary btn-sm">Invest</a>
                                </Link>
                            </div>
                            <div className="card-body">
                                <table className="table" id="transTable">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Amount</th>
                                            <th>Date</th>
                                            <th>Interest</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                    </React.Fragment>}
                <style jsx >{`
            .cards {
                background : #fff;
                border-left : 3px solid #348;
                border-radius : 4px;
                display : flex;
                justify-content : space-between;
                align-items : center;
                padding : 15px;
            }
            .data h5 {
                font-size : .9rem;
                margin-bottom : 4px;
                color : #348;
            }

            i {
                font-size : 30px;
                opacity : .4;
                color : #348
            }
            .button {
                color : #348;
                background : #4382;
                border : 0 !important;
            }
        `}</style>
            </Layout>
        )
    }
}