import React from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { View, Dimensions, Pressable } from "react-native";
import { Text, Badge } from "react-native-paper";
import { useObjectVal } from "react-firebase-hooks/database";
import {
  CHATS_D,
  PRESENT,
  USERS_D,
} from "../../firebase_storage_path_constants/firebase_storage_path_constants";
import { db, realTimeDB } from "../../firebase/auth";
import { doc } from "firebase/firestore";
import { ref } from "firebase/database";
import { UserAvatar } from "../CustomeComponent/UserAvatar";

type IisOnlineSnapShot = {
  isOnline: boolean;
  lastVisit:any
};

function MessageListItem({ companion, chatId, isHasNewMessage, handlePress}) {

  const [user, loadingURL] = useDocumentData(
    doc(db, `${USERS_D}/${companion}`)
  );
  const [lastMessage, loadingLM] = useDocumentData(
    doc(db, `${CHATS_D}/${chatId}`)
  );
  const [isOnlineSnapShot, loading, error] = useObjectVal<IisOnlineSnapShot>(
    ref(realTimeDB, `${USERS_D}/${companion}/${PRESENT}`)
    );
    if (loadingURL || loadingLM || loading) {
        return null
  }

  const textWidth = Dimensions.get('window').width - 105;
  
  return (
    <Pressable
      onPress={() =>
        handlePress({
          chatId,
          companionData: {
            displayName: user?.displayName,
            photoURL: user?.photoURL,
            id: user?.id,
          },
        })
      }
    >
      <View
        style={
          {
            maxHeight: "100%",
            overflow: "hidden",
            flexDirection: "row",
          }
        }
      >
        <View>
          <UserAvatar
            displayName={user.displayName}
            photoURL={user.photoURL}
            size={65}
          />
          <Badge
            visible={!!isOnlineSnapShot?.isOnline}
            style={{
              position: "absolute",
              bottom: 0,
              backgroundColor: "#8b9dc3",
            }}
          />
        </View>
        <View style={{ padding: 10, gap: 5 }}>
          <Text
            style={{ width: textWidth }}
            numberOfLines={1}
            ellipsizeMode="tail"
            variant="titleSmall"
          >
            {lastMessage?.lastMessage?.message}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export { MessageListItem };
