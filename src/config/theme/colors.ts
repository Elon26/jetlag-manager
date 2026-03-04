export const theme = {
  primary: {
    DEFAULT: '#3870FF',
  },
  secondary: {
    DEFAULT: '#477BFF',
  },
  background: {
    DEFAULT: '#FBFBFB',
  },
  text: {
    DEFAULT: '#000000',
    gray: '#9C9E9E',
    white: '#FBFBFB',
  },
  transparent: 'transparent',
  gray: {
    DEFAULT: '#777777',
    400: '#D7E1E3',
    300: '#E9E9E9',
    200: '#F8F8F8',
  },
  white: '#FFFFFF',
  red: '#E32322',
  green: '#7AB69C',
} as const;

export const gradients = {} as const;

type Palette = typeof theme;
type ColorKey = keyof Palette;

type DefaultOrNever<T extends ColorKey> = Palette[T] extends Record<string, string>
  ? Palette[T]['DEFAULT'] extends string
    ? Palette[T]['DEFAULT']
    : never
  : never;

type ThemePalette = {
  [K in keyof Palette]: Palette[K] extends string
    ? Palette[K]
    : DefaultOrNever<K> extends never
      ? { [P in keyof Palette[K]]: Palette[K][P] }
      : DefaultOrNever<K> & { [P in keyof Palette[K]]: Palette[K][P] };
};

class ThemeColor<T extends ColorKey> extends String {
  private static colors = theme;
  private DEFAULT: string | undefined;
  #key: T;

  constructor(key: T) {
    super();
    this.#key = key;
    const value = ThemeColor.colors[key];

    if (typeof value === 'string') {
      this.DEFAULT = value;
    } else if (typeof value === 'object') {
      if ('DEFAULT' in value) {
        this.DEFAULT = value.DEFAULT;
      }
      Object.assign(this, value);
    }
  }

  toString() {
    if (__DEV__ && !this.DEFAULT) {
      console.warn(`⚠️ 🎨 Color ${this.#key} has no DEFAULT value`);
    }
    return this.DEFAULT ?? (__DEV__ ? '#FF0000' : '#000000');
  }
}

export const colors: ThemePalette = Object.keys(theme).reduce((acc, key) => {
  const k = key as ColorKey;
  acc[k] = new ThemeColor(k);
  return acc;
  // biome-ignore lint/suspicious/noExplicitAny: prevent early type assertion
}, {} as any);
