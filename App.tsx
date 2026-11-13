import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { defaultGuide } from './src/photoguide/guide';
import { PhotoGuide } from './src/photoguide/PhotoGuide';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <PhotoGuide guide={defaultGuide} />
    </SafeAreaProvider>
  );
}
