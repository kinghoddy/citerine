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
            It’s super simple - Your signup process had been made easy.
            As soon as your payment is received, you will earn your first profit of 50% interest in 3 days and subsequent investments in 7 days using our unbeatable Investment Programme!
        </p>
          <a className="btn btn-outline-warning" href="#about" >Learn more {'-->'}</a>
        </div>
      </header>
      <section id="about" >
        <div className="container" >

          <h2 className="heading" >About</h2>
          <p>
            It’s super simple - Your signup process had been made easy. As soon as your payment is received, you will earn your first profit of 50% interest in 3 days and subsequent investments in 7 days using our unbeatable Investment Programme!
            It’s super simple - Your signup process had been made easy. As soon as your payment is received, you will earn your first profit of 50% interest in 3 days and subsequent investments in 7 days using our unbeatable Investment Programme!
        </p>
        </div>
      </section>
      <section className="bg-warning">
        <div className="container text-center" >
          <i className="fal fa-sign-in fa-5x text-light"></i>
          <h2 className="heading my-3" >We are waiting for you </h2>
          <Link href="/signup" >
            <a className="btn btn-lg rounded-pill px-4 btn-dark">Try citrine rewards Today  </a>
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
      `} </style>
    </Layout >
  }
}