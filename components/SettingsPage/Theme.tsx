import React from 'react'
import { useTheme, Appbar, TouchableRipple, Switch, Button } from "react-native-paper";
import { View } from 'react-native';
import { PreferencesContext } from '../../Preferences';

function Theme() {
  const { toggleTheme, isDarkTheme } = React.useContext(PreferencesContext);
  return (
    <View>
      <Switch
        color={"#8b9dc3"}
        value={isDarkTheme}
        onValueChange={toggleTheme}
      />
    </View>
  );
}

export {Theme}