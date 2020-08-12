import React, { Component } from 'react';
import Layout from '../../components/layout/backend';
import Spinner from '../../components/UI/Spinner/Spinner'
import firebase from '../../firebase';
import Router from 'next/router'
import 'firebase/database';
export default class Npost extends Component {

    state = {
        users: []
    }

    componentDidMount() {
        this.getUsers()
    }
    getUsers() {
        this.setState({ loading: true });
        firebase.database().ref('users').on('value', s => {
            let u = [];
            for (let key in s.val()) {
                let d = {
                    ...s.val()[key], key,
                    uid: key.substring(0, 6)
                }
                if (d.activated === true) d.activated = <span className="text-success">Activated</span>
                else if (d.activated) d.activated = <span className="text-warning">In process</span>
                else d.activated = <span className="text-danger">Not Activated</span>
                u.push(d);
            }
            const $ = require('jquery')
            require('datatables.net-bs4')
            $(document).ready(function () {
                $('#users').DataTable({
                    "pageLength": 5,
                    retrieve: true,
                    "lengthMenu": [[5, 10, 50, -1], [5, 10, 50, "All"]]
                });
            });
            this.setState({ loading: false, users: u })
        })
    }


    render() {
        let u = this.state.users;
        u.sort((a, b) => b.phoneNumber - a.phoneNumber)
        return <Layout route="Users">
            {this.state.loading ? <div className="h-100"> <Spinner /></div> : <div className="py-3 container">

                <div className="card shadow border-0 mb-4">
                    <div className="card-header py-3 border-0">
                        <h6 className="m-0 font-weight-bold text-capitalize text-primary">List of Users </h6>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className='table table-hover table-bordered' id="users">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Username</th>
                                        <th scope="col">User id</th>
                                        <th>Phone</th>
                                        <th>Email</th>
                                        <th>Status</th>
                                        <th>Bank</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.users.map((cur, i) => (
                                        <tr key={cur.key}>
                                            <th scope="row">{i + 1}</th>
                                            <td className="text-capitalize" >{cur.username}
                                                {cur.admin && <small className="text-warning d-block">Admin</small>}
                                            </td>
                                            <td>{cur.uid}</td>

                                            <td>
                                                <a href={"tel:" + cur.phoneNumber}>  {cur.phoneNumber}</a>
                                            </td>
                                            <td>
                                                <a href={"mailto:" + cur.email}>  {cur.email}</a>
                                            </td>
                                            <td>{cur.activated}</td>
                                            <td>{cur.bankDetails ? <button className="btn btn-primary btn-sm">View</button> : 'N/A'}</td>
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
               .shadow {
            box-shadow: 0 .15rem 1.75rem 0 rgba(58,59,69,.15)!important;
            }
            `}</style>
        </Layout>
    }
}