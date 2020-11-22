import React, { Component } from 'react';
import Layout from '../../components/layout/backend';
import Spinner from '../../components/UI/Spinner/Spinner'
import firebase from '../../firebase';
import Router from 'next/router'
import 'firebase/database';
import dateFormat from '../../components/date';
import $ from 'jquery';

class TransAdmin extends Component {

    state = {
        transactions: [],
    }
    componentDidMount() {
        this.getTrans();
        require('bootstrap')
        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        })
    }
    getTrans() {
        this.setState({ loading: true });
        firebase.database().ref('transactions').on('value', s => {
            const u = [];
            for (let key in s.val()) {
                let d = {
                    cashout: {},
                    interest: 0,
                    status: {
                        req: 'true'
                    },
                    ...s.val()[key], key,
                }
                if (d.status.verified == true) d.priority = 1
                if (d.status.req) d.priority = 2;
                if (d.cashout.status) d.priority = 3
                if (d.cashout.status === 'cashedOut') d.priority = 0

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
            db.ref('users/' + cur.uid + '/pendingInvestment').remove();
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
    cashOut(cur) {
        const m = confirm('You are about to confirm cash out for this investment');
        if (m) {
            const db = firebase.database();
            db.ref('transactions/' + cur.key + '/cashout').set({
                status: 'cashedOut',
                date: Date.now()
            })
        }
    }
    render() {
        let t = this.state.transactions;
        t.sort((b, a) => a.priority - b.priority)
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
                                        <th scope="col">User info</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Interest</th>
                                        <th>Date</th>
                                        <th>Controls</th>
                                    </tr>
                                </thead>
                                <tbody className="table-sm">
                                    {this.state.transactions.map((cur, i) => (
                                        <tr key={cur.key}>
                                            <th scope="row">{i + 1}</th>
                                            <td className="text-capitalize" >{cur.username}<br />
                                                <span className="badge badge-info" >User id:</span> <small>{cur.uid.substring(0, 6)}</small>
                                            </td>
                                            <td>
                                                {formatter.format(cur.amount)} <br />
                                                {cur.proof && <button data-target={"#" + cur.date + "Modal"} data-toggle="modal" style={{ fontSize: '.7rem' }} className={"btn btn-sm btn-" + (cur.status.verified === true ? 'outline-' : '') + "primary"}>View payment evidence </button>}
                                            </td>

                                            <td>

                                                {cur.cashout.status === 'cashedOut' && <div>
                                                    <span className="badge badge-dark">Cashed Out
                                                  </span> <br />
                                                    <small>{dateFormat(cur.cashout.date)}</small>
                                                </div>}
                                                {cur.cashout.status === 'requested' && <div>
                                                    <span className="badge badge-warning">Requesting cash-out
                                                  </span> <br />
                                                    <small>{dateFormat(cur.cashout.date)}</small>
                                                </div>}
                                                {(cur.status.verified === true && !cur.cashout.status) && <div>
                                                    <span className="badge badge-success">Verified
                                                  </span> <br />
                                                    <small>{dateFormat(cur.status.date)}</small>
                                                </div>}
                                                {cur.status.verified === 'retry' && <span className="badge badge-warning">Retried  {dateFormat(cur.status.date)} </span>}
                                                {cur.status.verified === false && <span className="badge badge-danger">Not verified </span>}
                                                {cur.status.req && <div>
                                                    <div className="badge badge-primary">Requested</div>
                                                </div>}
                                            </td>
                                            <td>
                                                <input onChange={(e) => this.intChanged(e, i, cur)} value={cur.interest} disabled={(!cur.status.verified || cur.cashout.status) && true} type="number" className="form-control-sm form-control" style={{ width: '6rem' }} />

                                            </td>
                                            <td>
                                                {dateFormat(cur.date)}
                                            </td>
                                            <td>
                                                <button data-toggle="tooltip" data-placement="left" className="btn btn-sm btn-danger mx-1" title="Delete transaction" >
                                                    <i className="fa fa-trash"></i>
                                                </button>
                                                {cur.cashout.status === 'requested' && <button onClick={() => this.cashOut(cur)} className="btn btn-secondary btn-sm mx-1" data-toggle="tooltip" data-placement="top" title="Cash out">
                                                    <i className="fa fa-check"></i>
                                                </button>}
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
                .btn {
                    font-size : .7rem;
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