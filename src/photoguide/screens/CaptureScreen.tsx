import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DemoCamera, LiveCamera, type CameraHandle } from '../camera';
import { groupLabels } from '../guide';
import { Overlay } from '../Overlay';
import { Stage } from '../Stage';
import { Button, colors } from '../theme';
import type { CaptureMode, PhotoSource, ShotDef } from '../types';

type Props = {
  shot: ShotDef;
  index: number;
  total: number;
  mode: CaptureMode;
  onCaptured: (source: PhotoSource) => void;
  /** Absent when the shot was opened from the overview. */
  onSkip?: () => void;
  onOverview: () => void;
};

export function CaptureScreen({ shot, index, total, mode, onCaptured, onSkip, onOverview }: Props) {
  const camera = useRef<CameraHandle>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shoot = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      if (!camera.current) throw new Error('Camera is not ready yet.');
      onCaptured(await camera.current.capture());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not take the photo.');
    } finally {
      setBusy(false);
    }
  };

  const Camera = mode === 'demo' ? DemoCamera : LiveCamera;

  return (
    <Stage
      rail={
        <>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Take photo: ${shot.label}`}
            disabled={busy}
            onPress={shoot}
            style={({ pressed }) => [styles.shutter, (pressed || busy) && styles.shutterPressed]}
          >
            <View style={styles.shutterInner} />
          </Pressable>
          {onSkip && <Button label="Skip" onPress={onSkip} style={styles.railButton} />}
          <Button label="Overview" onPress={onOverview} style={styles.railButton} />
        </>
      }
    >
      <Camera ref={camera} shot={shot} />
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Overlay overlay={shot.overlay} />
      </View>
      <View style={styles.top} pointerEvents="none">
        <Text style={styles.label}>
          {shot.label}
          {!shot.required && <Text style={styles.optional}> · optional</Text>}
        </Text>
        <Text style={styles.hint}>{shot.hint}</Text>
      </View>
      <View style={styles.bottom} pointerEvents="none">
        <Text style={styles.progress}>
          {groupLabels[shot.group]} · {index + 1} of {total}
        </Text>
        {mode === 'demo' && <Text style={styles.demoTag}>DEMO · sample scene</Text>}
      </View>
      {error && (
        <View style={styles.error}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </Stage>
  );
}

const pill = {
  backgroundColor: 'rgba(0,0,0,0.6)',
  borderRadius: 8,
  paddingHorizontal: 10,
  paddingVertical: 6,
} as const;

const styles = StyleSheet.create({
  top: { position: 'absolute', top: 10, left: 10, right: 10, ...pill },
  label: { color: colors.text, fontSize: 17, fontWeight: '700' },
  optional: { color: colors.muted, fontWeight: '400', fontSize: 14 },
  hint: { color: colors.text, fontSize: 14, marginTop: 2 },
  bottom: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  progress: { color: colors.text, fontSize: 13, ...pill },
  demoTag: { color: '#1a1200', fontSize: 12, fontWeight: '700', ...pill, backgroundColor: colors.accent },
  error: { position: 'absolute', left: 10, right: 10, bottom: 48, ...pill, backgroundColor: colors.danger },
  errorText: { color: '#1a0500', fontSize: 14, fontWeight: '600' },
  shutter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterPressed: { opacity: 0.5 },
  shutterInner: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#ffffff' },
  railButton: { width: 116 },
});
