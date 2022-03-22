import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import WeatherMain from './features/WeatherMain';
import reportWebVitals from './reportWebVitals';

function App() {
  const router = useRouter();
  const activeLocation = useSelector(state => state.weather.activeLocation);

  let content = <div>Loading...</div>;

  useEffect(() => {
    if (activeLocation === '') {
      router.push('/locations');
    }
  }, [activeLocation, router]);

  if (activeLocation !== '') {
    content = <WeatherMain />;
  }
  return <>{content}</>;
}

export default App;

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
