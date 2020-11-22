import React from 'react'

export default function PriceCard(props) {
    return (
        <div className="con" >
            <header>
            </header>
            <span className="title" >{props.plan}</span>
            <ul>
                <li>
                    <small>Payment frequency</small>
                    <span>{props.freq}</span>
                </li>
                <li>
                    <small>Amount</small>
                    <span>{props.amount}</span>
                </li>
            </ul>
            <style jsx>{`
                .con {
                    box-shadow : 0 10px 20px #0005;
                    background : var(--white);
                    position : relative;
                }
                header {
                    height : 12rem;
                    background : linear-gradient(${props.theme} , ${props.theme}5 ), url(/img/sea.jpg);
                    background-size : cover;
                    clip-path : polygon(0 0, 100% 0, 100% 80% , 0 100% )
                }
                 .title {
                    background : ${props.theme};
                    text-transform : uppercase;
                    font-size : 20px;
                    color : #fff;
                    position : absolute;
                    top : 8rem;
                    padding : 5px 10px;
                    box-shadow : 0 3px 10px #000a;
                    right : 10px;
                }
                ul {
                    list-style : none;
                    padding : 0 10px;
                 }
                 li {
                     padding : 10px;
                     border-bottom : 1px solid #eee
                 }
                 small {
                     display : block;
                     font-weight : 600;
                     text-transform : uppercase;
                     color : #0005;
                     font-size : 12px;  
                 }
                 span {
                           display : block;
                     font-weight : 500;
                     text-transform : uppercase;
                     color : #000;
                 }
            `}</style>
        </div>
    )
}
