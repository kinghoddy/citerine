import React, { Component } from 'react';
import Layout from '../../components/layout/backend';
import firebase from '../../firebase';
import 'firebase/database'
import date from '../../components/date';

export default class Category extends Component {

    state = {
        req: []
    }

    componentDidMount() {
        this.getReq();
    }

    getReq = () => {
        this.setState({ loading: true })
        firebase.database().ref('activationReq').on('value', s => {
            const r = [];
            for (let keys in s.val()) {
                let data = { ...s.val()[keys], uid: keys }
                data.key = keys
                if (!data.activated) data.activated = <span className="text-primary" >Requested</span>;
                else {
                    data.activated = <a href={data.activated} target="blank"> <img src={data.activated} alt="" style={{ height: '30px', width: '100px' }} /> </a>
                }
                if (!data.payee) data.payee = '';
                r.push(data)
            }
            const $ = require('jquery')
            require('datatables.net-bs4')
            $(document).ready(function () {
                $('#activations').DataTable({
                    "pageLength": 5,
                    retrieve: true,
                    "lengthMenu": [[5, 10, 50, -1], [5, 10, 50, "All"]]
                });
            });

            this.setState({ req: r.reverse(), loading: false })
        })
    }

    activate = (key) => {
        const db = firebase.database();
        let condition = confirm('You are about to activate this user');
        if (condition) {
            db.ref('users/' + key + '/activated').set(true).then(() => {
                db.ref('users/' + key + '/notifications').push({
                    title: 'Your account has been successfully activated',
                    date: Date.now()
                })
                db.ref('activationReq/' + key).remove()
            })
        }
    }
    decline = (cur) => {
        const db = firebase.database();
        const m = prompt('Add a decline message');
        if (m) db.ref('users/' + cur.uid + '/activated/declined').set(m).then(() => {

            db.ref('users/' + cur.uid + '/notifications').push({
                date: Date.now(),
                title: 'Your proof of payment of activation fee was not approved because of the following reasons <br/>' + m,
                href: "/dashboard"
            });
        });
    }

    render() {
        return <Layout route='Activations'>
            < div className="container py-3" >
                <div className="card shadow border-0 mb-4">
                    <div className="card-header py-3 border-0">
                        <h6 className="m-0 font-weight-bold text-capitalize text-primary">List of activations </h6>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className='table table-hover table-bordered' id="activations">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Username</th>
                                        <th scope="col">User id</th>

                                        <th>Status</th>
                                        <th>Control</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.req.map((cur, i) => (
                                        <tr key={cur.key}>
                                            <th scope="row">{i + 1}</th>
                                            <td className="text-capitalize" >{cur.username}</td>
                                            <td>{cur.uid.substring(0, 6)}</td>
                                            <td>
                                                {cur.retry && <small className="text-warning">
                                                    Retried {date(cur.retry)}
                                                </small>}
                                                {cur.activated}
                                            </td>
                                            <td className="d-flex">
                                                <button onClick={() => this.activate(cur.key)} className="btn btn-sm btn-success">Activate</button>
                                                <button onClick={() => this.decline(cur)} className="btn btn-sm btn-danger">Decline</button>
                                            </td>
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
            .shadow {
            box-shadow: 0 .15rem 1.75rem 0 rgba(58,59,69,.15)!important;
            }
            `}</style>
        </Layout >

    }
}