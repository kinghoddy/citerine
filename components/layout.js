import React from 'react';
import Head from 'next/head';
import Toolbar from './toolbar';
import Footer from './footer'
export default props => {
    return <React.Fragment >
        <Head>
            <meta property="og:title" content={props.title ? props.title : 'Citrine Rewards | invest in your future'} />
            <meta property="og:description" content={props.body ? props.body : 'Welcome to citrine rewards .Unlock your wealth'} />
            <meta property="og:image" content="/favicon.png" />
            <meta name="theme-color" content="#d11" />
            <title>{props.title ? props.title : 'Citrine Rewards | invest in your future'} </title>
            <meta name="description" content={props.body ? props.body : 'Citrine rewards . Unlock your wealth'} />
        </Head>
        <Toolbar noBg={props.noBg} />
        <div className="body">
            {props.children}
        </div>
        <Footer />
        <style jsx>{`
        .body {
            min-height : 90vh;  
        }
        `}</style>
    </React.Fragment>
}