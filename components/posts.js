import React from 'react';
import dateformat from './date';
import Link from 'next/link'

export default props => {
    return (
        <div className="con mb-3">
            <span className="badge" >{props.category} </span>
            <img src={props.src} alt="" className="photo" />
            <h4 className="title mb-0 text-capitalize">{props.title}</h4>
            <small className=" py-3 text-muted">
                {dateformat(props.date)}
            </small>
            <p className="pt-3" dangerouslySetInnerHTML={{ __html: props.body.substring(0, 100) + '...' }} ></p>
            {/* <Link href={"/read?ref=" + props.pid}> */}

            <a href={"/read?ref=" + props.pid} className="btn-outline-primary btn btn-sm rounded-pill" >Read more --></a>
            {/* </Link> */}
            {style}
        </div>
    )
}

const style = <style jsx > {`
.con {
    width : 100%;
    box-shadow : 0 8px 15px rgba(0,0,0,.15);
    padding : 1rem;
    overflow : hidden;
    position : relative;
}
.photo {
    height : 100%;
    object-fit : cover;
    z-index : -1;
    display : block;
    transition:  .3s;
    width : 100%;
    position : absolute;
    top : 0;
    opacity : .5;
    left : 0;
}
.badge {
    background : linear-gradient(to right bottom , #d20 , #d07 );
    color : #fff;
    position : absolute ;
    font-weight : 4 00;
    padding : 5px 10px;
    margin : 10px;
    bottom : 0;
    right : 0;
    text-transform : uppercase;
}
.title { 
    background : #ffffffaa;
    padding : 0 10px
}
.con:hover .photo {
    filter: blur(10px);
    transform : scale(1.2);
    opacity : .3;
}
`}</style>