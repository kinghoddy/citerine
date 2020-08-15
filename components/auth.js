import Link from 'next/link'
import React from 'react';
import Footer from './footer'

export default props => {
  return (<React.Fragment>

    <div className="wrapper container-fluid">
      <div className="row" style={{ minHeight: '100vh' }} >
        <div className="form col-md-8 col-lg-6" >
          <img src="/img/logo/logo_dark_2.png" style={{ width: '25%' }} className="py-3" />
          {props.children}
        </div>
        <div className="col-md-4 col-lg-6" ></div>
      </div>
      <style jsx>{`
      .wrapper {
        background : url(/img/banner1.jpg);

        background-size : cover;
      }
      .form {
        background : #ffffffcc;
        display : flex;
        flex-direction : column;
        align-items : center;
        justify-content : center
      }
      `}</style>
    </div>
    <Footer />
  </React.Fragment>
  )
}