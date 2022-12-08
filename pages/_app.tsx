import '../styles/globals.css'
import HeaderComponent from '../components/HeaderComponent';
import FooterComponent from '../components/FooterComponent';
import { AppProps } from 'next/app';

const Layout = ({ children } : { children: React.ReactNode }) => <div className="layout">{children}</div>

export default function App({ Component, pageProps }:AppProps) {
  return (
    <Layout>
      <HeaderComponent />
      <Component {...pageProps} />
      <FooterComponent />
    </Layout>
  )
}