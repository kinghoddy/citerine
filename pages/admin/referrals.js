import React, { Component } from 'react';
import Layout from '../../components/layout/backend';
import firebase from '../../firebase';
import 'firebase/database'
import date from '../../components/date';
import $ from 'jquery'

export default class Category extends Component {

    state = {
        refs: [],
        refCash: []
    }

    componentDidMount() {
        this.getRefs();
        this.getCash();
    }
    getCash = () => {
        firebase.database().ref('refCash').on('value', s => {
            const u = [];
            for (let key in s.val()) {
                u.push({
                    bonus: 0,
                    ...s.val()[key],
                    key
                })
            }
            this.setState({ refCash: u });
            require('datatables.net-bs4')
            $(document).ready(function () {
                $('#refCash').DataTable({
                    "pageLength": 5,
                    retrieve: true,
                    "lengthMenu": [[5, 10, 50, -1], [5, 10, 50, "All"]]
                });
            });
        });
    }
    getRefs = () => {
        firebase.database().ref('referrals').on('value', s => {
            const u = [];
            for (let key in s.val()) {
                u.push({
                    bonus: 0,
                    ...s.val()[key],
                    key
                })
            }
            this.setState({ refs: u });
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
    inputChanged = (e, i, cur) => {
        const f = this.state.refs;
        f[i].bonus = e.target.value;
        this.setState({ refs: f });
        const db = firebase.database();
        db.ref('referrals/' + cur.key + '/bonus').set(e.target.value)
    }
    cashout(cur) {
        const c = confirm('Click ok to proceed')
        if (c) {
            const db = firebase.database();
            db.ref('refCash/' + cur.key).set(null);
            db.ref('referrals/').orderByChild('referrer/uid').equalTo(cur.key).once('value', s => {
                for (let key in s.val()) {
                    db.ref('referrals/' + key + '/bonus').set(0);
                    db.ref('referrals/' + key + '/cashout').set(null);
                }
            })
            db.ref('users/' + cur.key + '/notifications').push({
                date: Date.now(),
                href: '/referrals',
                title: 'You have cashed out your bonus of ' + formatter.format(cur.amount) + '. The amount has been sent to your account  '
            })
        }
    }


    render() {
        return <Layout route='Activations'>
            < div className="container py-3" >
                <div className="card shadow border-0 mb-4">
                    <div className="card-header py-3 border-0">
                        <h6 className="m-0 font-weight-bold text-capitalize text-primary">Referral Bonus Cash-outs</h6>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className='table table-hover table-sm table-bordered' id="refCash">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">User</th>
                                        <th scope="col">Bank Details</th>
                                        <th scope="col">Amount</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.refCash.map((cur, i) => (
                                        <tr key={cur.key}>
                                            <th scope="row">{i + 1}</th>
                                            <td>
                                                <div className="font-weight-bold text-capitalize" >{cur.username}</div>
                                                <span className="badge badge-primary mr-2"  > User ID</span>
                                                {cur.key.substring(0, 6)}
                                            </td>
                                            <td>
                                                <div className="badge badge-secondary mr-2">Acc Num</div>  {cur.bankDetails.num}
                                                <div className="ml-2 badge badge-secondary mr-2">Acc Name</div>  {cur.bankDetails.name} <br />
                                                <div className="badge badge-secondary mr-2">Bank Name</div>  {cur.bankDetails.bank}
                                            </td>
                                            <td>
                                                {formatter.format(cur.amount)} <br />
                                                <button onClick={() => this.cashout(cur)} className="btn btn-sm btn-success"> Cash out</button>
                                            </td>
                                            <td>{date(cur.date)}</td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="card shadow border-0 mb-4">
                    <div className="card-header py-3 border-0">
                        <h6 className="m-0 font-weight-bold text-capitalize text-primary">List of referrals </h6>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className='table table-hover table-sm table-bordered' id="refsTable">
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
                                            <td>
                                                <input disabled={cur.cashout && true} onChange={(e) => this.inputChanged(e, i, cur)} type="number" value={cur.bonus} className="form-control form-control-sm" />
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
            </div >
            <style jsx global>{` 
            table th {
              font-family : arial;
              font-weight : 600;
            }
                   .form-control {
                    width : 7rem;
                }
            .shadow {
            box-shadow: 0 .15rem 1.75rem 0 rgba(58,59,69,.15)!important;
            }
            `}</style>
        </Layout >

    }

}
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2
})