// Define gradient colors
// export const gradientColors = [
//     ['#FF6B6B', '#FF8E8E'], 
//     ['#4ECDC4', '#45B7AF'], 
//     ['#6C5CE7', '#A8A0E3'], 
//     ['#F9C449', '#FBD28D'], 
//     ['#FF8C42', '#FFA571'], 
//     ['#45AAF2', '#72C2F8'], 
//     ['#26DE81', '#5AE4A0'], 
//     ['#FF4757', '#FF7B86'], 
// ];

// Define solid colors
export const solidColors = [
    '#FF6B6B', 
    '#4ECDC4', 
    '#6C5CE7', 
    '#F9C449', 
    '#FF8C42', 
    '#45AAF2', 
    '#26DE81', 
    '#2C3E50', 
    '#E056FD', 
    '#686DE0', 
];

// Define text colors
export const textColors = {
    light: '#FFFFFF',
    dark: '#2C3E50',
    gray: '#95A5A6',
};

// Define color presets
export const colorPresets = {
    warm: {
        background: '#FF6B6B',
        text: textColors.light,
    },
    cool: {
        background: '#4ECDC4',
        text: textColors.light,
    },
    elegant: {
        background: '#2C3E50',
        text: textColors.light,
    },
    playful: {
        background: '#F9C449',
        text: textColors.dark,
    },
};

// Helper function to check if the background color is light or dark
export const isLightColor = (hexColor: string): boolean => {
    const c = hexColor.substring(1);  // strip #
    const rgb = parseInt(c, 16);   // convert rrggbb to decimal
    const r = (rgb >> 16) & 0xff;  // extract red
    const g = (rgb >>  8) & 0xff;  // extract green
    const b = (rgb >>  0) & 0xff;  // extract blue

    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

    return luma > 128;
};

// Helper function to get the text color that contrasts with the background color
export const getContrastTextColor = (backgroundColor: string): string => {
    return isLightColor(backgroundColor) ? textColors.dark : textColors.light;
}; 