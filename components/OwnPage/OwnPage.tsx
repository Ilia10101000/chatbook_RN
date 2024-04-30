import React from "react";
import { ScrollView, View } from "react-native";
import { useAuthUser } from "..//CustomeComponent/useAuthUser";
import { PersonalData } from "./PersonalData";
import { PostImageList } from "./PostImageList";

function OwnPage() {
  const  authUser  = useAuthUser();

  return (
    <ScrollView
      style={{
        flex: 1,
        padding: 10,
      }}
    >
      <View style={{ marginBottom: 15 }}>
        <PersonalData user={authUser} />
      </View>
      <PostImageList userId={authUser.uid} />
    </ScrollView>
  );
}

export { OwnPage };
