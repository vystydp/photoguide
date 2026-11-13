import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

import { carViewFor, FLIP_TRANSFORM } from './shapes';
import type { OverlayKey } from './types';

type Props = { overlay?: OverlayKey; color?: string; opacity?: number };

/** Guide outline drawn above the camera preview. Fills its parent, which must be 4:3. */
export function Overlay({ overlay, color = '#ffffff', opacity = 0.9 }: Props) {
  const stroke = { stroke: color, strokeWidth: 2.2, fill: 'none', strokeDasharray: '7 5' } as const;
  const thin = { stroke: color, strokeWidth: 1.2, fill: 'none' } as const;
  const car = overlay ? carViewFor(overlay) : null;

  return (
    <Svg width="100%" height="100%" viewBox="0 0 400 300" opacity={opacity} pointerEvents="none">
      {car && (
        <G transform={car.flip ? FLIP_TRANSFORM : undefined}>
          <Path d={car.shape.body} {...stroke} />
          {car.shape.windows.map((d) => (
            <Path key={d} d={d} {...thin} />
          ))}
          {car.shape.wheels.map((w) => (
            <Ellipse key={`${w.cx}`} cx={w.cx} cy={w.cy} rx={w.rx} ry={w.ry} {...thin} />
          ))}
        </G>
      )}
      {overlay === 'wheel' && (
        <>
          <Circle cx={200} cy={150} r={108} {...stroke} />
          <Circle cx={200} cy={150} r={66} {...thin} />
        </>
      )}
      {overlay === 'plate' && <Rect x={55} y={108} width={290} height={84} rx={8} {...stroke} />}
      {overlay === 'cluster' && <Rect x={45} y={62} width={310} height={176} rx={22} {...stroke} />}
      {!overlay && (
        <Path
          d="M30 60 V30 H60 M340 30 H370 V60 M370 240 V270 H340 M60 270 H30 V240"
          stroke={color}
          strokeWidth={2.2}
          fill="none"
        />
      )}
    </Svg>
  );
}
