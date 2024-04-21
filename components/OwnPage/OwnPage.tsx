import React from "react";
import { ScrollView, View, Text } from "react-native";
import { gStyle } from "../../styles/styles";
import { useAuthUser } from "..//CustomeComponent/useAuthUser";
import { PersonalData } from "./PersonalData";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "../../firebase/auth";
import { PostImageList } from "./PostImageList";
import { USERS_D } from "../../firebase_storage_path_constants/firebase_storage_path_constants";
import { User } from "firebase/auth";

function OwnPage({ route }) {
  const { userId } = route.params;
  const  authUser  = useAuthUser();

  const isOwnPage = authUser.uid === userId;

  const [user, loadingU, errorLoadingU] = useDocumentData(
    doc(db, USERS_D, userId)
  );

  if (loadingU) {
    return (
      <View style={[gStyle.main, gStyle.centered]}>
        <Text>Loading</Text>
      </View>
    );
  }
  if (errorLoadingU) {
    return (
      <View style={[gStyle.main, gStyle.centered]}>
        <Text>Some Error occured. Try again</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[gStyle.main, gStyle.ownPage__container]}>
      <View style={{ marginBottom: 15 }}>
        <PersonalData authUser={user as User} />
      </View>
      <PostImageList userId={userId} isOwnPage={isOwnPage} />
    </ScrollView>
  );
}

export { OwnPage };