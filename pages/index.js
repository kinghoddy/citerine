import React from 'react';
import Layout from '../components/layout';
import Link from 'next/link'
import 'firebase/database';
import firebase from '../firebase';
import date from '../components/date'
import PriceCard from '../components/priceCard';
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'NGN',
  minimumFractionDigits: 2
})
export default class Home extends React.Component {
  state = {
    noBg: false,
    testimonials: []
  }
  componentDidMount() {
    const checkScrolled = () => {
      if (document.documentElement.scrollTop > 50) {
        this.setState({ noBg: false })
      } else {
        this.setState({ noBg: true })
      }
    }
    checkScrolled();
    this.getTest()
    window.addEventListener('scroll', checkScrolled)
  }
  getTest = () => {
    firebase.database().ref('testimonials').orderByChild('deleted').equalTo(null).limitToLast(5).on('value', s => {
      const p = [];
      for (let key in s.val()) {
        p.push({ ...s.val()[key] })
      }
      this.setState({ testimonials: p.reverse() })
    })
  }
  render() {
    return <Layout noBg={this.state.noBg}>
      <header  >
        <div className="container overflow-hidden header text-right">
          <h1 className="title-lg  text-uppercase wow fadeInRight slow" >Citrine Rewards</h1>
          <div className="mt-4 wow fadeInUp delay-1s slow">
            <Link href="signup"><a className="btn btn-primary mb-3 mb-md-0 btn-lg">Create an account</a></Link>
            <Link href="/login"><a className="btn btn-dark btn-lg">Login to your account</a></Link>
          </div>
          <p className="my-2 wow fadeInUp delay-1s slower">
            Unlock your wealth
          </p>
          <a className="btn btn-outline-warning wow  fadeInUp delay-2s slow" href="#about" >Learn more {'-->'}</a>
        </div>
      </header>
      <section id="about" >
        <div className="container" >

          <h2 className="heading text-center" >About</h2>

          <div className="row py-4 text-center">
            <div className="wow fadeInUp col-lg-4">
              <div className="card border-0 shadow">
                <img src="/img/vault.jpg" className="card-img" />
                <div className="card-body">
                  <h5>Unlock your wealth</h5>
                  Our short term and long term investment plans help to unleash amazing benefits that helps you stay financially above
                  Citrine rewards helps you to save, plan and invest wisely in order to achieve your dreams gradually if you continue investing with us.
                </div>
              </div>
            </div>
            <div className="wow fadeInUp slow col-lg-4">
              <div className="card border-0 shadow">
                <img src="/img/money.jpeg" className="card-img" />
                <div className="card-body">
                  <h5>Let's make more money</h5>

                  You will get 50% (ROI) in 5 days or less on your first investment   subsequently 50% in your other investments in 7 days. Scroll down to learn more about <a href="#investments">our investment plans
                  </a>
                </div>
              </div>
            </div>
            <div className="wow fadeInUp slower col-lg-4">
              <div className="card border-0 shadow">
                <img src="/img/sky1.jpg" className="card-img" />
                <div className="card-body">
                  <h5>Cash out in just one click</h5>
                  We offer the best way to make deposit and withdraw money in and out of the system  by receiving the money directly into your bank account. Just in one click

                </div>
              </div>
            </div>
          </div>

          <div className="mb-2 text-center mx-auto wow fadeIn delay-1s" style={{ maxWidth: '28rem' }}>
            <i className="fal fa-4x fa-check-circle text-success mb-3" />
            <p className="" style={{ fontSize: '.8rem' }}>
              Our Goal is to help you make more money so that you can start living your life at your own pace from your earnings
      </p>
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <button className="btn btn-outline-warning rounded-pill" >See Investment plans</button>
        </div>
      </section>
      <section id="pricing" >
        <div className="container" >
          <h2 className="heading text-center text-light" >Investment Plans </h2>
          <div className="row" >
            <div className="col-md-6 col-lg-3" >
              <PriceCard plan="Spark plan" theme="#239" freq="daily" amount={formatter.format(200) + ' upward'} />
            </div>
            <div className="col-md-6 col-lg-3" >
              <PriceCard plan="Blaze plan" theme="#fa0" freq="Weekly" amount={formatter.format(500) + ' upward'} />
            </div>
            <div className="col-md-6 col-lg-3" >
              <PriceCard plan="Blaze plan" theme="#3a5" freq="Monthly" amount={formatter.format(1000) + ' upward'} />
            </div>
            <div className="col-md-6 col-lg-3" >
              <PriceCard plan="Blaze plan" theme="#f20" freq="Quarterly" amount={formatter.format(500) + ' upward'} />
            </div>
          </div>
        </div>
      </section>
      {this.state.testimonials.length > 0 && <section id="reviews" className="bg-warning">
        <div className="text-center">
          <h2 className="heading mb-0" >Testimonials </h2>
          <span className="text-primary">
            What our costumers say about us
          </span>
        </div>
        <div id="revCarousel" className="carousel slide mt-2" data-ride="carousel">
          <div className="carousel-inner">
            <div className="container" style={{ minHeight: '50vh' }} >
              {this.state.testimonials.map((cur, i) => <div className={"carousel-item " + (i === 0 ? 'active' : '')}>
                <div className="shadow card revCard">
                  <img className="card-img" src={cur.profilePicture} alt="" />
                  <div className="card-header border-0">
                    <i className="fa fa-quote-left" />
                    <span className="mx-2 text-capitalize text-danger" >{cur.username}</span>
                  </div>
                  <div className="card-body">
                    <div dangerouslySetInnerHTML={{ __html: cur.body }} ></div>

                    <small className="text-primary mt-2 d-block">
                      {date(cur.date)}
                    </small>
                  </div>
                </div>
              </div>)}

            </div>
          </div>
          <a className="carousel-control-prev" href="#revCarousel" role="button" data-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="sr-only">Previous</span>
          </a>
          <a className="carousel-control-next" href="#revCarousel" role="button" data-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="sr-only">Next</span>
          </a>
        </div>

      </section>}

      <section id="go">
        <div className="container text-center" >
          <i className="fal fa-arrow-down fa-5x text-light"></i>
          <h2 className="heading my-3" >Let's Get Started </h2>
          <Link href="/signup" >
            <a className="btn shadow btn-lg rounded-pill px-4 btn-dark">Invest Now  </a>
          </Link>
        </div>
      </section>
      <style jsx > {`
        header {
          min-height : 100vh;
          display : flex;
          color : #fff;
          align-items : center;
          background : linear-gradient(to right, #0000 , #000c ) , url(/img/tower.jpg) bottom;
          background-size : cover;
          padding-top : 5rem;
        }
        .heading {
              font-weight : 300 ;
          font-size : 3rem;
          position : relative
        }
        .heading::after {
          content : '';
          position : absolute;
          top : -10px;
          left : 50%;
          width : 10rem;
          height : 3px;
          background : #f70;
          transform : translateX(-50%);
        }
        .title-lg {
          font-weight : 300 ;
          font-size : 3rem;
        }
        section {
          padding : 4rem 0;
        }
        .card {
          margin-bottom : 2rem;
        }
        .card-body {
          min-height : 11rem;
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
        .revCard {
          width : 90%;
          margin : 0 auto;
          box-shadow : 0 5px 15px #0005;
          max-width : 35rem;
        }
        .revCard .card-img {
          position : absolute;
          height : 5rem;
          box-shadow : 0 5px 15px #0008;
          width : 5rem;
          left : 0;
          top : 50%;
          transform : translate(-50% , -50%);
          border-radius : 50%;
        }
        .revCard .card-body {
          display : flex ;
          justify-content : center;
          padding-left : 4rem;
          flex-direction : column
        }
        #pricing {
          background : #37a;
          padding : 5rem 0;
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
        @media only screen and (min-width : 760px){
          header {
          background-attachment : fixed;
          }
          .title-lg {
            font-size : 4rem;
          }
        }
      `}
      </style>
    </Layout >
  }
}