import React from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator } from "react-native-paper";
import { EXISTING_CHATS, USERS_D } from '../../firebase_storage_path_constants/firebase_storage_path_constants';
import { useAuthUser } from '../CustomeComponent/useAuthUser';
import { collection } from 'firebase/firestore';
import { db } from '../../firebase/auth';
import { View } from 'react-native';
import {MessageListItem} from './MassageListItem'
import { gStyle } from '../../styles/styles';

interface IGotToChat{
  chatId: string;
  companionData: {
    displayName: string;
    photoURL:string
  }
}

function MessageListDrawer() {

  const navigation = useNavigation();

  const goToChatPage = ({ chatId, companionData }: IGotToChat) => {
    navigation.navigate("ChatPage", { chatId, user: companionData });
  };
  

  const authUser = useAuthUser();

  const [existingChatsList, loadingECL, errorECL] = useCollectionData(
    collection(db, `${USERS_D}/${authUser.uid}/${EXISTING_CHATS}`)
  );
  if (loadingECL){
    return (
      <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size={'large'} animating={true} color="#8b9dc3" />
      </View>
    );
  }
  return (
    <View style={[gStyle.ownPage__container, {gap:10}]}>
      {existingChatsList.map(item => <MessageListItem key={item.companion} handlePress={goToChatPage} companion={item.companion} chatId={item.chatId} isHasNewMessage={item.isHasNewMessage} />)}
    </View>
  )
}

export {MessageListDrawer}