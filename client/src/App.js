import { useSelector } from 'react-redux';

import WeatherMain from './features/WeatherMain';
import reportWebVitals from './reportWebVitals';

function App() {
  const activeLocation = useSelector(state => state.weather.activeLocation);

  let content;
  if (activeLocation === '') {
    content = <div>choose a location</div>;
  } else {
    content = <WeatherMain />;
  }
  return <>{content}</>;
}

export default App;

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
