import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { User } from "firebase/auth";
import { UserAvatar } from "../CustomeComponent/UserAvatar";

function PersonalData({ authUser }: { authUser: User }) {
  const { t } = useTranslation();
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 20,
        overflow: "hidden",
      }}
    >
      <UserAvatar
        photoURL={authUser.photoURL}
        displayName={authUser.displayName}
        size={140}
      />
      <View
        style={{
          maxWidth: "100%",
          overflow: "hidden",
          gap: 10,
        }}
      >
        <Text numberOfLines={1} ellipsizeMode="tail" variant="headlineSmall">
          {authUser.displayName || "No name"}
        </Text>
        <Text numberOfLines={1} ellipsizeMode="tail" variant="titleMedium">
          {t("userPage.publications")}
        </Text>
        <Text numberOfLines={1} ellipsizeMode="tail" variant="titleMedium">
          {t("userPage.friends")}
        </Text>
      </View>
    </View>
  );
}

export { PersonalData };
