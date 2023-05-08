const WHITE = '#FFFFFF';
const BLACK = '#000000';
const RED = '#ff0000';
const GREY = '#aaa2a2';
const GOLD = '#85735d';
const PINK = '#c938b8';
const BLUE = '#2a4099';

export type ColorScheme = {
  background: string;
  text: string;
  text2: string;
  highlight: string;
  debugGold: string;
  debugPink: string;
  debugBlue: string;
};

const colorScheme: ColorScheme = {
  background: WHITE,
  text: BLACK,
  text2: GREY,
  highlight: RED,
  debugGold: GOLD,
  debugPink: PINK,
  debugBlue: BLUE,
};

const darkModeColorScheme: ColorScheme = {
  background: BLACK,
  text: WHITE,
  text2: GREY,
  highlight: RED,
  debugGold: GOLD,
  debugPink: PINK,
  debugBlue: BLUE,
};

export const getColors = (isDarkMode: boolean): ColorScheme => {
  if (isDarkMode) {
    return darkModeColorScheme;
  }

  return colorScheme;
};
