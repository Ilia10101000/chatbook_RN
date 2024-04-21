import { User } from "firebase/auth";
import { DocumentData } from "firebase/firestore";
import React from "react";
import { Dimensions, Image, Pressable, View } from "react-native";
import {Icon, Text } from "react-native-paper";

interface IMessageItem {
  handleImagePress: (uri: string) => void;
  authUser: User;
  chatId: string;
  showViewedIcon: boolean;
  doc: DocumentData;
  user?: User;
  delLabel?: string;
  deleteMessage?: (
    message: {
      id: string;
      type: string;
      imageId?: string;
    },
    chatId: string
  ) => void;
}

function ChatListItem(props: IMessageItem) {
  const { doc, user, deleteMessage, showViewedIcon, handleImagePress } = props;

  const { timestamp, content, senderId, type, id } = doc;

  let createdAt: string;
  let messageItem: React.ReactNode;

  if (timestamp) {
    let hour = timestamp.toDate().getHours();

    let minutes = timestamp.toDate().getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes;

    createdAt = `${hour}:${minutes}`;
  }

  if (type === "image") {
    let imageDimensions = Dimensions.get("window").width / 2;
    messageItem = (
      <Pressable onPress={() => handleImagePress(content)}>
        <Image
          style={{ width: imageDimensions, height: imageDimensions }}
          source={{ uri: content }}
        />
      </Pressable>
    );
  } else if (type === "text") {
    messageItem = (
      <Text
        style={{
          color: senderId === props.authUser.uid ? "#000" : "#fff",
          maxWidth:'80%'
        }}
      >
        {content}
      </Text>
    );
  }
  return (
    <View
      style={{
        padding: 10,
        paddingBottom: 5,
        backgroundColor:
          senderId === props.authUser.uid ? "#dfe3ee" : "#8b9dc3",
        alignSelf: senderId === props.authUser.uid ? "flex-end" : "flex-start",
        borderRadius: 5,
        marginVertical: 3,
        gap: 3,
      }}
    >
      {messageItem}
      <View style={{ flexDirection: "row", gap: 3, alignSelf: "flex-end", alignItems:'center'}}>
        {showViewedIcon && <Icon source={"eye"} size={15} />}
        <Text
          style={{
            color: senderId === props.authUser.uid ? "#8b9dc3" : "#f7f7f7",
          }}
          variant="labelSmall"
        >
          {createdAt}
        </Text>
      </View>
    </View>
  );
}

export { ChatListItem };
