import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PhotoView } from '../camera';
import { Overlay } from '../Overlay';
import { Button, colors } from '../theme';
import type { Guide, Photo } from '../types';

type Props = {
  guide: Guide;
  photos: Record<string, Photo>;
  onOpenShot: (shotId: string) => void;
  onFinish: () => void;
};

export function SummaryScreen({ guide, photos, onOpenShot, onFinish }: Props) {
  const missing = guide.shots.filter((s) => s.required && !photos[s.id]).length;
  const taken = guide.shots.filter((s) => photos[s.id]).length;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Overview</Text>
          <Text style={[styles.status, missing > 0 && styles.statusMissing]}>
            {missing > 0
              ? `${missing} required ${missing === 1 ? 'shot' : 'shots'} missing`
              : `All required shots taken · ${taken} of ${guide.shots.length}`}
          </Text>
        </View>
        <Button label="Finish" variant="primary" disabled={missing > 0} onPress={onFinish} />
      </View>
      <ScrollView contentContainerStyle={styles.grid}>
        {guide.shots.map((shot) => {
          const photo = photos[shot.id];
          const state = photo ? 'Done' : shot.required ? 'Missing' : 'Optional';
          return (
            <Pressable
              key={shot.id}
              accessibilityRole="button"
              accessibilityLabel={`${shot.label}: ${state}. ${photo ? 'Retake' : 'Take photo'}`}
              onPress={() => onOpenShot(shot.id)}
              style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
            >
              <View style={styles.thumb}>
                {photo ? (
                  <PhotoView source={photo.source} shot={shot} />
                ) : (
                  <Overlay overlay={shot.overlay} color={colors.muted} opacity={0.6} />
                )}
              </View>
              <Text style={styles.tileLabel} numberOfLines={1}>
                {shot.label}
              </Text>
              <Text
                style={[
                  styles.tileState,
                  photo ? styles.done : shot.required ? styles.missing : null,
                ]}
              >
                {state}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  headerText: { flex: 1 },
  title: { color: colors.text, fontSize: 22, fontWeight: '800' },
  status: { color: colors.ok, fontSize: 14, marginTop: 2 },
  statusMissing: { color: colors.danger },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, padding: 16 },
  tile: { width: 152 },
  pressed: { opacity: 0.7 },
  thumb: {
    width: 152,
    height: 114,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
  },
  tileLabel: { color: colors.text, fontSize: 14, fontWeight: '600', marginTop: 6 },
  tileState: { color: colors.muted, fontSize: 12 },
  done: { color: colors.ok },
  missing: { color: colors.danger },
});
