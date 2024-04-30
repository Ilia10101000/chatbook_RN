import React, { useState } from "react";
import { View, Image, Dimensions } from "react-native";
import { Portal, Modal, useTheme } from "react-native-paper";
import { ChatListItem } from "./ChatListItem";
import { useAuthUser } from "../CustomeComponent/useAuthUser";
import { DocumentData } from "firebase/firestore";
import { InView, IOFlatList } from "react-native-intersection-observer";
import { setViewedMessage } from "../../firebase/util/message_utils";

interface IChatList {
  list: Array<DocumentData>;
  chatData: {
    id: string;
    private: boolean;
    user1: string;
    user2: string;
    lastMessage: {
      isReaded: boolean;
      message: string;
      messageId: string;
      senderId: string;
    };
  };
}

function ChatList({ list, chatData }: IChatList) {
  const authUser = useAuthUser();
  const theme = useTheme()
  const [showImage, setShowImage] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState({
    width: 1,
    height: 1,
  });

  const setImageSize = ({
    width,
    height,
  }: {
    width: number;
    height: number;
  }) => {
    if (width === 1 && height === 1) {
      return;
    }
    let imageWidth: number;
    let imageHeight: number;

    const imageOriginRatio = +(height / width).toFixed(2);

    if (imageOriginRatio > 1) {
      imageHeight = Dimensions.get("window").height - 100;
      imageWidth = Math.floor(imageHeight / imageOriginRatio);
    } else if (imageOriginRatio === 1) {
      imageWidth = Dimensions.get("window").width - 10;
      imageHeight = imageWidth;
    } else {
      imageWidth = Dimensions.get("window").width - 20;
      imageHeight = Math.floor(imageWidth * imageOriginRatio);
    }
    setImageDimensions({ width: imageWidth, height: imageHeight });
  };

  const openImage = (uri: string) => {
    setShowImage(uri);
  };
  return (
    <View style={{ flex: 1,paddingHorizontal:3 }}>
      <IOFlatList
        inverted={true}
        data={[...list].reverse()}
        keyExtractor={(item) => item.id}
        extraData={list.length}
        renderItem={({ item }) => {
          let mesItem = (
            <ChatListItem
              theme={theme}
              handleImagePress={openImage}
              key={item.id}
              chatId={chatData.id}
              doc={item}
              authUser={authUser}
              showViewedIcon={
                chatData.lastMessage.messageId === item.id &&
                chatData.lastMessage.senderId === authUser.uid &&
                chatData.lastMessage.isReaded
              }
            />
          );

          if (
            item.id === chatData?.lastMessage?.messageId &&
            item.senderId !== authUser.uid
          ) {
            return (
              <InView
                onChange={async (inView: boolean) => {
                  if (!chatData.lastMessage.isReaded && inView) {
                    await setViewedMessage(authUser.uid, chatData.id);
                  }
                }}
              >
                {mesItem}
              </InView>
            );
          } else {
            return mesItem;
          }
        }}
      />
      <Portal>
        <Modal
          visible={!!showImage}
          onDismiss={() => setShowImage(null)}
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            resizeMode="contain"
            onLoad={({
              nativeEvent: {
                source: { width, height },
              },
            }) => {
              setImageSize({ width, height });
            }}
            source={{ uri: showImage }}
            style={{
              width: imageDimensions.width,
              height: imageDimensions.height,
            }}
          />
        </Modal>
      </Portal>
    </View>
  );
}

export { ChatList };
