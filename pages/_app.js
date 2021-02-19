import { Provider as StoreProvider } from "react-redux";
import Layout from "./_layout"
import store from '../store'

import styles from '../styles/main.scss'

export default function App({ Component, pageProps }) {

  return (
    <div>
      <StoreProvider store={store}>
        <Layout Component={Component} pageProps={pageProps}/>
        {/* WARNING: used to be {...pageProps}, look for weird behaviour prop related*/}
      </StoreProvider>
    </div>
  )
}