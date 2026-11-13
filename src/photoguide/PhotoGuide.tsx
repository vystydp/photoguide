import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CaptureScreen } from './screens/CaptureScreen';
import { ReviewScreen } from './screens/ReviewScreen';
import { StartScreen } from './screens/StartScreen';
import { SummaryScreen } from './screens/SummaryScreen';
import { Button, colors } from './theme';
import type { CaptureMode, Guide, Photo, PhotoSource, SessionResult } from './types';

type Screen =
  | { name: 'start' }
  | { name: 'capture'; shotId: string; fromSummary: boolean }
  | { name: 'review'; shotId: string; source: PhotoSource; fromSummary: boolean }
  | { name: 'summary' }
  | { name: 'done' };

type Props = {
  guide: Guide;
  /** Called when the user finishes a session. Upload is the host's job (not built yet). */
  onFinish?: (result: SessionResult) => void;
};

const newId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

/**
 * The whole guided session as one self-contained component, so it can be dropped
 * into another React Native app behind a single button.
 */
export function PhotoGuide({ guide, onFinish }: Props) {
  const [screen, setScreen] = useState<Screen>({ name: 'start' });
  const [mode, setMode] = useState<CaptureMode>('demo');
  const [photos, setPhotos] = useState<Record<string, Photo>>({});

  // Capture runs in landscape; the start and done screens follow the host app.
  const inSession = screen.name !== 'start' && screen.name !== 'done';
  useEffect(() => {
    if (Platform.OS === 'web') return;
    const change = inSession
      ? ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
      : ScreenOrientation.unlockAsync();
    change.catch(() => {});
  }, [inSession]);

  const shotById = (id: string) => guide.shots.find((s) => s.id === id)!;

  /** Next shot after `shotId` that has no photo yet, else the overview. */
  const advanceFrom = (shotId: string, taken: Record<string, Photo>) => {
    const index = guide.shots.findIndex((s) => s.id === shotId);
    const next = guide.shots.slice(index + 1).find((s) => !taken[s.id]);
    setScreen(next ? { name: 'capture', shotId: next.id, fromSummary: false } : { name: 'summary' });
  };

  switch (screen.name) {
    case 'start':
      return (
        <StartScreen
          guide={guide}
          onStart={(chosen) => {
            setMode(chosen);
            setPhotos({});
            setScreen({ name: 'capture', shotId: guide.shots[0].id, fromSummary: false });
          }}
        />
      );

    case 'capture': {
      const { shotId, fromSummary } = screen;
      return (
        <CaptureScreen
          key={shotId}
          shot={shotById(shotId)}
          index={guide.shots.findIndex((s) => s.id === shotId)}
          total={guide.shots.length}
          mode={mode}
          onCaptured={(source) => setScreen({ name: 'review', shotId, source, fromSummary })}
          onSkip={fromSummary ? undefined : () => advanceFrom(shotId, photos)}
          onOverview={() => setScreen({ name: 'summary' })}
        />
      );
    }

    case 'review': {
      const { shotId, source, fromSummary } = screen;
      return (
        <ReviewScreen
          shot={shotById(shotId)}
          source={source}
          onRetake={() => setScreen({ name: 'capture', shotId, fromSummary })}
          onAccept={() => {
            const photo: Photo = { id: newId(), shotId, source, takenAt: new Date().toISOString() };
            const taken = { ...photos, [shotId]: photo };
            setPhotos(taken);
            if (fromSummary) setScreen({ name: 'summary' });
            else advanceFrom(shotId, taken);
          }}
        />
      );
    }

    case 'summary':
      return (
        <SummaryScreen
          guide={guide}
          photos={photos}
          onOpenShot={(shotId) => setScreen({ name: 'capture', shotId, fromSummary: true })}
          onFinish={() => {
            onFinish?.({
              guideId: guide.id,
              guideVersion: guide.version,
              mode,
              photos: Object.values(photos),
            });
            setScreen({ name: 'done' });
          }}
        />
      );

    case 'done':
      return (
        <SafeAreaView style={styles.done}>
          <Text style={styles.title}>Session complete</Text>
          <Text style={styles.lead}>
            {Object.keys(photos).length} photos taken.
            {mode === 'demo'
              ? ' This was the demo, so nothing was saved.'
              : ' Upload is not built yet, so they stay on this device only.'}
          </Text>
          <Button label="Start next car" variant="primary" onPress={() => setScreen({ name: 'start' })} />
        </SafeAreaView>
      );
  }
}

const styles = StyleSheet.create({
  done: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 14,
  },
  title: { color: colors.text, fontSize: 26, fontWeight: '800' },
  lead: { color: colors.muted, fontSize: 16, lineHeight: 23, textAlign: 'center', maxWidth: 420 },
});
