// This code is taken from the original version found at:
// https://github.com/obytes/react-native-template-obytes/blob/master/src/core/hooks/use-selected-theme.tsx
// Original code by OBytes (https://github.com/obytes), licensed under the MIT License.

import { colorScheme, useColorScheme } from 'nativewind';
import { useCallback } from 'react';
import { useMMKVString } from 'react-native-mmkv';

import { storage } from '@/lib/storage';

const SELECTED_THEME = 'SELECTED_THEME';
export type ColorSchemeType = 'light' | 'dark' | 'system';

/**
 * This hook should only be used while selecting the theme.
 * This hook will return the selected theme which is stored in MMKV.
 * selectedTheme should be one of the following values 'light', 'dark' or 'system'.
 * Don't use this hook if you want to use it to style your component based on the theme use useColorScheme from nativewind instead.
 */

export const useSelectedTheme = () => {
  const { colorScheme: _color, setColorScheme } = useColorScheme();
  const [theme, _setTheme] = useMMKVString(SELECTED_THEME, storage);

  const setSelectedTheme = useCallback(
    (t: ColorSchemeType) => {
      setColorScheme(t);
      _setTheme(t);
    },
    [setColorScheme, _setTheme]
  );

  const selectedTheme = (theme ?? 'system') as ColorSchemeType;
  return { selectedTheme, setSelectedTheme } as const;
};

// To be used in the root file to load the selected theme from MMKV.
export const loadSelectedTheme = () => {
  const theme = storage.getString(SELECTED_THEME);
  if (theme !== undefined) {
    colorScheme.set(theme as ColorSchemeType);
  }
};
