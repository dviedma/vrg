import { Provider as StoreProvider } from "react-redux";

import store from '../store'

import CompositorUserMedia from '../components/media/CompositorUserMedia';
import Devices from '../components/media/Devices';

export default function App({ Component, pageProps }) {

  return (
    <StoreProvider store={store}>
      <CompositorUserMedia />
      <Devices />
      <Component {...pageProps} />
    </StoreProvider>
  )
}