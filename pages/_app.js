import { Provider as StoreProvider } from "react-redux";

import store from '../store'

export default function App({ Component, pageProps }) {

  return (
    <StoreProvider store={store}>
      <Component {...pageProps} />
    </StoreProvider>
  )
}