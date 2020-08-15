import React, { Component } from 'react';
import Layout from '../../components/layout/backend';
import Spinner from '../../components/UI/Spinner/Spinner'
import firebase from '../../firebase';
import Router from 'next/router'
import 'firebase/database';
import dateFormat from '../../components/date';
import $ from 'jquery'

class TransAdmin extends Component {

    state = {
        transactions: [],
        users: [],
    }
    componentDidMount() {
        this.getTrans();
        this.getUsers();
    }
    getTrans() {
        this.setState({ loading: true });
        firebase.database().ref('transactions').on('value', s => {
            const u = [];
            for (let key in s.val()) {
                let d = {
                    interest: 0,
                    status: {},
                    ...s.val()[key], key,
                }
                if (!d.payee) d.payee = {
                    uid: ''
                };
                u.push(d);
            }
            require('datatables.net-bs4')
            $(document).ready(function () {
                $('#trans').DataTable({
                    "pageLength": 5,
                    retrieve: true,
                    "lengthMenu": [[5, 10, 50, -1], [5, 10, 50, "All"]]
                });
            });
            this.setState({ loading: false, transactions: u.reverse() })
        })
    }
    getUsers = () => {
        firebase.database().ref('users').once('value', s => {
            const u = [];
            for (let key in s.val()) {
                if (s.val()[key].activated === true) u.push({
                    username: s.val()[key].username,
                    bankDetails: s.val()[key].bankDetails,
                    uid: key
                })
            }
            this.setState({ users: u })
        });
    }
    payeeChanged = (e, i, key, uid) => {
        let r = this.state.transactions;
        r[i].payee = e.target.value;
        let payee = this.state.users.filter(cur => cur.uid === e.target.value);
        if (payee[0]) {
            firebase.database().ref('users/' + uid + '/notifications').push({
                date: Date.now(),
                href: '/transactions',
                title: 'The system has assigned guider to pay to for your investment of ' + formatter.format(r[i].amount)
            })
        }
        firebase.database().ref('transactions/' + key + '/payee').set(payee[0] ? payee[0] : null)
        this.setState({ payee: r })
    }
    intChanged = (e, i, cur) => {
        let r = this.state.transactions;
        r[i].interest = e.target.value;
        this.setState({ transactions: r })
        const db = firebase.database()
        db.ref('transactions/' + cur.key + '/interest').set(e.target.value)
    }
    verify(cur) {
        const db = firebase.database();
        const con = confirm('You are about to verify this investment');
        if (con) db.ref('transactions/' + cur.key + '/status').set({
            verified: true,
            date: Date.now()
        }).then(() => {
            db.ref('users/' + cur.uid + '/notifications').push({
                date: Date.now(),
                title: 'Your investment of ' + formatter.format(cur.amount) + ' is now active <br/> Thank you for investing with us',
                href: "/transactions"
            });


        });
    }
    decline(cur) {
        const db = firebase.database();
        const m = prompt('Add a decline message');
        if (m) db.ref('transactions/' + cur.key + '/status').set({
            verified: false,
            message: m
        }).then(() => {
            db.ref('users/' + cur.uid + '/notifications').push({
                date: Date.now(),
                title: 'Your proof of payment of ' + formatter.format(cur.amount) + ' was not approved because of the following reasons <br/>' + m,
                href: "/transactions"
            });
        });
    }

    render() {
        return <Layout route="Transactions">
            {this.state.loading ? <div style={{ height: '50vh' }}> <Spinner /></div> : <div className="py-3 container-fluid">
                {this.state.transactions.map((cur, i) => cur.proof && <div key={cur.key} id={cur.date + 'Modal'} className="modal fade" tabindex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Investment by {cur.username}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Amount : {formatter.format(cur.amount)} <br />
                                    Uploaded: {dateFormat(cur.proof.date)}
                                </p>
                                <p>
                                    <b>Bank Details for {cur.payee.username.toUpperCase()}</b><br />
                                    Bank Name : {cur.payee.bankDetails.bank} <br />
                                    Account Name : {cur.payee.bankDetails.name}<br />
                                    Account No : {cur.payee.bankDetails.num}
                                </p>
                                <img className="img-fluid" src={cur.proof.img} alt="" />
                            </div>
                            {cur.status.verified !== true && <div className="modal-footer">
                                <button data-dismiss="modal" onClick={() => this.verify(cur)} type="button" className="btn btn-primary">Verify</button>
                                <button data-dismiss="modal" onClick={() => this.decline(cur)} type="button" className="btn btn-secondary">Decline</button>
                            </div>}
                        </div>
                    </div>
                </div>)}
                <div className="card shadow border-0 mb-4">
                    <div className="card-header py-3 border-0">
                        <h6 className="m-0 font-weight-bold text-capitalize text-primary">Transactions List</h6>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className='table table-hover table-bordered' id="trans">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Username</th>
                                        <th scope="col">User id</th>
                                        <th>Amount</th>
                                        <th>Pay to</th>
                                        <th>Status</th>
                                        <th>Interest</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody className="table-sm">
                                    {this.state.transactions.map((cur, i) => (
                                        <tr key={cur.key}>
                                            <th scope="row">{i + 1}</th>
                                            <td className="text-capitalize" >{cur.username}
                                                {cur.admin && <small className="text-warning d-block">Admin</small>}
                                            </td>
                                            <td>{cur.uid.substring(0, 6)}</td>
                                            <td>
                                                {formatter.format(cur.amount)} <br />
                                                {cur.proof && <button data-target={"#" + cur.date + "Modal"} data-toggle="modal" className={"btn btn-sm btn-" + (cur.status.verified === true ? 'outline-' : '') + "primary"}>View payment evidence </button>}
                                            </td>
                                            <td>
                                                <select value={cur.payee.uid} className="text-capitalize form-control-sm form-control " onChange={(e) => this.payeeChanged(e, i, cur.key, cur.uid)}>
                                                    <option value="" >Assign user</option>
                                                    {this.state.users.map((curr) => <option key={curr.uid} value={curr.uid} >
                                                        {curr.username}
                                                    </option>)}
                                                </select>
                                            </td>
                                            <td>
                                                {cur.status.verified === true && <span className="text-success">Verified</span>}
                                                {cur.status.verified === 'retry' && <span className="text-warning">Retried  {dateFormat(cur.status.date)} </span>}
                                                {cur.status.verified === false && <span className="text-danger">Not verified </span>}
                                            </td>
                                            <td>
                                                <input onChange={(e) => this.intChanged(e, i, cur)} value={cur.interest} disabled={!cur.status.verified} type="number" className="form-control-sm form-control" style={{ width: '6rem' }} />
                                            </td>
                                            <td>
                                                {dateFormat(cur.date)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            }
            <style jsx>{`
                table td {
                    font-size : .9rem;
                }
                 .shadow {
            box-shadow: 0 .15rem 1.75rem 0 rgba(58,59,69,.15)!important;
            }
            `}</style>
        </Layout>
    }
}

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2
})

export default TransAdmin