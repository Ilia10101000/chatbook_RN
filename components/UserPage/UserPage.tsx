import React from "react";
import { ScrollView, View, Text } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { PersonalData } from "../OwnPage/PersonalData";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "../../firebase/auth";
import { PostImageList } from "../OwnPage/PostImageList";
import { USERS_D } from "../../firebase_storage_path_constants/firebase_storage_path_constants";
import { User } from "firebase/auth";

function UserPage({ route }) {
  const { userId } = route.params;
  const [user, loadingU, errorLoadingU] = useDocumentData(
    doc(db, USERS_D, userId)
  );
  
  if (loadingU) {
    return (
      <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      >
        <ActivityIndicator size="large" animating={true} color={"#3b5998"} />
      </View>
    );
  }
  if (errorLoadingU) {
    return (
      <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      >
        <Text>Some Error occured. Try again</Text>
      </View>
    );
  }
  console.log(userId, user.id)

  return (
    <ScrollView
      style={{
        flex: 1,
        padding: 10,
      }}
    >
      <View style={{ marginBottom: 15 }}>
        <PersonalData user={user as User} isOwnPage={false} />
      </View>
      <PostImageList userId={userId} />
    </ScrollView>
  );
}

export { UserPage };
