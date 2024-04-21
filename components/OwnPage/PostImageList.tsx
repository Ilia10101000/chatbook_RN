import React, { useState } from "react";
import { TouchableHighlight, View } from "react-native";
import { Text } from "react-native-paper";
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
  isOwnPage: boolean;
}


function PostImageList({ userId, isOwnPage }: IPostImageList) {
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
              backgroundColor: item.value === page ? "#8b9dc3" : "#dfe3ee",
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
