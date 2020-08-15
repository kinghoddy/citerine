import React from 'react';
import Layout from '../components/layout';
import Link from 'next/link'
import 'firebase/database';

export default class Home extends React.Component {
  state = {
  }

  render() {
    return <Layout title="Citrine rewards">
      <header>
        <div className="container header">
          <h1 className="title-lg  text-uppercase" >Citrine Rewards</h1>
          <div className="my-4">
            <Link href="signup"><a className="btn btn-primary mb-3 mb-md-0 btn-lg">Create an account</a></Link>
            <Link href="/login"><a className="btn btn-dark btn-lg">Login to your account</a></Link>
          </div>
          <p>
          </p>
          <a className="btn btn-outline-warning" href="#about" >Learn more {'-->'}</a>
        </div>
      </header>
      <section id="about" >
        <div className="container" >

          <h2 className="heading text-center" >About</h2>

          <div className="row py-4 text-center">
            <div className="col-lg-4">
              <div className="card border-0 shadow">
                <img src="/img/vault.jpg" className="card-img" />
                <div className="card-body">
                  <h5>Unlock your wealth</h5>
                  Citrine rewards helps you to save, plan and invest wisely in order to achieve your dreams gradually if you continue investing with us.
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card border-0 shadow">
                <img src="/img/money.jpeg" className="card-img" />
                <div className="card-body">
                  <h5>Let's make more money</h5>
                  You will get 50% (ROI) in 5 days or less on your first investment   subsequently 50% in your other investments.
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card border-0 shadow">
                <img src="/img/sky1.jpg" className="card-img" />
                <div className="card-body">
                  <h5>Cash out in just one click</h5>
                  We offer the best way to make deposit and withdraw money in and out of the system  by receiving the money directly into your bank account.

                </div>
              </div>
            </div>
          </div>

          <p>
            Our Goal is to help you make more money and not lose your money the way you lose it in the banks bit by bit
      </p>
        </div>
        <div className="d-flex justify-content-center">
          <button className="btn btn-outline-warning rounded-pill" >See more</button>
        </div>
      </section>
      <section id="go">
        <div className="container text-center" >
          <i className="fal fa-arrow-down fa-5x text-light"></i>
          <h2 className="heading my-3" >Let's Get Started </h2>
          <Link href="/signup" >
            <a className="btn btn-lg rounded-pill px-4 btn-dark">Invest now  </a>
          </Link>
        </div>
      </section>
      <style jsx > {`
        header {
          min-height : 40rem;
          display : flex;
          color : #fff;
          align-items : center;
          background : linear-gradient( #00000077 , #00000077 ) , url(/img/banner1.jpg);
          background-attachment : fixed;
          background-size : cover;
        }
        .heading {
              font-weight : 300 ;
          font-size : 3rem;
        }
        .title-lg {
          font-weight : 300 ;
          font-size : 4rem;
        }
        section {
          padding : 4rem 0;
        }
        .card-body {
          min-height : 9rem;
          font-size : .8rem;
        }
        .card-body h5 {
          font-size : 1rem;
          color : black;
          font-family : arial;
          font-weight : bold;
          text-transform : capitalize;
        }
        .card-img {
          height : 12rem;
          width : 100%;
          object-fit : cover;
        }
        #go {
          min-height : 80vh;
          background : linear-gradient(#0005 , #0005) , url(/img/sky2.jpg);
          background-size : cover;
          background-attachment : fixed;
          color : white;
          display : flex;
          align-items : center;
        }
      `}
      </style>
    </Layout >
  }
}