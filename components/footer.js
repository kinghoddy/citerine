import React from 'react';
import Link from 'next/link'
export default props => {
    return <footer>
        <div className="container ">
            <div className="row py-5 align-items-center">
                <div className="col-12 col-md-6 col-lg-3 mb-2">
                    {/* <img className="logo" src="/logo.png" alt="" /> */}
                </div>
                <div className="col pt-4 pt-md-0">
                    <div className="row no-gutters">

                        <div className="col-12  col-lg-3 mb-2">
                            <h4 className="mb-4">Quick Links</h4>
                            <ul>
                                <li>
                                    <Link href="/blog" >
                                        <a> Blog </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/blog" >
                                        <a> Poems </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/blog" >
                                        <a> Short stories </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/blog" >
                                        <a> Reviews </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/blog" >
                                        <a> Login </a>
                                    </Link>
                                </li>

                            </ul>
                        </div>
                        <div className="col-12  col-lg-3 mb-2">
                            <h4 className="mb-4">Contact</h4>
                            <ul>
                                <li className="my-2">
                                    <a href="mailto:sayoF4real@yahoo.com" className="d-flex align-items-center">
                                        <i className="fad fa-2x mr-4 fa-mail-bulk text-warning "></i>
                                        <span >sayoF4real@yahoo.com</span>
                                    </a>
                                </li>
                                <li className="my-2">
                                    <a href="tel:08089040350" className="d-flex align-items-center">
                                        <i className="fad fa-2x mr-4 fa-phone-rotary text-warning"></i>
                                        <span >08089040350</span>
                                    </a>
                                </li>
                                <li className="my-2">
                                    <a href="/" className="d-flex align-items-center">
                                        <i className="fad fa-2x  mr-4 fa-house-user text-warning "></i>
                                        <span >Ikorodu , Lagos , Nigeria</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
            <div className="bottom row py-4 text-center border-top text-light">
                <div className="col-12 col-md-6 mb-3 mb-md-0">
                    <span>This site is developed by Noel Odunmilade</span>
                </div>
                <div className="col-12 col-md-6  text-light">
                    <span className="px-2" >Terms and conditions</span> |
                    <span className="px-2"> Privacy policy</span>
                </div>
            </div>
        </div>
        <style jsx>{`
        footer {
            background : #222;
            color : white;
        }
        footer ul {
            list-style : none;
            padding : 0;
        }
        footer ul a {
            color : white;
        }
        .logo {
            width : auto;
            max-height : 50vh;
            display : block;
            margin : auto;
        }
        .bottom * {
            color : rgba(255,255,255,.8)
        }
        `} </style>
    </footer>
}