import React from 'react';
export default props => {
    return <div className="wrapper">
        <img alt="" src={props.src} />
        <span>
            {props.title}
        </span>
        <style jsx> {`
           .wrapper {
               width : 100%;
               height : 18rem;
               box-shadow : 0 10px 30px rgba(0,0,0,.3);
               border-radius : 12px;
               overflow : hidden;
               background : #000;
               position : relative;
               display : flex;
               align-items : center;

           }
           .wrapper span {
               color : #fff;
               display : block;
               z-index : 100;
               font-weight : bold;
               font-size : 1.3rem;
               padding : 0 1rem;
           }
           .wrapper img {
               position : absolute;
               top : 0;
               left : 0;
               object-fit : cover;
               width : 100%;
               opacity : .5;
               height : 100%;
           }
       `}
        </style>
    </div>
}