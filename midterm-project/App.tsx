// App.tsx
import 'react-native-get-random-values';
import React from 'react';
import { RootNavigator } from './context/Navigation'; // Adjusted import path

const App: React.FC = () => {
  return <RootNavigator />;
};

export default App;