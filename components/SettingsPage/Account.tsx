import React from 'react'
import { View } from 'react-native';
import { auth } from '../../firebase/auth';
import { signOut } from 'firebase/auth';
import { Button } from 'react-native-paper';

function Account() {
  return (
    <View>
      <Button onPress={() => signOut(auth)}>Sign out</Button>
    </View>
  )
}

export {Account}