import Document, { Html, Head, Main, NextScript } from 'next/document'



class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html>
                <Head>
                    <link href="https://fonts.googleapis.com/css2?family=Chelsea+Market&family=Josefin+Sans:wght@400;700&family=Montserrat:wght@300;500;900&display=swap" rel="stylesheet"></link>
                    <link rel="stylesheet" href="/css/bootstrap.min.css" />
                    <link rel="stylesheet" href="/css/animate.min.css" />
                    <link rel="stylesheet" href="/iconfont/material-icons.css" />
                    <link rel="stylesheet" href="/fontawesome/css/fontawesome.min.css" />
                    <link rel="stylesheet" href="/fontawesome/css/all.min.css" />
                    <link rel="shortcut icon" href="/favicon.png" />
                    <link rel="stylesheet" href="/css/index.css" />
                    <script src="/js/wow.min.js"></script>
                    <script src="/js/bootstrap.min.js"></script>
                    <script src="/js/bootstrap.bundle.min.js"></script>
                    <script>
                        new WOW().init()
                    </script>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
                <script async src="https://static.addtoany.com/menu/page.js"></script>
            </Html>
        )
    }
}

export default MyDocument