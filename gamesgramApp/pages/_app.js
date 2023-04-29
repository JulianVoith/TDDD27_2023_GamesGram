import '@/styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import { Provider } from '../context/Context';

export default function App({ Component, pageProps }) {
  return (
    <Provider>
      <Component {...pageProps} />
    </Provider>
  );
}
