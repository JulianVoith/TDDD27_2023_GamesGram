import '@/styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import { FriendsProvider } from '../context/FriendsContext';

export default function App({ Component, pageProps }) {
  return (
    <FriendsProvider>
      <Component {...pageProps} />
    </FriendsProvider>
  );
}
