import React, { Component } from 'react';
import Layout from '../../components/layout/backend';
import Spinner from '../../components/UI/Spinner/Spinner'
import firebase from '../../firebase';
import Router from 'next/router'
import 'firebase/database';
import dateFormat from '../../components/date';




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
                    ...s.val()[key], key,
                }
                if (!d.payee) d.payee = {
                    uid: ''
                };
                u.push(d);
            }
            const $ = require('jquery')
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
    payeeChanged = (e, i, key) => {
        let r = this.state.transactions;
        r[i].payee = e.target.value;
        let payee = this.state.users.filter(cur => cur.uid === e.target.value);
        firebase.database().ref('transactions/' + key + '/payee').set(payee[0] ? payee[0] : null)
        this.setState({ payee: r })
    }

    render() {
        return <Layout route="Transactions">
            {this.state.loading ? <div style={{ height: '50vh' }}> <Spinner /></div> : <div className="py-3 container">

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
                                                {formatter.format(cur.amount)}
                                            </td>
                                            <td>
                                                <select value={cur.payee.uid} className="text-capitalize form-control-sm form-control " onChange={(e) => this.payeeChanged(e, i, cur.key)}>
                                                    <option value="" >Assign user</option>
                                                    {this.state.users.map((curr) => <option key={curr.uid} value={curr.uid} >
                                                        {curr.username}
                                                    </option>)}
                                                </select>
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