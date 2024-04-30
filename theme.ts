import * as React from "react";
import {
  MD3LightTheme as DefaultTheme,
  MD3DarkTheme as DarkTheme,
  MD3Theme,
} from "react-native-paper";




export const lightTheme: MD3Theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#3b5998",
    onPrimary: "#fff",
    primaryContainer: "#dfe3ee",
    secondary: "#8b9dc3",
    onSecondary: "#fff",
    secondaryContainer: "#8b9dc3",
    onSecondaryContainer: "#fff",
    tertiary: "#dfe3ee",
    surface: "#fff",
    outline: "#3b5998",
    surfaceVariant: "#f7f7f7",
  },
};
export const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#8b9dc3",
    onPrimary: "#fff",
    primaryContainer: "#dfe3ee",
    secondary: "#3b5998",
    onSecondary: "#fff",
    secondaryContainer: "#8b9dc3",
    onSecondaryContainer: "#fff",
    tertiary: "#dfe3ee",
    surface: "#dfe3ee",
    outline: "#3b5998",
    surfaceVariant: "transparent",
  },
};

