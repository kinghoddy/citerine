import React, { Component } from 'react';
import Layout from '../../components/layout/backend';
import firebase from '../../firebase';
import 'firebase/database'
import date from '../../components/date';
import $ from 'jquery'

export default class Messaging extends Component {

    state = {
        messages: [],
        form: {
            title: '',
            body: ''
        }
    }

    componentDidMount() {
        this.getMessages()
    }
    getMessages() {
        firebase.database().ref('messages').on('value', s => {
            const p = [];
            for (let key in s.val()) {
                p.push({ ...s.val()[key], key })
            }
            this.setState({ messages: p.reverse() })
        })
    }
    delete(cur) {
        if (confirm('Click ok to continue')) {
            const db = firebase.database();
            db.ref('messages/' + cur.key).remove()
        }
    }
    changed = (e, type) => {
        const f = { ...this.state.form }
        f[type] = e.target.value;
        this.setState({ form: f })
    }
    send = (e) => {
        e.preventDefault();
        const p = {
            ...this.state.form,
            body: this.state.form.body.split('\n').join('<br/>'),
            date: Date.now()
        }
        firebase.database().ref('messages').push(p).then(() => {
            this.setState({
                form: {
                    title: '', body: ''
                }
            })
        })
    }

    render() {
        return <Layout route='Messaging'>
            <div className="container py-2">
                <form className="py-3" onSubmit={this.send}>
                    <input onChange={e => this.changed(e, 'title')} value={this.state.form.title} required placeholder="Title" className="form-control form-control-sm mb-2" />
                    <textarea onChange={e => this.changed(e, 'body')} value={this.state.form.body} required placeholder="Body" rows="4" className="form-control mb-2 " />
                    <button className="btn btn-primary btn-sm">Send Message</button>
                </form>
                <div className="row">
                    {this.state.messages.map(cur => <div className="col-lg-6 mb-3">
                        <div className="shadow card">
                            <div className="card-header border-0 d-flex align-items-center justify-content-between ">
                                <span className="text-uppercase text-primary mb-0">{cur.title}</span>
                                <button onClick={() => this.delete(cur)} className="btn btn-sm btn-danger">
                                    <i className="fa fa-trash mr-2" />Delete
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
