import React, { useEffect } from "react";
import { View, Image } from "react-native";
import { ActivityIndicator, Snackbar, Text } from "react-native-paper";
import {
  CHATS_D,
  MESSAGES,
} from "../../firebase_storage_path_constants/firebase_storage_path_constants";
import { collection, orderBy, query } from "firebase/firestore";
import { ref, set } from "firebase/database";
import { db, realTimeDB } from "../../firebase/auth";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { MessagesList } from "./ChatList";
import { ChatFooter } from "./ChatFooter";
import { sendMessage, sendImages } from "../../firebase/util/message_utils";
import { useAuthUser } from "../CustomeComponent/useAuthUser";
import { useErrorAlert } from "../CustomeComponent/useErrorAlert";
import { doc } from "firebase/firestore";
import { setReceiveNewMessageStatus } from "../../firebase/util/message_utils";
import { useObjectVal } from "react-firebase-hooks/database";

function ChatPage({ route, navigation }) {
  const { error, setError } = useErrorAlert();
  const authUser = useAuthUser();
  const {
    chatId,
    user: { displayName, photoURL, id },
  } = route.params;

  const [messagesList, loadingML, errorML] = useCollectionData(
    query(
      collection(db, `${CHATS_D}/${chatId}/${MESSAGES}`),
      orderBy("timestamp")
    )
  );
  const [chatData, loadingCD, errorCD] = useDocumentData(
    doc(db, `${CHATS_D}/${chatId}`)
  );

  const [isUsersTyping, loadingUT, errorUT] = useObjectVal<{
    [key: string]: boolean;
  }>(ref(realTimeDB, `${CHATS_D}/${chatId}`));

  const setIsAuthUserTypingStatus = (status: boolean) => {
    set(ref(realTimeDB, `${CHATS_D}/${chatId}`), {
      [authUser.uid]: status,
    });
  };

  const handleSendMessage = async (message: string, imageList: Array<any>) => {
    try {
      if (message) {
        const trimedMessage = message
          .trim()
          .replace(/\n{2,}/g, "\n")
          .replace(/\s{2,}/g, " ");
        await sendMessage(trimedMessage, authUser.uid, chatId);
      }
      if (imageList.length) {
        await sendImages(imageList, authUser.uid, chatId);
      }
      await setReceiveNewMessageStatus(chatId, id);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loadingML || loadingCD || loadingUT) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} animating={true} color="#8b9dc3" />
      </View>
    );
  }

  return (
    <View
      style={{ flex: 1, justifyContent: "space-between", flexWrap: "nowrap" }}
    >
      <MessagesList list={messagesList} chatData={chatData as any} />
      <ChatFooter
        isAuthUserTyping={!!isUsersTyping[authUser.uid]}
        handleSetTypingStatus={setIsAuthUserTypingStatus}
        handleError={setError}
        sendMessage={handleSendMessage}
        isCompanionTyping={!!isUsersTyping[id] && displayName}
      />
      <Snackbar
        visible={!!error}
        onDismiss={() => setError(null)}
        action={{
          label: "Undo",
          onPress: () => {
            setError(null);
          },
        }}
      >
        {error}
      </Snackbar>
    </View>
  );
}

export { ChatPage };
