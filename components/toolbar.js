import React from 'react';
import Link from './UI/Link/link';
import firebase from '../firebase';
import 'firebase/auth';
import Router from 'next/router';


export default props => {
    const [userExists, setUserExists] = React.useState(false);

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            setUserExists(true)
        }
    })
    return < React.Fragment >
        {/* <nav className=" text-center text-light navTop py-2"  >
            <img src="https://kinghoddy.now.sh/logo.png" style={{ height: '50px' }} className="d-none d-md-block" />  <span className="text">Create Your professional website today at <a href="https://kinghoddy.now.sh" >kinghoddy</a></span>
            <a className="btn btn-sm btn-outline-warning" href="https://kinghoddy.now.sh" >Learn more</a>
        </nav> */}
        <nav id="nav" className={"toolbar fixed-top navbar-expand-lg navbar navbar-dark py-2 py-lg-0   px-3 px-md-5"}>
            <Link href="/">
                <a className="navbar-brand py-0">
                    <img alt="" src='/img/logo/logo_light_3.png' />
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
                <ul className="navbar-nav mx-auto  mt-2 mt-lg-0">
                    <li className="nav-item ">
                        <Link activeClassName="active" href="/">
                            <a className="nav-link">
                                <i className="fal fa-home mr-2"></i>
                                Home</a>
                        </Link>
                    </li>
                    <li className="nav-item ">

                        <Link activeClassName="active" href="#about">
                            <a onClick={e => {
                                e.preventDefault();
                                Router.push('/#about')
                            }} className="nav-link">About us </a>
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
                    <a className="btn btn-dark" >
                        <i className="fal fa-desktop mr-2"></i>
                        DashBoard</a>
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
            background : #e22;
        }
        .toolbar ul a {
            font-size : 1rem;
            color : #fff;
            font-weight : bold;
            padding : 1rem 1.5rem !important;
        }
        .toolbar ul a:hover,
        .active {
            color : #ff0 !important;
            background: #fc05;
        }
        .toolbar img {
            height : 3rem;
            transition : .3s;
            padding : 3px;
        }
        @media only screen and (min-width : 1200px){
          .toolbar{
            background : ${props.noBg ? 'none' : '#e22'};
        }
    .toolbar ul a:hover,
        .active {
            color : #ff0;
            background : none;
            border-bottom : 3px solid #fc0;
        }
            .toolbar img {
            height : ${props.noBg ? '6rem' : '3rem'};
            transition : .3s;
            padding :  ${props.noBg ? '10px' : '3px'}
        }
        }
    `} </style>
    </React.Fragment >
}