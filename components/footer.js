import React from 'react';
import Link from 'next/link'
export default props => {
    return <footer>
        <div className="container ">
            <div className="row py-5 align-items-center">
                <div className="col-12 col-md-6 col-lg-3 mb-2">
                    <img className="w-75" src="/img/logo/logo_dark_1.png" alt="" />
                </div>
                <div className="col pt-4 pt-md-0">
                    <div className="row no-gutters">
                        <div className="col-12  col-lg-3 ">
                            <h4 className="mb-4">Quick Links</h4>
                            <ul>
                                <li>
                                    <Link href="/dashboard" >
                                        <a> Dashboard </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/account" >
                                        <a> My account </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/signup" >
                                        <a> Signup </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/login" >
                                        <a> Login </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/#contact" >
                                        <a> Referrals </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/#contact" >
                                        <a> Contact </a>
                                    </Link>
                                </li>


                            </ul>
                        </div>
                        <div className="col-12  col-lg-3 ">
                            <h4 className="mb-4">Contact</h4>
                            <ul>
                                <li className="my-2">
                                    <a href="mailto:sayoF4real@yahoo.com" className="d-flex align-items-center">
                                        <i className="fad fa-2x mr-4 fa-mail-bulk text-warning "></i>
                                        <span >citrinerewards@gmail.com</span>
                                    </a>
                                </li>
                                <li className="my-2">
                                    <a href="tel:08089040350" className="d-flex align-items-center">
                                        <i className="fad fa-2x mr-4 fa-phone-rotary text-warning"></i>
                                        <i className="fab fa-2x mr-4 fa-whatsapp text-success"></i>
                                        <span >09071567936</span>
                                    </a>
                                </li>

                            </ul>
                        </div>
                    </div>
                </div>

            </div>
            <div className="bottom row py-4 text-center border-top text-light">
                <div className="col-12 col-md-6 mb-3 mb-md-0">
                    <span></span>
                </div>
                <div className="col-12 col-md-6  text-light">
                    <span className="px-2" >Terms and conditions</span> |
                    <span className="px-2"> Privacy policy</span>
                </div>
            </div>
        </div>
        <style jsx>{`
        footer {
            background : #eee;
            color : var(--dark);
        }
        footer ul {
            list-style : none;
            padding : 0;
        }
        footer ul a {
            color : var(--dark);
        }
        .logo {
            width : auto;
            max-height : 50vh;
            display : block;
            margin : auto;
        }
        .bottom * {
            color : black;
        }
        `} </style>
    </footer>
}