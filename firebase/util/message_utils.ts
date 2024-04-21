import { ref as refRT, set, remove } from "firebase/database";
import { db, realTimeDB, ref, storage } from "../auth";
import {
  USERS_D,
  CHATS_D,
  EXISTING_CHATS,
  MESSAGES,
  RECEIVED_NEW_MESSAGES,
} from "../../firebase_storage_path_constants/firebase_storage_path_constants";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, getDownloadURL, uploadBytes } from "firebase/storage";
import { getBlobFroUri } from "./fs";

const generateUniqueFileName = (userId: string) => {
  return `${Date.now()}-${userId}-${Math.floor(Math.random() * 10000) + 1}`;
};

async function setIsUserTyping(
  chatId: string,
  user1Id: string,
  user2Id: string
) {
  try {
    await set(refRT(realTimeDB, `${CHATS_D}/${chatId}`), {
      [user1Id]: false,
      [user2Id]: false,
    });
  } catch (error) {
    console.log(error.message);
  }
}

const sendImages = async (
  imageList: any[],
  authUserId: string,
  chatId: string
) => {
  const uniqueId = generateUniqueFileName(authUserId);
  try {
    const imagesDateURL = await Promise.all( imageList.map( async(imageData) => await getBlobFroUri(imageData.uri)));
    const imageListWithUniqueId = imagesDateURL.map((dataURL) => ({
      id: uniqueId,
      data: dataURL,
    }));
    const imageURLS = await Promise.all(
      imageListWithUniqueId.map(
        async (imageDataURL: { id: string; data: Blob }) => {
          const imageRef = ref(
            storage,
            `${CHATS_D}/${chatId}/${imageDataURL.id}`
          );
          await uploadBytes(imageRef, imageDataURL.data);
          const url = await getDownloadURL(imageRef);
          return { url, imageId: imageDataURL.id };
        }
      )
    );
    await Promise.all(
      imageURLS.map(async ({ url, imageId }) => {
        await setDoc(doc(db, `${CHATS_D}/${chatId}/${MESSAGES}`, imageId), {
          id: imageId,
          senderId: authUserId,
          type: "image",
          content: url,
          timestamp: serverTimestamp(),
          isReaded: false,
          imageId,
        });
      })
    );
    await updateDoc(doc(db, `${CHATS_D}/${chatId}`), {
      lastMessage: {
        messageId: uniqueId,
        senderId: authUserId,
        message: "Received images data",
        isReaded: false,
      },
    });
  } catch (error) {
    console.log(error.message);
  }
};

const sendMessage = async (
  message: string,
  authUserId: string,
  chatId: string
) => {
  const messageId = Date.now() + authUserId;
  await setDoc(doc(db, `${CHATS_D}/${chatId}/${MESSAGES}`, messageId), {
    id: messageId,
    senderId: authUserId,
    type: "text",
    content: message,
    timestamp: serverTimestamp(),
    isReaded: false,
  });
  await updateDoc(doc(db, `${CHATS_D}/${chatId}`), {
    lastMessage: {
      messageId,
      senderId: authUserId,
      message,
      isReaded: false,
    },
  });
};

const setReceiveNewMessageStatus = async (chatId: string, userId: string) => {
  await set(
    refRT(realTimeDB, `${USERS_D}/${userId}/${RECEIVED_NEW_MESSAGES}`),
    {
      [chatId]: true,
    }
  );
};

const setViewedMessage = async (userId: string, chatId: string) => {
  await updateDoc(doc(db, `${CHATS_D}/${chatId}`), {
    "lastMessage.isReaded": true,
  });
  await remove(
    refRT(
      realTimeDB,
      `${USERS_D}/${userId}/${RECEIVED_NEW_MESSAGES}/${chatId}`
    )
  );
};

const deleteMessage = async (
  message: {
    id: string;
    type: string;
    imageId?: string;
  },
  chatId: string
) => {
  if (message.type === "text") {
    await deleteDoc(doc(db, `${CHATS_D}/${chatId}/${MESSAGES}/${message.id}`));
  } else if (message.type === "image") {
    await deleteObject(ref(storage, `${CHATS_D}/${chatId}/${message.imageId}`));
    await deleteDoc(doc(db, `${CHATS_D}/${chatId}/${MESSAGES}/${message.id}`));
  }
};

const deleteChat = async (
  messagesList: any,
  chatId: string,
  authUserId: string,
  companionId: string
) => {
  messagesList.forEach(
    (message: { id: string; type: string; imageId?: string }) =>
      deleteMessage(message, chatId)
  );
  await deleteDoc(
    doc(db, `${USERS_D}/${authUserId}/${EXISTING_CHATS}/${chatId}`)
  );
  await deleteDoc(
    doc(db, `${USERS_D}/${companionId}/${EXISTING_CHATS}/${chatId}`)
  );
  await deleteDoc(doc(db, `${CHATS_D}/${chatId}`));
};

const deleteChatDuringDeleteUserAccount = async (chatDoc: {
  chatId: string;
  myId: string;
  companion: string;
}) => {
  const messagesList = await getDocs(
    collection(db, `${CHATS_D}/${chatDoc.chatId}/${MESSAGES}`)
  );
  if (!messagesList.empty) {
    for (let messageDoc of messagesList.docs) {
      const messageData = messageDoc.data();
      await deleteMessage(
        messageData as { id: string; type: string; imageId?: string },
        chatDoc.chatId
      );
    }
  }

  await deleteDoc(
    doc(db, `${USERS_D}/${chatDoc.myId}/${EXISTING_CHATS}/${chatDoc.chatId}`)
  );
  await deleteDoc(
    doc(
      db,
      `${USERS_D}/${chatDoc.companion}/${EXISTING_CHATS}/${chatDoc.chatId}`
    )
  );
  await deleteDoc(doc(db, `${CHATS_D}/${chatDoc.chatId}`));
};

const createChatDoc = async (myId: string, friendsId: string) => {
  const chatId = generateUniqueFileName(`${myId}${friendsId}`);
  await setDoc(doc(db, CHATS_D, chatId), {
    id: chatId,
    private: true,
    [myId]: true,
    [friendsId]: true,
    user1: myId,
    user2: friendsId,
  });
  await setDoc(doc(db, `${USERS_D}/${myId}/${EXISTING_CHATS}`, chatId), {
    myId,
    companion: friendsId,
    chatId: chatId,
  });
  await setDoc(doc(db, `${USERS_D}/${friendsId}/${EXISTING_CHATS}`, chatId), {
    myId: friendsId,
    companion: myId,
    chatId: chatId,
  });
};

export {
  sendImages,
  setIsUserTyping,
  sendMessage,
  setViewedMessage,
  deleteMessage,
  deleteChat,
  createChatDoc,
  deleteChatDuringDeleteUserAccount,
  setReceiveNewMessageStatus,
};
