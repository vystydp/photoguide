import { CameraView, useCameraPermissions } from 'expo-camera';
import { useImperativeHandle, useRef, type Ref } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { DemoScene } from './DemoScene';
import { Button, colors } from './theme';
import type { PhotoSource, ShotDef } from './types';

export type CameraHandle = { capture: () => Promise<PhotoSource> };

type CameraProps = { ref: Ref<CameraHandle>; shot: ShotDef };

/** Real camera. Main lens, no zoom, 4:3, so every car is shot at the same focal length. */
export function LiveCamera({ ref }: CameraProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const camera = useRef<CameraView>(null);

  useImperativeHandle(
    ref,
    () => ({
      async capture() {
        if (!camera.current) throw new Error('Camera is not ready yet.');
        const picture = await camera.current.takePictureAsync({ quality: 0.85 });
        return { kind: 'file', uri: picture.uri };
      },
    }),
    [],
  );

  if (!permission) return <View style={styles.fill} />;

  if (!permission.granted) {
    return (
      <View style={[styles.fill, styles.center]}>
        <Text style={styles.message}>The photo guide needs the camera.</Text>
        <Button label="Allow camera" variant="primary" onPress={() => void requestPermission()} />
      </View>
    );
  }

  return <CameraView ref={camera} style={styles.fill} facing="back" ratio="4:3" zoom={0} />;
}

/** Demo camera: shows a sample scene and "captures" it. No camera, no permission, no upload. */
export function DemoCamera({ ref, shot }: CameraProps) {
  useImperativeHandle(
    ref,
    () => ({
      async capture() {
        await new Promise((resolve) => setTimeout(resolve, 120));
        return { kind: 'demo', shotId: shot.id };
      },
    }),
    [shot.id],
  );

  return (
    <View style={styles.fill}>
      <DemoScene shot={shot} />
    </View>
  );
}

/** Shows a captured photo, whichever kind it is. */
export function PhotoView({ source, shot }: { source: PhotoSource; shot: ShotDef }) {
  if (source.kind === 'demo') {
    return (
      <View style={styles.fill}>
        <DemoScene shot={shot} />
      </View>
    );
  }
  return <Image source={{ uri: source.uri }} style={styles.fill} resizeMode="cover" />;
}

const styles = StyleSheet.create({
  fill: { ...StyleSheet.absoluteFill, backgroundColor: '#000' },
  center: { alignItems: 'center', justifyContent: 'center', gap: 14, padding: 20 },
  message: { color: colors.text, fontSize: 15, textAlign: 'center' },
});
