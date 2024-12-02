export const fontFamilies = {
    default: 'System',  
    roboto: 'Roboto',
    oswald: 'Oswald',
    playfair: 'PlayfairDisplay',
    montserrat: 'Montserrat',
    lato: 'Lato',
};

export const fontSizes = {
    small: 24,
    medium: 32,
    large: 40,
    xlarge: 48,
};

export const fontStyles = {
    normal: 'normal',
    italic: 'italic',
};

// Định nghĩa type cho fontWeight theo đúng React Native
type FontWeight = 
  | 'normal' 
  | 'bold' 
  | '100' 
  | '200' 
  | '300' 
  | '400' 
  | '500' 
  | '600' 
  | '700' 
  | '800' 
  | '900';

export const fontWeights: Record<string, FontWeight> = {
    normal: 'normal',
    bold: 'bold',
    '100': '100',
    '200': '200',
    '300': '300',
    '400': '400',
    '500': '500',
    '600': '600',
    '700': '700',
    '800': '800',
    '900': '900',
};

// Định nghĩa interface cho font preset
interface FontPreset {
    id: string;
    name: string;
    fontFamily: string;
    fontSize: number;
    fontWeight: FontWeight;
}

export const fontPresets: FontPreset[] = [
    {
        id: 'classic',
        name: 'Classic',
        fontFamily: fontFamilies.playfair,
        fontSize: fontSizes.large,
        fontWeight: '400',
    },
    {
        id: 'modern',
        name: 'Modern',
        fontFamily: fontFamilies.montserrat,
        fontSize: fontSizes.large,
        fontWeight: 'bold',
    },
    {
        id: 'casual',
        name: 'Casual',
        fontFamily: fontFamilies.lato,
        fontSize: fontSizes.medium,
        fontWeight: 'normal',
    },
]; 