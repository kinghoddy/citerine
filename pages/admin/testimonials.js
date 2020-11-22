import React, { Component } from 'react';
import Layout from '../../components/layout/backend';
import firebase from '../../firebase';
import 'firebase/database'
import date from '../../components/date';
import $ from 'jquery'

export default class Testimonials extends Component {

    state = {
        testimonials: []
    }

    componentDidMount() {
        this.getTest()
    }
    getTest = (uid) => {
        firebase.database().ref('testimonials').on('value', s => {
            const p = [];
            for (let key in s.val()) {
                p.push({ ...s.val()[key], key })
            }
            this.setState({ testimonials: p.reverse() })
        })
    }
    delete(cur) {
        if (confirm('Click ok to continue')) {
            const db = firebase.database();
            db.ref('testimonials/' + cur.key + '/deleted').set(cur.deleted ? null : true)
        }
    }

    render() {
        return <Layout route='Testimonials '>
            <div className="container py-2">
                <div className="row">
                    {this.state.testimonials.map(cur => <div className="col-lg-6 mb-3">
                        <div className="shadow card">
                            <div className="card-header border-0 d-flex justify-content-between align-items-center">
                                <i className="fa fa-quote-left" />
                                <span className="mx-2 text-capitalize text-primary" >{cur.username}</span>
                                <button onClick={() => this.delete(cur)} className={"btn btn-sm  " + (cur.deleted ? 'btn-warning' : 'btn-danger')}>
                                    <i className="fal mr-2 fa-trash" />{cur.deleted ? 'Unhide' : 'Hide'}
                                </button>
                            </div>
                            <div className="card-body">
                                <div dangerouslySetInnerHTML={{ __html: cur.body }} ></div>

                                <small className="text-primary mt-2 d-block ">
                                    {date(cur.date)}
                                </small>
                            </div>
                        </div>
                    </div>)}
                </div>

            </div>
        </Layout>
    }

}
