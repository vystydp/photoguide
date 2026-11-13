import { StyleSheet, Text, View } from 'react-native';

import { PhotoView } from '../camera';
import { Stage } from '../Stage';
import { Button, colors } from '../theme';
import type { PhotoSource, ShotDef } from '../types';

type Props = {
  shot: ShotDef;
  source: PhotoSource;
  onAccept: () => void;
  onRetake: () => void;
};

export function ReviewScreen({ shot, source, onAccept, onRetake }: Props) {
  return (
    <Stage
      rail={
        <>
          <Button label="Use photo" variant="primary" onPress={onAccept} style={styles.railButton} />
          <Button label="Retake" onPress={onRetake} style={styles.railButton} />
        </>
      }
    >
      <PhotoView source={source} shot={shot} />
      <View style={styles.top} pointerEvents="none">
        <Text style={styles.label}>{shot.label}</Text>
        <Text style={styles.hint}>Sharp, whole subject in frame, no glare? Then use it.</Text>
      </View>
    </Stage>
  );
}

const styles = StyleSheet.create({
  top: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  label: { color: colors.text, fontSize: 17, fontWeight: '700' },
  hint: { color: colors.text, fontSize: 14, marginTop: 2 },
  railButton: { width: 116 },
});
