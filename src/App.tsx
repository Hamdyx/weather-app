import { ColorModeScript } from '@chakra-ui/react';
import WeatherMain from './features/WeatherMain';
import theme from './theme';

function App() {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <WeatherMain />;
    </>
  );
}

export default App;
