import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => Promise<void>;
  theme: Theme;
};

type Theme = {
  backgroundColor: string;
  textColor: string;
  cardBackground: string;
  borderColor: string;
  input: string;
  textInput: string;
  tabBar: string;
  selecUser: string;
};

const lightTheme: Theme = {
  backgroundColor: '#f8f9fa',
  textColor: '#000000',
  cardBackground: '#ffffff',
  borderColor: '#f0f0f0',
  input: '#F0F0F0',
  textInput: '#000000',
  tabBar: '#5a3751',
  selecUser: '#a29bfe',
};

const darkTheme: Theme = {
  backgroundColor: '#000000',
  textColor: '#ffffff',
  cardBackground: 'black',
  borderColor: 'black',
 input: '#F0F0F0',
 textInput: '#000000', 
 tabBar: '#a794a3',
 selecUser: '#f2edf1',
 
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedMode = await AsyncStorage.getItem('darkMode');
      setIsDarkMode(savedMode === 'true');
    } catch (error) {
      console.log('Error loading theme preference:', error);
    }
  };

  const toggleDarkMode = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      await AsyncStorage.setItem('darkMode', String(newMode));
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 