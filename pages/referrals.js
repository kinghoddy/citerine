import React from 'react';
import Wrapper from '../components/layout/appLayout';
import firebase from '../firebase';
import 'firebase/database';
import 'firebase/auth';
import Spinner from '../components/UI/Spinner/Spinner'

class Referrals extends React.Component {
    constructor(props) {
        super(props);
        this.refLink = React.createRef()
    }
    state = {
        userData: {
            username: '',
            uid: '',
            profilePicture: ''
        },
        loading: false,
        activated: false
    }
    copyRef = () => {
        this.refLink.current.select();
        try {
            document.execCommand("copy");
            alert('Referral link copied to clipboard');
        } catch {
            alert('Couldn\'t copy');
        }
    }
    checkActivationState = () => {
        this.setState({ loading: true })
        firebase.auth().onAuthStateChanged(user => {

            if (user) {
                const ref = firebase.database().ref('users/' + user.uid);
                ref.on('value', s => {
                    if (s.val().activated) {
                        this.setState({ activated: true })
                    }
                    const userdata = { ...s.val(), uid: user.uid };
                    this.setState({ loading: false, userData: userdata })
                });
            }
        })
    }
    componentDidMount() {
        this.checkActivationState()
    }
    render() {
        return (
            <Wrapper route="Dashboard">
                {this.state.loading ? <div style={{ height: '50vh' }}> <Spinner /> </div> : <div>
                    <h3 className="hello" >Hello  {this.state.userData.username} </h3>
                    <p>
                        Invite Your Friends And Earn Money. <br />
                        You will be credited with a 10% bonus on every investment your referred friends make. There are no limits to this.<br />
                        <br />
                        Refer up to <strong>10 Active Users </strong> and become a Guider.
                        <br />
                        <span> THE MORE YOUR FRIENDS INVEST, THE MORE REWARDS YOU RECEIVE.</span>
                    </p>
                    <h4 className="font-weight-light" >Bonus: <span className="text-success" >₦0.00</span> </h4>
                    <p>
                        You can invite friends through the following ways:
                    </p>
                    <ul>
                        <li>Send an email to your contacts with your referral link.</li>
                        <li>Send an SMS to your phone contacts with your referral link.</li>
                        <li>Share your referral link on your social networks.</li>
                        <li>Steps to become a friend referree:</li>
                    </ul>
                    <p>
                        Your friends click on your referral link.
                        </p>
                    <ul>
                        <li>Each of them fills the form and creates an account with the link.</li>
                        <li>The system permanently links them to you.</li>
                        <li>Your referral link</li>
                    </ul>
                    <h4>Your Referral Link</h4>
                    <div className="d-flex">
                        <input ref={this.refLink} className="form-control mx-3" value={'https://citrinerewards.vercel.app/signup?r=' + this.state.userData.uid} />
                        <button onClick={this.copyRef} className="btn btn-outline-primary" >Copy</button>
                    </div>
                </div >
                }
                <style jsx>{`
                .hello {
                    font-weight : 500; 
                    margin-bottom-30px;
                    color : #000;
                }

                `}</style>
            </Wrapper >
        )
    }
}

export default Referrals