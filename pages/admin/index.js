import React, { Component } from 'react'
import Layout from '../../components/layout/backend';
import firebase from '../../firebase';
import Link from 'next/link'
import 'firebase/database'
class index extends Component {
    state = {
        users: [],
        investments: 0,
        activations: 0
    }
    componentDidMount() {
        this.getUsers();
        firebase.database().ref('activationReq/').on('value', s => {
            let act = s.numChildren();
            this.setState({ activations: act })
        })
        firebase.database().ref('transactions/').on('value', s => {
            let act = s.numChildren();
            this.setState({ investments: act })
        })
    }

    getUsers = () => {
        this.setState({ loading: true });
        firebase.database().ref('users').on('value', s => {
            const u = [];
            for (let id in s.val()) {
                u.push({
                    ...s.val()[id],
                    uid: id
                })
            }
            this.setState({ loading: false, users: u })
        })
    }
    render() {
        return (
            <Layout route="Dashboard">
                <header className="text-light">
                    <div className="header">
                        <h2> <i className="fal fa-chart-line"></i> Dashboard</h2>
                        <p className="muted" >Example dashboard overview and content summary</p>
                    </div>
                </header>
                <section className="content" >
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6 col-lg-4">
                                <div className="Card">
                                    <div>
                                        <h4>Investments</h4>
                                        {this.state.investments}
                                    </div>
                                    <Link href="/admin/transactions" >
                                        <a>Details <i className="fal fa-arrow-right"></i> </a>
                                    </Link>
                                </div>
                            </div>

                            <div className="col-md-6 col-lg-4">
                                <div className="Card">
                                    <div>
                                        <h4>Users</h4>
                                        {this.state.users.length}
                                    </div>
                                    <Link href="/admin/users" >
                                        <a>Details <i className="fal fa-arrow-right"></i> </a>
                                    </Link>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-4">
                                <div className="Card">
                                    <div>
                                        <h4>Activations</h4>
                                        {this.state.activations}
                                    </div>
                                    <Link href="/admin/activation" >
                                        <a>Details <i className="fal fa-arrow-right"></i> </a>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <style jsx>{`
                  header {
                      background : linear-gradient(to right bottom ,orangered , orange);
                      min-height : 18rem;
                      padding : 3rem;
                  }
                  .header .muted {
                      color : #ffffff66
                  }
                  .content {
                      margin-top : -5rem;
                  }
                  .Card {
                     background : #fff;
                     border-left : 5px solid #259;
                     display : flex;
                     justify-content : space-between;
                     padding  20px;
                     box-shadow : 0 5px 5px rgba(0,0,0,.1);
                     border-radius : 9px;
                  }
                `}</style>
            </Layout>
        )
    }
}

export default index
