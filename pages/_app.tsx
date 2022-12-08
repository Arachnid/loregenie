import '../styles/globals.css'
import HeaderComponent from '../components/HeaderComponent';
import FooterComponent from '../components/FooterComponent';

const Layout = ({ children }) => <div className="layout">{children}</div>

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <HeaderComponent />
      <Component {...pageProps} />
      <FooterComponent />
    </Layout>
  )
}