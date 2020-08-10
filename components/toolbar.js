import React from 'react';
import Link from './UI/Link/link';
import firebase from '../firebase';
import 'firebase/auth';


export default props => {
    const [userExists, setUserExists] = React.useState(false);

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            setUserExists(true)
        }
    })
    return < React.Fragment >
        <nav className=" text-center text-light navTop py-2"  >
            <img src="https://kinghoddy.now.sh/logo.png" style={{ height: '50px' }} className="d-none d-md-block" />  <span className="text">Create Your professional website today at <a href="https://kinghoddy.now.sh" >kinghoddy</a></span>
            <a className="btn btn-sm btn-outline-warning" href="https://kinghoddy.now.sh" >Learn more</a>
        </nav>
        <nav className={"toolbar sticky-top navbar-expand-lg navbar navbar-light py-3 px-3 px-md-5"}>
            <Link href="/">
                <a className="navbar-brand">
                    <img alt="" src='/logo_text.png' />
                    <span className="pl-3" >Citrine Rewards</span>
                </a>
            </Link>
            <button
                className="navbar-toggler d-lg-none"
                type="button"
                data-toggle="collapse"
                data-target="#navBar"
                aria-controls="navBar"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <i className="fa fa-bars"></i>
            </button>
            <div className="collapse navbar-collapse" id="navBar">
                <ul className="navbar-nav  mt-2 mt-lg-0">
                    <li className="nav-item ">
                        <Link activeClassName="active" href="/">
                            <a className="nav-link"> Home</a>
                        </Link>
                    </li>
                    <li className="nav-item ">

                        <Link activeClassName="active" href="/blog">
                            <a className="nav-link">About us </a>
                        </Link>
                    </li>
                    <li className="nav-item ">

                        <Link activeClassName="active" href="/#newsLetter">
                            <a className="nav-link">Rate</a>
                        </Link>
                    </li>
                    <li className="nav-item ">

                        <Link activeClassName="active" href="/#newsLetter">
                            <a className="nav-link">Support</a>
                        </Link>
                    </li>

                </ul>

                {userExists ? <Link href="/dashboard">
                    <a className="btn btn-dark mx-1 ml-auto" >DashBoard</a>
                </Link> : <div className="ml-auto d-flex  " >
                        <Link href="/login">
                            <a className="btn btn-dark mx-1 " >Login</a>
                        </Link>
                        <Link href="/signup">
                            <a className="btn btn-info mx-1" >Signup</a>
                        </Link>
                    </div>}
            </div>

        </nav>
        <style jsx>{`
        .navTop {
            background : #111;
            display : flex;
            align-items : center;
            justify-content : space-around;
        }
        .navTop .text {
            font-size : .8rem;
            display : block;
            width : 40%;
        }
        .toolbar{
            background : #ffffffaa;
            backdrop-filter :blur(2rem);
            box-shadow : 0 0px 8px rgba(0,0,0,.1)div>
        }
        .toolbar ul a {
            font-size : 1.2rem;
            padding : 1rem 1.5rem;
        }
        .toolbar img {
            height : ${props.noBg ? '6rem' : '3rem'};
            transition : .3s;
        }
        @media only screen and (min-width : 1200px){
        .toolbar ul a {
            padding : 0 1.5rem
        }
        }
    `} </style>
    </React.Fragment >
}