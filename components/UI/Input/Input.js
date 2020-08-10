import React from 'react';

import classes from './Input.module.css';

const input = (props) => {
    let inputElement = null;

    switch (props.elementType) {
        case ('input'):
            inputElement = <input
                className={"form-control "}
                {...props.elementConfig}
                value={props.value}
                id={props.id}
                onChange={props.changed} />;
            break;
        case ('checkbox'):
            inputElement = <input
                className={"custom-control-input "}
                id={props.id}
                type='checkbox'
                onChange={props.changed} />;
            break;
        case ('textarea'):
            inputElement = <textarea
                className="form-control"
                {...props.elementConfig}
                value={props.value}
                onChange={props.changed} />;
            break;
        case ('select'):
            inputElement = (
                <select
                    className="form-control"
                    value={props.value}
                    onChange={props.changed}>
                    {props.elementConfig.options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.displayValue}
                        </option>
                    ))}
                </select>
            );
            break;
        default:
            inputElement = <input
                {...props.elementConfig}
                value={props.value}
                className="form-control"
                onChange={props.changed} />;
    }
    var formGroup = null;
    if (props.elementType === 'checkbox') {
        formGroup = <div className={'custom-control custom-checkbox mb-3'}>
            {inputElement}
            <label htmlFor={props.id} className='custom-control-label' >{props.label}</label>
        </div>
    } else {
        formGroup = <div className={classes.formLabelGroup}>
            {inputElement}
            <label htmlFor={props.id} >{props.label}</label>
        </div>
    }
    return (
        <React.Fragment>
            {formGroup}
        </React.Fragment>
    );

};

export default input;