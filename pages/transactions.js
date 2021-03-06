import React from 'react';
import firebase from '../firebase';
import 'firebase/database';
import 'firebase/storage'
import Link from 'next/link'
import Layout from '../components/layout/appLayout';
import Spinner from '../components/UI/Spinner/Spinner';
import $ from 'jquery';
import dateFormat from '../components/date'

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2
})

export default class Transactions extends React.Component {
    state = {
        userData: {},
        investments: [],
        pending: {
            status: {}
        },
        progBarLength: 0,
        loading: false,
        error: null,
        activated: false
    }
    componentDidMount() {
        this.checkStatus()
    }
    checkStatus = () => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({
                    userData: {
                        uid: user.uid,
                        username: user.username
                    }
                })
                const db = firebase.database();
                db.ref('users/' + user.uid).on('value', s => {
                    this.getTrans();
                    if (s.val().activated === true) this.setState({ activated: true });
                    let p = s.val().pendingInvestment
                    if (p) {
                        db.ref('transactions/' + p).on('value', snap => {
                            this.setState({
                                pending: {
                                    status: {},
                                    ...snap.val(),
                                    id: p
                                }
                            });

                        });
                    } else {
                        this.setState({ pending: { status: {} } })
                    }
                })
            }
        })
    }
    getTrans = () => {
        require('datatables.net-bs4');
        this.setState({ loading: true });
        firebase.database().ref('transactions').orderByChild('uid').equalTo(this.state.userData.uid).on('value', s => {
            const t = [];
            for (let key in s.val()) {
                let data = {
                    interest: 0,
                    cashout: {},
                    status: {},
                    ...s.val()[key],
                    key
                }

                if (data.status.verified === false) {
                    this.setState({
                        error: <span>Your payment was not approved because of the following reasons : <br /> <b>{data.status.message}</b> <br />
                            <button onClick={this.openModal} className="btn btn-primary btn-sm"  >Retry</button>
                        </span>
                    })
                }
                if (data.status.verified === true) t.push(data)
            }
            this.setState({ loading: false, investments: t.reverse() });
            $(document).ready(function () {
                $('#transTable').DataTable({
                    "pageLength": 5,
                    retrieve: true,
                    "lengthMenu": [[5, 10, 50, -1], [5, 10, 50, "All"]]
                });
            });
        });
    }
    openModal = () => {
        require('bootstrap/dist/js/bootstrap.bundle')
        $('#uploadModal').modal({
            keyboard: false,
            backdrop: 'static'
        })
    }
    upload = () => {
        let storageRef = firebase.storage().ref("investment");
        const f = document.createElement('input');
        f.type = 'file';
        f.accept = 'image/*'
        f.click();
        f.onchange = (e) => {
            const file = e.target.files[0];
            console.log(file)
            if (file.size > 1000000) {
                alert("File size too large");
            } else {
                const uploadTask = storageRef.child(file.name).put(file);
                uploadTask.on(
                    firebase.storage.TaskEvent.STATE_CHANGED,
                    (snapshot) => {
                        this.setState({
                            uploading: true,
                            fileName: file.name,
                            fileSize: (snapshot.totalBytes / 1000000).toFixed(2) + " mb",
                        });
                        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        var progressMessage = "Upload is " + Math.floor(progress) + "% Done.";
                        this.setState({
                            progressMessage: progressMessage,
                            progBarLength: progress,
                        });
                        switch (snapshot.state) {
                            case firebase.storage.TaskState.PAUSED: // or 'paused'
                                console.log("Upload is paused");
                                this.setState({ progressMessage: "Upload is paused" });
                                break;
                            case firebase.storage.TaskState.RUNNING: // or 'running'
                                break;
                            default:
                                break;
                        }
                    },
                    (error) => {
                        this.setState({ uploading: false });
                        switch (error.code) {
                            case "storage/unauthorized":
                                // User doesn't have permission to access the object
                                this.setState({
                                    error: "You don't have permission to access the object",
                                });
                                break;
                            case "storage/canceled":
                                this.setState({ error: "Upload canceled" });
                                break;
                            case "storage/unknown":
                                this.setState({ error: "Unknown error occurred" });
                                // Unknown error occurred, inspect error.serverResponse
                                break;
                            default:
                                this.setState({ error: "Unknown error occurred" });
                                break;
                        }
                    },
                    () => {
                        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                            if (this.state.error) {
                                firebase.database().ref('transactions/' + this.state.pending.id + '/status').set({
                                    verified: 'retry',
                                    date: Date.now()
                                })
                            }
                            this.setState({
                                uploading: false,
                                progressMessage: null,
                                error: null,
                            });

                            firebase.database().ref('transactions/' + this.state.pending.id + '/proof').set({
                                img: url,
                                date: Date.now()
                            }).then(() => {
                                $('#uploadModal').modal('hide')
                            })
                        });
                    }
                );
            }
        }

    };
    cashOut(cur) {
        if (cur.interest > 0) {

            const con = confirm('You are about to cashout your investment of ' + cur.amount + '\n Interest: ' + cur.interest + '\n This acction is not reversible \n Click ok to continue');
            if (con) {
                const db = firebase.database();
                db.ref('transactions/' + cur.key + '/cashout').set({
                    date: Date.now(),
                    status: 'requested'
                })
            }
        } else {
            alert('You cannot cash-out until the allocated time of investment in your investment plan')
        }

    }
    reInvest(cur) {

    }
    render() {

        return (
            <Layout route="Transactions">
                {this.state.error && <div className="alert alert-danger">{this.state.error}</div>}
                <div className="modal fade" id="uploadModal" tabindex="-1" role="dialog" aria-labelledby="uploadModalTitle" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="uploadModalTitle">Upload an Evidence of payment</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>The image should be legible and not more than 1 MB</p>
                                {this.state.uploading ? <div
                                    className="p-2 w-100"
                                    style={{ boxShadow: "0 5px 10px rgba(0,0,0,.15)" }}
                                >
                                    <div className="d-flex justify-content-between">
                                        <span style={{ fontSize: ".8rem", color: "#000" }}>
                                            {this.state.fileName}
                                        </span>
                                        <span style={{ fontSize: ".8rem", color: "#000" }}>
                                            {this.state.fileSize}
                                        </span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <span
                                            className="spinner-border mr-3 text-muted"
                                            style={{ height: "15px", width: "15px" }}
                                        ></span>
                                        <div className='progBar'>
                                            <span style={{ width: this.state.progBarLength + '%' }} ></span>
                                        </div>
                                    </div>
                                    <span style={{ fontSize: ".8rem", color: "#05a" }}>
                                        {this.state.progressMessage}
                                    </span>
                                </div> : <button onClick={this.upload} className="btn btn-outline-warning">
                                        <i className="fa fa-upload "></i>
                                            Select image</button>}
                            </div>
                        </div>
                    </div>
                </div>

                {this.state.loading ? <div style={{ height: '50vh' }}>
                    <Spinner />
                </div> : !this.state.activated ? <p>Activate your account to start investment </p> : <React.Fragment>

                    {this.state.pending.status.verified === true ? null : this.state.pending.amount && <div className="alert alert-info shadow-sm">
                        {this.state.pending.proof ? <React.Fragment>
                            Your  proof of payment has been uploaded successfully <br /> The system will verify your payment and complete your investment. Check back for more info
                                               <a href={this.state.pending.proof.img} target="blank" className="btn btn-sm mt-2 btn-success">View photo</a>
                        </React.Fragment>
                            : <React.Fragment>To complete your investment of <b>{formatter.format(this.state.pending.amount)}</b> , you are to pay to citrine rewards <br />(Account Details on your dashboard)
                                <br />
                                Once payment is complete , Click on i've paid button below and upload your evidence of payment to verify your payment. Once payment is verified by the system , it will reflect in the table below. <br />
                                <button className="btn btn-info btn-sm mt-2" onClick={this.openModal} >I've Paid</button>

                            </React.Fragment>}
                    </div>}
                    <div className="card border-0 shadow">
                        <div className="card-header border-0 justify-content-between d-flex">
                            <span className=' text-capitalize text-primary' >investments</span>
                            <Link href="/invest">
                                <a className="btn btn-success btn-sm">
                                    <i className="fal mr-2 fa-receipt "></i>
                                        New Investment</a>
                            </Link>
                        </div>
                        <div className="card-body ">
                            <div className="table-responsive">
                                <table className="table table-borderless table-striped" id="transTable">
                                    <thead>
                                        <tr>
                                            <th  >#</th>
                                            <th>Amount</th>
                                            <th>Date</th>
                                            <th>Interest</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.investments.map((cur, i) => <tr>
                                            <td className="th" >{i + 1}</td>
                                            <td>{formatter.format(cur.amount)} <br />
                                                {cur.cashout.status === 'requested' ? <span className="badge badge-warning" >Processing Cash-out</span> : cur.cashout.status === 'cashedOut' ? <span className="badge badge-secondary" >Cashed - out</span> : <span className="badge badge-primary" >Active</span>}
                                            </td>
                                            <td>{dateFormat(cur.status.date)}</td>
                                            <td>{formatter.format(cur.interest)}</td>
                                            <td className="d-flex">
                                                <button disabled={cur.cashout.status && true} onClick={() => this.cashOut(cur)} className="btn-danger btn btn-sm ">Cash-Out</button>
                                                <button disabled={cur.cashout.status && true} onClick={() => this.reInvest(cur)} className="btn ml-2 btn-sm btn-secondary">Re-Invest</button>
                                            </td>
                                        </tr>)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </React.Fragment>}
                <style jsx >{`
      
            
            .progBar {
  height: 3px;
  background: #eee;
  margin: 0.8rem 0;
  flex: 1;
}
.table td {
    min-width : 100px;
}
.th{
    min-width : 10px !important;
}
.progBar span {
  background: #282;
  display: block;
  height: 100%;
}
.btn {
    white-space: nowrap;
}
        `}</style>
            </Layout>
        )
    }
}