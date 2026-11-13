import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

export const colors = {
  bg: '#0e1116',
  panel: '#1a1f27',
  line: '#2b323d',
  text: '#f2f4f7',
  muted: '#9aa4b2',
  accent: '#ffb020',
  ok: '#3ccf7e',
  danger: '#ff6b5e',
};

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({ label, onPress, variant = 'secondary', disabled, style }: ButtonProps) {
  const primary = variant === 'primary';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        primary ? styles.primary : styles.secondary,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.label, primary && styles.primaryLabel]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: colors.accent },
  secondary: { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.35 },
  label: { color: colors.text, fontSize: 15, fontWeight: '600' },
  primaryLabel: { color: '#1a1200' },
});
