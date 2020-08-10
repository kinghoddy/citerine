import React from 'react';

import classes from './Spinner.module.css';

const spinner = (props) => (
    <div className={"h-100 wow fadeIn   w-100 d-flex flex-column align-items-center justify-content-center "}>
        <div className={"rounded-circle " + classes.spinner} style={{ ...props.style }}>
            <div style={{
                fontSize: props.fontSize
            }} className={classes.Loader}>Loading...</div>
        </div>
        {props.message ? <h4 className={props.size + " text-center"} style={{ paddingTop: "6rem" }}>{props.message}</h4> : ''}
    </div>
);

export default spinner;