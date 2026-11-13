import { Platform, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, colors } from '../theme';
import type { CaptureMode, Guide } from '../types';

type Props = { guide: Guide; onStart: (mode: CaptureMode) => void };

export function StartScreen({ guide, onStart }: Props) {
  const required = guide.shots.filter((s) => s.required).length;
  // On the web the demo is the point; on a phone the camera is.
  const demoFirst = Platform.OS === 'web';

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Photo guide</Text>
        <Text style={styles.lead}>
          {guide.shots.length} shots in a fixed walk-around order, {required} of them required. An
          outline shows where the car should sit in each photo.
        </Text>
        <Button
          label={demoFirst ? 'Try the demo' : 'Start with camera'}
          variant="primary"
          onPress={() => onStart(demoFirst ? 'demo' : 'live')}
        />
        <Button
          label={demoFirst ? 'Use my camera' : 'Try the demo'}
          onPress={() => onStart(demoFirst ? 'live' : 'demo')}
        />
        <Text style={styles.note}>
          The demo uses sample scenes instead of the camera. Nothing is uploaded.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    maxWidth: 440,
    padding: 24,
    gap: 14,
  },
  title: { color: colors.text, fontSize: 30, fontWeight: '800' },
  lead: { color: colors.muted, fontSize: 16, lineHeight: 23, marginBottom: 8 },
  note: { color: colors.muted, fontSize: 13, lineHeight: 19 },
});
