import React from 'react';
export default props => {
    let children = props.children;
    let child = []
    for (let key in props.children) {
        child.push({ ...children[key] })
    }
    return props.type === 'folder' ? <div className={"con " + props.className}>
        {props.style === 'list' ? <i className="fal fa-angle-right faa-xs  pr-1"></i> : ''}
        <i className={`fa fa-folder ${props.style === 'list' ? 'fa-1x' : 'fa-3x'} `}></i>
        <span>{props.name}</span>

        <style jsx>{`
   .con {
       display : flex;
       flex-direction : ${props.style === 'list' ? 'row' : 'column'};
       width : 100%;
       align-items : center;
       justify-content : ${props.style === 'list' ? '' : 'center'} ;
       cursor : pointer;
       transition : .2s;
       padding : ${props.style === 'list' ? '3px 0 3px 10px' : ' '};
   }
   .fa-folder {
       color : #fe7;
   }
.con:hover{
    background : rgba(0,0,0,.1)
}
   .con span {
       padding-left : ${props.style === 'list' ? '6px' : ''};
       padding-bottom : ${props.style === 'list' ? '0px' : '6px'};
       font-size : 13px;   
    }
   `} </style>
    </div > : null
}