import React, { useState } from "react";
import { TouchableHighlight, View } from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import { CustomeTabComponent } from "./CustomeTabComponent";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  POSTS,
  USERS_D,
  TAGS_IN_THIRD_PARTY_POSTS,
} from "../../firebase_storage_path_constants/firebase_storage_path_constants";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase/auth";
import { OwnPostList } from "./OwnPostList";
import { useTranslation } from "react-i18next";

interface IPostImageList {
  userId: string;
}


function PostImageList({ userId }: IPostImageList) {
  const theme = useTheme()
  const [page, setPage] = useState("0");
  const { t } = useTranslation();
  const buttons = [
    {
      value: "0",
      label: t("userPage.posts"),
    },
    {
      value: "1",
      label: t("userPage.marks"),
    },
  ];
  const [posts, loadingP, errorLoadingP] = useCollectionData(
    query(
      collection(db, `${USERS_D}/${userId}/${POSTS}`),
      orderBy("timestamp", "desc")
    )
  );
  const [thirdPartyPostTags, loadingTPPT, errorLoadingTPPT] = useCollectionData(
    query(
      collection(db, `${USERS_D}/${userId}/${TAGS_IN_THIRD_PARTY_POSTS}`),
      orderBy("timestamp", "desc")
    )
  );

  if (loadingP || loadingTPPT) {
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
  if (errorLoadingP || errorLoadingTPPT) {
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
    return (
      <View>
        <View
          style={{
            marginBottom: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            borderRadius: 5,
            overflow: "hidden",
          }}
        >
          {buttons.map((item) => (
            <TouchableHighlight
              key={item.value}
              underlayColor="transparent"
              onPress={() => setPage(item.value)}
              style={{
                flexGrow: 1,
                padding: 5,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor:
                  item.value === page
                    ? theme.colors.primary
                    : theme.colors.surface,
              }}
            >
              <Text style={{ color: item.value === page ? "#fff" : "#000" }}>
                {item.label}
              </Text>
            </TouchableHighlight>
          ))}
        </View>
        <CustomeTabComponent index={"0"} value={page}>
          <OwnPostList postList={posts} />
        </CustomeTabComponent>
        <CustomeTabComponent index={"1"} value={page}>
          <OwnPostList postList={thirdPartyPostTags} />
        </CustomeTabComponent>
      </View>
    );
}

export { PostImageList };
