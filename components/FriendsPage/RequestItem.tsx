import { doc } from "firebase/firestore";
import React from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "../../firebase/auth";
import { USERS_D } from "../../firebase_storage_path_constants/firebase_storage_path_constants";
import { View, Dimensions } from "react-native";
import { UserAvatar } from "../CustomeComponent/UserAvatar";
import { Text, FAB } from "react-native-paper";

function RequestItem({ userId,handlePress, icon = 'plus' }: { userId: string, icon?:string, handlePress:()=> void }) {
  const [user, loadingU, errorU] = useDocumentData(
    doc(db, `${USERS_D}/${userId}`)
  );
  if (loadingU) {
    return null;
  }

  const maxWidth = Dimensions.get("screen").width - 20;
  return (
    <View
      style={{
        flexDirection: "row",
        marginBottom: 10,
        justifyContent: "space-between",
        alignItems: "center",
        width: maxWidth,
      }}
    >
      <View style={{ flexDirection: "row", maxWidth: "100%", flexShrink: 1 }}>
        <UserAvatar
          displayName={user.displayName}
          photoURL={user.photoURL}
          size={65}
        />
        <Text
          style={{ padding: 15, flexShrink: 1 }}
          variant="titleMedium"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {user.displayName}
        </Text>
      </View>
      <FAB
        icon={icon}
        style={{ marginRight: 10, backgroundColor: "#3b5998" }}
        color="#fff"
        onPress={handlePress}
        size="small"
      />
    </View>
  );
}

export { RequestItem };
