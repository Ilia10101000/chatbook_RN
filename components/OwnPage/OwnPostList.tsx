import React from "react";
import { View } from "react-native";
import { OwnPostListItem } from "./OwnPostListItem";

function OwnPostList({ postList }) {
  if (!postList) {
    return null;
  }
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 7 }}>
      {postList.map((item) => (
        <OwnPostListItem key={item.id} post={item} />
      ))}
    </View>
  );
}

export { OwnPostList };
