// import { useEffect } from 'react';
// import { useRouter } from 'next/router';
// import { useSelector } from 'react-redux';
import WeatherMain from './features/WeatherMain';
import reportWebVitals from './reportWebVitals';

function App() {
  // const router = useRouter();
  // const activeLocation = useSelector(state => state.weather.activeLocation);
  // const activeLocation = "30.0443879-31.2357257"; // Cairo, EG

  // let content = <div>Loading...</div>;

  // useEffect(() => {
  //   if (activeLocation === '') {
  //     router.push('/locations');
  //   }
  // }, [activeLocation, router]);

  // if (activeLocation !== '') {
  //   content = <WeatherMain />;
  // }
  return <WeatherMain />;
}

export default App;

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
