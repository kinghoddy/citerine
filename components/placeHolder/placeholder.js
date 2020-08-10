import React from 'react';
import classes from './placeholder.module.css'

export default props => {
    let p1 = []
    let p2 = []
    for (let i = 0; i < props.amount; i++) {
        p1.push(<div className="mb-4 wow fadeInUpBig" key={i}>
            <div className={classes.text + " border-bottom"}>
                <span className="w-25"></span>
            </div>
            <div className="d-flex py-2">
                <div className={classes.box}></div>
                <div className={classes.box}></div>
                <div className={classes.box}></div>
            </div>
        </div>)
    }
    for (let i = 0; i < props.amount; i++) {
        p2.push(<div key={i} className={classes.wrapper + " wow fadeInUp"}>
            <div className={classes.circle}></div>
            <div className={classes.text}>
                <span className="w-100"></span>
                <span className="w-75"></span>
            </div>
            <div className={classes.button}></div>
        </div>)
    }
    return (
        props.type === "p1" ? p1 : p2
    )
}