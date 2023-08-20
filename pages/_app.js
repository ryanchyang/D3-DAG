import '../src/styles/globals.css'
import '../src/styles/style.scss'
import '../src/assets/fonts/font.css'
import '../i18n'
import { Layout } from 'antd'
import { useState, useEffect } from 'react'

const { Header, Content, Footer } = Layout

export default function App({ Component, pageProps }) {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    if (theme && theme !== document.body.dataset.theme) {
      window.localStorage.setItem('theme', theme)
      document.body.dataset.theme = theme
    }
  }, [theme])

  // const logPageView = () => {
  //   console.log(`Logging pageview for ${window.location.pathname}`)
  //   ReactGA.set({ page: window.location.pathname })
  // }

  //! -------------------------get區開始
  //! -------------------------get區結束
  //! -------------------------handler區開始
  //! -------------------------handler區結束
  //! -------------------------modal區開始
  //! -------------------------modal區結束
  //! -------------------------post區開始
  //! -------------------------post區結束

  return (
    <>
      <Layout>
        {/* <MainHeader theme={theme} setTheme={setTheme} /> */}
        <Content>
          <Component theme={theme} {...pageProps} />
        </Content>
      </Layout>
    </>
  )
}
