import { Platform } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

import { carViewFor, FLIP_TRANSFORM } from './shapes';
import type { ShotDef } from './types';

const FONT = Platform.OS === 'web' ? 'system-ui, sans-serif' : 'sans-serif';

export const DEMO_VIN = 'TMBJJ7NE8J0123456';
export const DEMO_MILEAGE = '128 450';

/**
 * Stand-in for the camera in demo mode: an illustrated scene per shot.
 * Replace with real sample photos of one car before the demo goes public.
 */
export function DemoScene({ shot }: { shot: ShotDef }) {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="pgSky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#8fb8de" />
          <Stop offset="1" stopColor="#dbe7f1" />
        </LinearGradient>
        <LinearGradient id="pgDark" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#2a2f37" />
          <Stop offset="1" stopColor="#14171c" />
        </LinearGradient>
      </Defs>
      {renderScene(shot)}
    </Svg>
  );
}

function renderScene(shot: ShotDef) {
  const car = shot.overlay ? carViewFor(shot.overlay) : null;
  if (car) {
    const lamp = car.end === 'rear' ? '#d8362b' : '#fff3c4';
    return (
      <>
        <Rect width={400} height={188} fill="url(#pgSky)" />
        <Rect y={150} width={400} height={40} fill="#b9c4cc" />
        <Rect y={188} width={400} height={112} fill="#7d838b" />
        <Line x1={0} y1={262} x2={400} y2={262} stroke="#e9ecef" strokeWidth={3} strokeDasharray="34 22" />
        <G transform={car.flip ? FLIP_TRANSFORM : undefined}>
          {/* Slightly off the guide outline, the way a hand-held shot is. */}
          <G transform="translate(9 5) scale(0.96)">
            <Ellipse cx={200} cy={228} rx={170} ry={12} fill="#000000" opacity={0.28} />
            {car.shape.wheels.map((w) => (
              <Ellipse key={`t${w.cx}`} cx={w.cx} cy={w.cy} rx={w.rx} ry={w.ry} fill="#15171a" />
            ))}
            <Path d={car.shape.body} fill="#2f6aa3" stroke="#1d4368" strokeWidth={1.5} />
            {car.shape.windows.map((d) => (
              <Path key={d} d={d} fill="#1b2733" />
            ))}
            {car.shape.lines.map((d) => (
              <Path key={d} d={d} fill="none" stroke="#1d4368" strokeWidth={1.5} />
            ))}
            {car.shape.lamps.map((d) => (
              <Path key={d} d={d} fill={lamp} />
            ))}
            {car.shape.wheels.map((w) => (
              <Ellipse
                key={`r${w.cx}`}
                cx={w.cx}
                cy={w.cy}
                rx={w.rx * 0.58}
                ry={w.ry * 0.58}
                fill="#aeb4bb"
              />
            ))}
          </G>
        </G>
      </>
    );
  }

  switch (shot.overlay) {
    case 'wheel':
      return (
        <>
          <Rect width={400} height={300} fill="#7d838b" />
          <Rect width={400} height={120} fill="#2f6aa3" />
          <Circle cx={206} cy={156} r={112} fill="#15171a" />
          <Circle cx={206} cy={156} r={70} fill="#aeb4bb" />
          {[0, 72, 144, 216, 288].map((a) => (
            <Line
              key={a}
              x1={206}
              y1={156}
              x2={206 + 66 * Math.cos((a * Math.PI) / 180)}
              y2={156 + 66 * Math.sin((a * Math.PI) / 180)}
              stroke="#6d737a"
              strokeWidth={12}
            />
          ))}
          <Circle cx={206} cy={156} r={14} fill="#3d4248" />
        </>
      );
    case 'plate':
      return (
        <>
          <Rect width={400} height={300} fill="url(#pgDark)" />
          <Rect x={66} y={116} width={278} height={72} rx={5} fill="#c9ced4" />
          <SvgText fontFamily={FONT} x={205} y={145} fontSize={11} fill="#3d4248" textAnchor="middle">
            VEHICLE IDENTIFICATION NUMBER
          </SvgText>
          <SvgText
            x={205}
            y={172}
            fontSize={21}
            fontWeight="bold"
            fill="#15171a"
            textAnchor="middle"
            letterSpacing={1.5}
          >
            {DEMO_VIN}
          </SvgText>
        </>
      );
    case 'cluster':
      return (
        <>
          <Rect width={400} height={300} fill="url(#pgDark)" />
          <Rect x={52} y={70} width={300} height={166} rx={22} fill="#0b0d10" />
          <Circle cx={122} cy={150} r={52} fill="none" stroke="#cfd5dc" strokeWidth={3} />
          <Circle cx={284} cy={150} r={52} fill="none" stroke="#cfd5dc" strokeWidth={3} />
          <Line x1={122} y1={150} x2={150} y2={118} stroke="#ff6b5e" strokeWidth={3} />
          <Line x1={284} y1={150} x2={262} y2={182} stroke="#ff6b5e" strokeWidth={3} />
          <Rect x={166} y={190} width={74} height={26} rx={3} fill="#1c2a1f" />
          <SvgText fontFamily={FONT} x={203} y={208} fontSize={14} fontWeight="bold" fill="#9ff0b0" textAnchor="middle">
            {`${DEMO_MILEAGE} km`}
          </SvgText>
        </>
      );
    default:
      return (
        <>
          <Rect width={400} height={300} fill="url(#pgDark)" />
          <Rect x={40} y={170} width={320} height={90} rx={10} fill="#3a4049" />
          <Rect x={70} y={96} width={110} height={86} rx={12} fill="#4a515c" />
          <Rect x={220} y={96} width={110} height={86} rx={12} fill="#4a515c" />
          <SvgText fontFamily={FONT} x={200} y={60} fontSize={15} fill="#9aa4b2" textAnchor="middle">
            {`Sample: ${shot.label}`}
          </SvgText>
        </>
      );
  }
}
