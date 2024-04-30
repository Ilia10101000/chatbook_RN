import React from "react";
import { USERS_D } from "../../firebase_storage_path_constants/firebase_storage_path_constants";
import { db } from "../../firebase/auth";
import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Pressable, View } from "react-native";
import { UserAvatar } from "../CustomeComponent/UserAvatar";
import { Text } from "react-native-paper";

interface IFriendsListItem {
  userId: string;
  handlePress: (userId: string) => void;
}

function FriendsListItem({ userId, handlePress }: IFriendsListItem) {
  const [userData, loadingUD, errorUD] = useDocumentData(
    doc(db, `${USERS_D}/${userId}`)
  );
  if (loadingUD) {
    return null;
  }

  return (
    <Pressable onPress={() => handlePress(userId)}>
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <UserAvatar
          photoURL={userData.photoURL}
          displayName={userData.displayName || "Noname"}
          size={65}
        />
        <Text
          style={{ padding: 15 }}
          variant="titleMedium"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {userData.displayName}
        </Text>
      </View>
    </Pressable>
  );
}

export { FriendsListItem };
