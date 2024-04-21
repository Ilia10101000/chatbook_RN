import React from 'react';
import { Button, Text } from 'react-native-paper';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/auth';
import { View } from 'react-native';

function SettingsPage() {
  return (
    <View>
      <Text>SettingsPage</Text>
      <Button onPress={() => signOut(auth)}>SignOut</Button>
    </View>
  )
}

export {SettingsPage}