import type { OverlayKey } from './types';

/**
 * Rough silhouettes on a 400x300 (4:3) canvas. Placeholders for the week-2 field test:
 * final assets get drawn only after they are checked against real cars.
 */
export type CarShape = {
  body: string;
  windows: string[];
  /** Lamps: drawn in the lamp colour of the visible end (front = pale, rear = red). */
  lamps: string[];
  /** Extra outline strokes: grille, plate, body creases. */
  lines: string[];
  wheels: { cx: number; cy: number; rx: number; ry: number }[];
};

const SIDE: CarShape = {
  body:
    'M45 196 L45 172 Q47 156 70 151 L136 141 L176 106 Q186 98 202 98 L272 98 Q292 100 306 114 ' +
    'L336 142 L352 150 Q358 160 356 180 L354 196 L325 196 A30 30 0 0 0 265 196 L150 196 ' +
    'A30 30 0 0 0 90 196 Z',
  windows: [
    'M146 141 L180 111 Q186 106 196 106 L222 106 L222 141 Z',
    'M230 106 L270 106 Q286 107 298 119 L322 141 L230 141 Z',
  ],
  lamps: ['M47 160 L62 156 L62 166 L47 168 Z'],
  lines: ['M226 141 L226 192', 'M136 141 L340 144'],
  wheels: [
    { cx: 120, cy: 196, rx: 24, ry: 24 },
    { cx: 295, cy: 196, rx: 24, ry: 24 },
  ],
};

const END_BODY =
  'M108 214 L104 172 Q104 152 120 142 L140 102 Q146 88 166 86 L234 86 Q254 88 260 102 L280 142 ' +
  'Q296 152 296 172 L292 214 L264 214 L264 230 L234 230 L234 214 L166 214 L166 230 L136 230 ' +
  'L136 214 Z';

const FRONT: CarShape = {
  body: END_BODY,
  windows: ['M150 104 L250 104 L266 138 L134 138 Z'],
  lamps: ['M114 158 h34 v14 h-34 Z', 'M252 158 h34 v14 h-34 Z'],
  lines: ['M164 164 h72 v22 h-72 Z', 'M120 142 L100 138 L100 150 L116 152', 'M280 142 L300 138 L300 150 L284 152'],
  wheels: [],
};

const REAR: CarShape = {
  body: END_BODY,
  windows: ['M154 100 L246 100 L262 134 L138 134 Z'],
  lamps: ['M112 150 h30 v18 h-30 Z', 'M258 150 h30 v18 h-30 Z'],
  lines: ['M176 174 h48 v14 h-48 Z', 'M112 196 L288 196'],
  wheels: [],
};

/** Three-quarter view: the end face on the left, the side receding to the right. */
const QUARTER: CarShape = {
  body:
    'M56 226 L52 178 Q53 164 68 158 L92 150 L118 112 Q126 100 144 99 L266 92 Q286 92 298 104 ' +
    'L334 136 Q350 146 352 164 L350 192 L337 195 A17 26 0 0 0 302 200 L254 209 ' +
    'A24 32 0 0 0 205 221 L192 234 L66 232 Z',
  windows: [
    'M106 148 L128 112 Q132 106 144 106 L222 102 L204 150 Z',
    'M216 150 L232 104 L262 100 Q280 100 292 110 L322 138 Z',
  ],
  lamps: ['M60 170 h28 v12 h-28 Z', 'M152 176 h32 v13 h-32 Z'],
  lines: ['M192 234 L190 166 L68 158', 'M190 166 L204 150 L322 138', 'M98 192 h46 v16 h-46 Z'],
  wheels: [
    { cx: 229, cy: 214, rx: 21, ry: 29 },
    { cx: 319, cy: 198, rx: 14, ry: 23 },
  ],
};

export type CarView = { shape: CarShape; flip: boolean; end: 'front' | 'rear' | 'none' };

export function carViewFor(key: OverlayKey): CarView | null {
  switch (key) {
    case 'front':
      return { shape: FRONT, flip: false, end: 'front' };
    case 'rear':
      return { shape: REAR, flip: false, end: 'rear' };
    case 'side-left':
      return { shape: SIDE, flip: false, end: 'front' };
    case 'side-right':
      return { shape: SIDE, flip: true, end: 'front' };
    case 'q-front-left':
      return { shape: QUARTER, flip: false, end: 'front' };
    case 'q-front-right':
      return { shape: QUARTER, flip: true, end: 'front' };
    case 'q-rear-right':
      return { shape: QUARTER, flip: false, end: 'rear' };
    case 'q-rear-left':
      return { shape: QUARTER, flip: true, end: 'rear' };
    default:
      return null;
  }
}

export const FLIP_TRANSFORM = 'translate(400 0) scale(-1 1)';
