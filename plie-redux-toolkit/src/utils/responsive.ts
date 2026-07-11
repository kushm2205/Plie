import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const GUIDELINE_BASE_WIDTH = 375;
const GUIDELINE_BASE_HEIGHT = 812;

export const scaleWidth = (size: number): number =>
  PixelRatio.roundToNearestPixel((SCREEN_WIDTH / GUIDELINE_BASE_WIDTH) * size);

export const scaleHeight = (size: number): number =>
  PixelRatio.roundToNearestPixel((SCREEN_HEIGHT / GUIDELINE_BASE_HEIGHT) * size);

export const scaleFont = (size: number, factor = 0.5): number =>
  size + (scaleWidth(size) - size) * factor;

export const wp = (percentage: number): number => (percentage * SCREEN_WIDTH) / 100;

export const hp = (percentage: number): number => (percentage * SCREEN_HEIGHT) / 100;

export const screenWidth = SCREEN_WIDTH;
export const screenHeight = SCREEN_HEIGHT;
