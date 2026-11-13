import { type ReactNode } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from './theme';

const RAIL = 148;

/**
 * Camera-screen layout: a 4:3 preview box as large as fits, plus a control rail.
 * Rail sits on the right in landscape and below in portrait (web on a phone).
 * Sized from the window, not onLayout, so the preview never blanks for a frame between shots.
 */
export function Stage({ children, rail }: { children: ReactNode; rail: ReactNode }) {
  const window = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const w = window.width - insets.left - insets.right;
  const h = window.height - insets.top - insets.bottom;
  const landscape = w >= h;
  const availW = landscape ? w - RAIL : w;
  const availH = landscape ? h : h - RAIL;
  const boxW = Math.max(0, Math.min(availW, (availH * 4) / 3));
  const boxH = (boxW * 3) / 4;

  return (
    <SafeAreaView style={styles.root}>
      <View style={[styles.body, { flexDirection: landscape ? 'row' : 'column' }]}>
        <View style={styles.previewArea}>
          <View style={[styles.box, { width: boxW, height: boxH }]}>{children}</View>
        </View>
        <View style={[styles.rail, landscape ? styles.railSide : styles.railBottom]}>{rail}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  body: { flex: 1 },
  previewArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  box: { overflow: 'hidden', borderRadius: 8, backgroundColor: '#111' },
  rail: { backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 12 },
  railSide: { width: RAIL },
  railBottom: { height: RAIL, flexDirection: 'row' },
});
