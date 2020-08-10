import React from "react";

const Alert = props => {
  return (
    <div
      className={[
        "alert-dismissible my-3 fade alert alert-" + props.type,
        props.show ? "show" : null
      ].join(" ")}
      role="alert"
      style={{
        transition: "all 0.3s"
      }}
    >
      <button
        type="button"
        className="close"
        data-dismiss="alert"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
        <span className="sr-only">Close</span>
      </button>
      {props.children}
    </div>
  );
};

export default Alert;
