import {
  removeFromFriendsList,
  cancelFriendRequest,
} from "./ContactButton";
import { deletePost, deletePersonalTag } from "./post_utils";
import { deleteChatDuringDeleteUserAccount } from "./message_utils";
import { deleteObject } from "firebase/storage";
import {
  USERS_D,
  EXISTING_CHATS,
  FRIENDS_LIST,
  POSTS,
  RECEIVED_FRIENDS_REQUESTS,
  SENT_FRIENDS_REQUESTS,
  TAGS_IN_THIRD_PARTY_POSTS,
  AVATAR_S,
} from "../../firebase_storage_path_constants/firebase_storage_path_constants";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db, storage, ref } from "../auth";
import { User, deleteUser } from "firebase/auth";

const deleteUserAccount = async (authUser: User) => {

  const {uid, photoURL} = authUser;
  

  await deleteUser(authUser);

  const collectionsRefs = [
    {
      callback: deleteChatDuringDeleteUserAccount,
      ref: collection(db, `${USERS_D}/${uid}/${EXISTING_CHATS}`),
    },
    {
      callback: deletePost,
      ref: collection(db, `${USERS_D}/${uid}/${POSTS}`),
    },
    {
      callback: deletePersonalTag,
      ref: collection(
        db,
        `${USERS_D}/${uid}/${TAGS_IN_THIRD_PARTY_POSTS}`
      ),
    },
  ];
  for (let task of collectionsRefs) {
    const response = await getDocs(task.ref);
    if (!response.empty) {
      let docs = response.docs.map((doc) => doc.data());
      for (let doc of docs) {
        await task.callback(doc as any);
      }
    }
  }
  
  const friendsListSnapShot = await getDocs(
    collection(db, `${USERS_D}/${uid}/${FRIENDS_LIST}`)
    );
    if (!friendsListSnapShot.empty) {
      const docs = friendsListSnapShot.docs.map((doc) => doc.data());
      for (let doc of docs) {
        await removeFromFriendsList({ user1Id: uid, user2Id: doc.id });
      }
    }
    const receivedFriendsRequiresListSnapShot = await getDocs(
      collection(db, `${USERS_D}/${uid}/${RECEIVED_FRIENDS_REQUESTS}`)
      );
      if (!receivedFriendsRequiresListSnapShot.empty) {
        const docs = receivedFriendsRequiresListSnapShot.docs.map((doc) =>
        doc.data()
        );
        for (let doc of docs) {
          await cancelFriendRequest({ user2Id: uid, user1Id: doc.id });
        }
      }
      const sentFriendsRequiresListSnapShot = await getDocs(
        collection(db, `${USERS_D}/${uid}/${SENT_FRIENDS_REQUESTS}`)
  );
  if (!sentFriendsRequiresListSnapShot.empty) {
    const docs = sentFriendsRequiresListSnapShot.docs.map((doc) => doc.data());
    for (let doc of docs) {
      await cancelFriendRequest({ user1Id: uid, user2Id: doc.id });
    }
  }
  
  if (
    photoURL &&
    photoURL.startsWith("https://firebasestorage.googleapis.com/")
  ) {
    await deleteObject(ref(storage, `${AVATAR_S}/${uid}/${AVATAR_S}`));
  }
  
  await deleteDoc(doc(db, USERS_D, authUser.uid));
  

};

export { deleteUserAccount };
