import React, { Component } from 'react';
import Layout from '../../components/layout/backend';
import firebase from '../../firebase';
import 'firebase/database'

export default class Category extends Component {

    state = {
        users: [],
        req: []
    }

    componentDidMount() {
        this.getReq();
        this.getUsers();
    }
    getUsers = () => {
        firebase.database().ref('users').once('value', s => {
            const u = [];
            for (let key in s.val()) {
                if (s.val()[key].activated === true) u.push({
                    ...s.val()[key],
                    uid: key
                })
            }
            this.setState({ users: u })
        });
    }
    getReq = () => {
        this.setState({ loading: true })
        firebase.database().ref('activationReq').on('value', s => {

            const r = [];
            for (let keys in s.val()) {
                let data = { ...s.val()[keys], uid: keys.substring(0, 6) }
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
    payeeChanged = (e, i, key) => {
        let r = this.state.req;
        r[i].payee = e.target.value;
        console.log(r);
        if (e.target.value) firebase.database().ref('users/' + key + '/activated').set('payee')
        firebase.database().ref('activationReq/' + key + '/payee').set(e.target.value)
        this.setState({ req: r })
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
    decline = () => {

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

                                        <th>Pay to</th>
                                        <th>Status</th>
                                        <th>Control</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.req.map((cur, i) => (
                                        <tr key={cur.key}>
                                            <th scope="row">{i + 1}</th>
                                            <td className="text-capitalize" >{cur.username}</td>
                                            <td>{cur.uid}</td>

                                            <td>
                                                <select value={cur.payee} className="form-control-sm form-control " onChange={(e) => this.payeeChanged(e, i, cur.key)}>
                                                    <option value="" >Assign user</option>
                                                    {this.state.users.map(cur => <option key={cur.uid} value={cur.uid} >
                                                        {cur.username}
                                                    </option>)}
                                                </select>
                                            </td>
                                            <td>{cur.activated}</td>
                                            <td className="d-flex">
                                                <button onClick={() => this.activate(cur.key)} className="btn btn-sm btn-success">Activate</button>
                                                <button onClick={() => this.decline(cur.key)} className="btn btn-sm btn-danger">Decline</button>
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