import React from 'react';
import Wrapper from '../components/layout/appLayout';
import firebase from '../firebase';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage'
import Link from 'next/link';
import Card from '../components/card'
import Spinner from '../components/UI/Spinner/Spinner'
import $ from 'jquery';
import date from '../components/date'

class Dashboard extends React.Component {
    state = {
        userData: {
            username: '',
            profilePicture: ''
        },
        messages: [],

        progBarLength: 0,
        loading: false,
        nots: 0,
        ref: 0,
        activated: false
    }
    checkActivationState = () => {
        this.setState({ loading: true })
        firebase.auth().onAuthStateChanged(user => {

            if (user) {
                this.loadDash(user)
                const ref = firebase.database().ref('users/' + user.uid);
                ref.on('value', s => {
                    if (s.val().activated) {
                        let a = s.val().activated
                        if (a.declined) {
                            this.setState({
                                error: <span>Your payment was not approved because of the following reasons : <br /> <b>{a.declined}</b> <br />
                                    <button onClick={this.openModal} className="btn btn-primary btn-sm"  >Retry</button>
                                </span>
                            })
                        }
                        this.setState({ activated: a })


                    }
                    const userdata = { ...s.val(), uid: user.uid };
                    this.setState({ loading: false, userData: userdata })
                });
            }
        })
    }
    openModal = () => {
        require('bootstrap/dist/js/bootstrap.bundle')
        $('#uploadModal').modal({
            keyboard: false,
            backdrop: 'static'
        })
    }

    upload = () => {
        let storageRef = firebase.storage().ref("activations");
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
                                firebase.database().ref('activationReq/' + this.state.userData.uid + '/retry')
                                    .set(Date.now());
                            }
                            firebase.database().ref('users/' + this.state.userData.uid + '/activated').set({
                                img: url,
                                retry: this.state.error ? true : null
                            }).then(() => {
                                firebase.database().ref('activationReq/' + this.state.userData.uid + '/activated').set(url)
                                this.setState({
                                    uploading: false,
                                    progressMessage: null,
                                    error: null,
                                });
                            })
                            $('#uploadModal').modal('hide')
                        });
                    }
                );
            }
        }

    };
    componentDidMount() {
        this.checkActivationState();
        this.getMessages()
    }
    loadDash(user) {
        const db = firebase.database();
        db.ref('users/' + user.uid + '/notifications').orderByChild('seen').equalTo(null).on('value', s => {
            this.setState({ nots: s.numChildren() })
        })
        db.ref('referrals/').orderByChild('referrer/uid').equalTo(user.uid).on('value', s => {
            this.setState({ ref: s.numChildren() })
        })
    }
    getMessages = () => {
        firebase.database().ref('messages').limitToLast(2).on('value', s => {
            const m = []
            for (let key in s.val()) {
                m.push({
                    ...s.val()[key],
                    key
                })
            }
            this.setState({ messages: m.reverse() })
        })
    }
    render() {
        return (
            <Wrapper route="Dashboard">
                {this.state.error && <div className="alert alert-danger">{this.state.error}</div>}
                <div className="modal fade" id="proofModal" tabindex="-1" role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Proof of payment of activation fee </h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <img src={this.state.activated.img} alt="" className="img-fluid" />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
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
                {this.state.loading ? <div style={{ height: '50vh' }}> <Spinner /> </div> : <div >
                    <h3 className="hello" >Hello  {this.state.userData.username} </h3>
                    {this.state.activated.img && <div className="alert alert-success  shadow">
                        Your  proof of payment has been uploaded successfull <br /> The system will verify your payment and activate your account. Check back for more info
                                               <button type="button" className="btn mt-2 btn-success" data-toggle="modal" data-target="#proofModal">                        View photo</button>
                    </div>}
                    {this.state.activated === 'requested' && <React.Fragment>

                        <div className="alert alert-info shadow-sm">
                            After making this payment, Click on the <b>I've Paid</b> button and upload your Proof of Payment to notify the system that you have made this payment.
                            After confirmation, Your account will be activated and you can start your investment immediately.
                    </div>


                        <button onClick={this.openModal} className="btn btn-primary shadow-sm" >I've Paid</button>
                    </React.Fragment>}
                    {!this.state.activated && <div className="activate shadow">
                        <div className="pr-2">
                            <h2>Your account is not activated </h2>
                            <p>
                                You can activate your account now by clicking on the 'Activate my Account' button
                            </p>
                        </div>
                        <Link href="/activate">
                            <a className="btn btn-light btn-sm btn-block font-weight-bold text-uppercase ">
                                <i className="fal fa-sign-in mr-2  "></i>
                            Activate my account</a>
                        </Link>
                    </div>}
                    <div className="row mt-3 ">
                        <div className="col-md-6 mb-3 col-lg-4 ">
                            <Card title={'Your Earnings'} href='/transactions' theme={'orange'} body='#0.00' icon='fa-money-bill' />
                        </div>
                        <div className="col-md-6 mb-3 col-lg-4 ">
                            <Card title={'Investments'} href='/transactions' theme={'green'} body='#0.00' icon='fa-receipt' />
                        </div>
                        <div className="col-md-6 mb-3 col-lg-4 ">
                            <Card title={'Notifications'} href='/notifications' theme={'#28d'} body={this.state.nots} icon='fa-bell' />
                        </div>
                        <div className="col-md-6 mb-3 col-lg-4 ">
                            <Card title={'Referrals'} href='/referrals' theme={'#41a'} body={this.state.ref} icon='fa-share' />
                        </div>
                        <div className="col-md-6 mb-3 col-lg-4 ">
                            <Card title={'My Account'} href='/account' theme={'#c10'} body={this.state.activated === true ? 'Activated' : 'Not Activated'} icon='fa-user' />
                        </div>
                    </div>
                    <div className="alert shadow-sm alert-light">
                        Account Status <span className="ml-2 badge badge-primary">{this.state.activated === true ? 'Active' : 'Not active'}</span>
                    </div>
                    {this.state.messages.length > 0 && <div className="mt-4 pt-4" >
                        <h1 className="h4 mx-3 mb-4" style={{ fontWeight: '600' }} >Messages</h1>
                        {this.state.messages.map(cur => <div className="shadow-sm card mb-2">
                            <div className="card-header border-0">
                                <span className="text-capitalize text-primary mb-0">{cur.title}</span>
                            </div>
                            <div className="card-body">
                                <div style={{ fontSize: '.8rem' }} dangerouslySetInnerHTML={{ __html: cur.body }} ></div>

                                <small className="text-primary mt-2 d-block ">
                                    {date(cur.date)}
                                </small>
                            </div>
                        </div>)}
                    </div>}
                    <div className="row info">

                        <div className="col-lg-6">
                            <div className="alert alert-light shadow-sm text-center">
                                <h6>For any enquiries, contact us @ </h6>
                                <span className="text-warning">citrinerewards@gmail.com</span> <br />
                                <span className="text-warning">08089040350</span>

                            </div>
                        </div>
                        <div className="col-lg-6">

                            <div className="alert alert-light shadow-sm text-center">
                                <h6>All payments should be made to this account</h6>
                                <span className="text-warning" >Bank Name:</span> Citrine Bank <br />
                                <span className="text-warning" >Account Name:</span> Citrine Rewards <br />
                                <span className="text-warning" >Account Number:</span> 01245545264 <br />
                            </div>
                        </div>
                    </div>

                </div>
                }
                <style jsx>{`
                .activate {
                    background : orangered;
                    padding : 20px;
                    color : #fff;
                }
                .hello {
                    font-weight : 500; 
                    margin-bottom-30px;
                    color : #000;
                }
                .activate  h2 {
                    font-weight : 400;
                }
                .info {
                    margin-top : 2rem;
                }
.progBar {
                        height: 3px;
  background: #eee;
  margin: 0.8rem 0;
  flex: 1;
}

.progBar span {
                        background: #282;
  display: block;
  height: 100%;
}


                `}</style>
            </Wrapper >
        )
    }
}

export default Dashboard