import React from 'react';
import Wrapper from '../components/layout/appLayout';
import firebase from '../firebase';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage'
import Link from 'next/link';
import Spinner from '../components/UI/Spinner/Spinner'

class Dashboard extends React.Component {
    state = {
        userData: {
            username: '',
            profilePicture: ''
        },
        pData: {
            bankDetails: {}
        },
        progBarLength: 0,
        loading: false,
        activated: false
    }
    checkActivationState = () => {
        this.setState({ loading: true })
        firebase.auth().onAuthStateChanged(user => {

            if (user) {
                const ref = firebase.database().ref('users/' + user.uid);
                ref.on('value', s => {
                    if (s.val().activated) {
                        let a = s.val().activated
                        this.setState({ activated: a })
                        if (a === 'payee') {
                            firebase.database().ref('activationReq/' + user.uid + '/payee').once('value', snap => {
                                firebase.database().ref('users/' + snap.val()).once('value', s => {
                                    console.log(snap.val());
                                    const pData = {
                                        username: s.val().username,
                                        uid: snap.val().substring(0, 6),
                                        bankDetails: s.val().bankDetails
                                    }
                                    this.setState({ pData: pData })
                                });
                            })
                        }

                    }
                    const userdata = { ...s.val(), uid: user.uid };
                    this.setState({ loading: false, userData: userdata })
                });
            }
        })
    }
    openModal = () => {
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
                            this.setState({
                                uploading: false,
                                progressMessage: null,
                                error: null,
                            });
                            firebase.database().ref('users/' + this.state.userData.uid + '/activated').set({
                                img: url
                            })
                            firebase.database().ref('activationReq/' + this.state.userData.uid + '/activated').set(url)
                        });
                    }
                );
            }
        }

    };
    componentDidMount() {
        this.checkActivationState()
    }
    render() {
        return (
            <Wrapper route="Dashboard">
                <div className="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLongTitle">Bank Details for user {this.state.pData.username} </h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <h6 className="mb-0" >Account Name</h6>
                                <p>{this.state.pData.bankDetails.name}</p>
                                <h6 className="mb-0" >Bank Name</h6>
                                <p>{this.state.pData.bankDetails.bank}</p>
                                <h6 className="mb-0">Account Number</h6>
                                <p>{this.state.pData.bankDetails.num}</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
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
                {this.state.loading ? <div style={{ height: '50vh' }}> <Spinner /> </div> : <div>
                    <h3 className="hello" >Hello  {this.state.userData.username} </h3>
                    {this.state.activated.img && <div className="alert alert-success  shadow">
                        Your  proof of payment has been uploaded successfull <br /> The system will verify your activation and activate your account. Check back fro more info
                                               <button type="button" className="btn mt-2 btn-success" data-toggle="modal" data-target="#proofModal">                        View photo</button>
                    </div>}
                    {this.state.activated === 'payee' && <React.Fragment>
                        <div className="alert alert-info shadow-sm">
                            You will be required to pay a one time Activation fee of ₦1,000.00 to another User on the system.<b>You are to make this payment within 24 hours. </b> </div>
                        <div className="alert alert-light shadow-sm">
                            Make payment of the exact amount to the User's account details. (This information is displayed below). You can make payment through bank transfer, bank deposit or internet banking. You will have to click on the 'View Bank Details' button to see these details.</div>
                        <div className="alert alert-info shadow-sm">
                            After making this payment, Click on the I've Paid button and upload your Proof of Payment to notify the system that you have made this payment.
                            Call the user through the phone number given to you for confirmation.
                            After confirmation, Your account will be activated and you can start your investment immediately.
                    </div>

                        <div className="alert alert-light shadow">
                            <p className="font-weight-bold mb-1">
                                You are to pay to :
                                 </p>
                            {this.state.pData.username ? <React.Fragment><p className="mb-0">
                                <span className="text-warning" >Username :</span>
                                <span className="px-2" >{this.state.pData.username}</span>
                            </p>
                                <p className="">
                                    <span className="text-warning" >UserId :</span>
                                    <span className="px-2" >{this.state.pData.uid}</span>

                                </p>
                                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                                    View Bank Details
</button>
                            </React.Fragment> : <div className="spinner-border"></div>}
                        </div>

                        <button onClick={this.openModal} className="btn btn-primary shadow-sm" >I've Paid</button>
                    </React.Fragment>}
                    {this.state.activated === 'requested' && <div className="alert alert-info shadow">
                        Your Request for activation is been processed. <br />
                        The system will assign user for you to pay to.
                        The account details of the user will be displayed on the dashboard.
                        You will be required to make the payment within 24 hours and <b>upload an evidence of payment </b> to complete your activation
                    </div>}
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
                    {this.state.activated === true && <React.Fragment>
                        Your account has been activated
                    </React.Fragment>}
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