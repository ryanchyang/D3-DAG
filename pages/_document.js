import { Html, Head, Main, NextScript } from 'next/document'

const themeInitializerScript = `
       (function () {
         document.body.dataset.theme = window.localStorage.getItem("theme") || "light";
      })();
  `

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* 這裡不能放title */}
        <meta property="og:title" content="whospay, scam, AML" key="title" />
        <meata property="og:description" content="whospay, scam, AML" />
      </Head>
      <body>
        <Main />
        <script dangerouslySetInnerHTML={{ __html: themeInitializerScript }} />
        <NextScript />
      </body>
    </Html>
  )
}
