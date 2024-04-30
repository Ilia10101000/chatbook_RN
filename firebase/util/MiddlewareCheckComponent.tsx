import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { collection, limit, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { ActivityIndicator } from "react-native-paper";
import { db } from "../../firebase/auth";
import { CHATS_D } from "../../firebase_storage_path_constants/firebase_storage_path_constants";
import { createChatDoc } from "./message_utils";
import { useAuthUser } from "../../components/CustomeComponent/useAuthUser";
import { View } from "react-native";

function MiddlewareCheckComponent({route}) {
  const { user } = route.params;
  const authUser = useAuthUser();
  const navigation = useNavigation();

  const [chatSnap, loading, error] = useCollection(
    query(
      collection(db, CHATS_D),
      where("private", "==", true),
      where(authUser.uid, "==", true),
      where(user.id, "==", true),
      limit(1)
    )
  );

  useEffect(() => {
    if (chatSnap?.empty) {
      createChatDoc(authUser.uid, user.id);
    }
    if (chatSnap && !chatSnap.empty) {
      const chatId = chatSnap.docs[0].id;
        //@ts-ignore
      navigation.getParent('RootStack').replace("ChatPage", { chatId, user });
    }
  }, [chatSnap]);

  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" animating={true} color={"#3b5998"} />
    </View>
  );
}

export { MiddlewareCheckComponent };
