import React from 'react';
import Link from 'next/link'
export default props => {
    return <div className="wrapper shadow-sm">

        <div className="data" >
            <h5 className="text-uppercase">{props.title}</h5>
            <span>{props.body}</span>
        </div>
        <div className="flex-column d-flex align-items-center">
            <i className={`fa ${props.icon}`}></i>
            <Link href={props.href}>
                <a>Details</a>
            </Link>
        </div>

        <style jsx >{`
            .wrapper {
                background : #fff;
                border-left : 3px solid ${props.theme};
                border-radius : 4px;
                display : flex;
                justify-content : space-between;
                align-items : center;
                padding : 15px;
            }
            .data h5 {
                font-size : .9rem;
                margin-bottom : 4px;
                color : ${props.theme};
            }
            i {
                font-size : 30px;
                opacity : .4;
                color : ${props.theme}
            }
            a {
                font-size : 12px;
                color : ${props.theme}
            }
        `}</style>
    </div>
}