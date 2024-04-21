import React, { ReactNode, useState } from "react";
import {
  USERS_D,
  SENT_FRIENDS_REQUESTS,
  RECEIVED_FRIENDS_REQUESTS,
  FRIENDS_LIST,
} from "../../firebase_storage_path_constants/firebase_storage_path_constants";
import {
  FRIEND,
  SENTREQUEST,
  RECEIVED_REQUEST,
  NO_CONTACT,
  LOADING,
} from "./contact_status";
import { ref as refRT, set,remove } from "firebase/database";
import { useCheckRelationshipUserStatus } from "./useCheckRelationshipUserStatus";
import { db, realTimeDB } from "../../firebase/auth";
import { Button, ActivityIndicator } from "react-native-paper";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { DocumentData } from "firebase/firestore";
import { User } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

type Status =
  | typeof FRIEND
  | typeof SENTREQUEST
  | typeof RECEIVED_REQUEST
  | typeof NO_CONTACT
  | typeof LOADING;

interface IContactButton {
  user: DocumentData;
  authUser: User;
  handleError: (errorMessage: string) => void;
}

interface IButtonProp {
  label: string | ReactNode;
  icon: IconSource | null;
  onPress: ({ user1Id, user2Id }) => void | null;
  buttonColor: string;
}

const sendFriendRequest = async ({user1Id,user2Id}:{user1Id:string;user2Id:string}) => {
    await setDoc(
      doc(db, `${USERS_D}/${user1Id}/${SENT_FRIENDS_REQUESTS}`, user2Id),
      {
        id: user2Id,
      }
    );
    await setDoc(
      doc(db, `${USERS_D}/${user2Id}/${RECEIVED_FRIENDS_REQUESTS}`, user1Id),
      {
        id: user1Id,
      }
  );
  await set(
    refRT(realTimeDB, `${USERS_D}/${user2Id}/${RECEIVED_FRIENDS_REQUESTS}`),
    {
      [user1Id]: true,
    }
  );
};

const removeFromFriendsList = async ({user1Id,user2Id}:{user1Id:string;user2Id:string}) => {
    await deleteDoc(
      doc(db, `${USERS_D}/${user1Id}/${FRIENDS_LIST}/`, user2Id)
    );
    await deleteDoc(
      doc(db, `${USERS_D}/${user2Id}/${FRIENDS_LIST}/`, user1Id)
    );
};

const cancelFriendRequest = async ({user1Id,user2Id}:{user1Id:string;user2Id:string}) => {
      await deleteDoc(
        doc(
          db,
          `${USERS_D}/${user1Id}/${SENT_FRIENDS_REQUESTS}/`,
          user2Id
        )
      );
      await deleteDoc(
        doc(
          db,
          `${USERS_D}/${user2Id}/${RECEIVED_FRIENDS_REQUESTS}/`,
          user1Id
        )
  );
  await remove(
    refRT(
      realTimeDB,
      `${USERS_D}/${user2Id}/${RECEIVED_FRIENDS_REQUESTS}/${user1Id}`
    )
  );
  }

const acceptFriendRequest = async ({user1Id,user2Id}:{user1Id:string;user2Id:string}) => {
      await deleteDoc(
        doc(
          db,
          `${USERS_D}/${user2Id}/${SENT_FRIENDS_REQUESTS}/`,
          user1Id
        )
      );
      await deleteDoc(
        doc(
          db,
          `${USERS_D}/${user1Id}/${RECEIVED_FRIENDS_REQUESTS}/`,
          user2Id
        )
      );
      await setDoc(
        doc(db, `${USERS_D}/${user1Id}/${FRIENDS_LIST}`, user2Id),
        {
          id: user2Id,
        }
      );
      await setDoc(
        doc(db, `${USERS_D}/${user2Id}/${FRIENDS_LIST}`, user1Id),
        {
          id: user1Id,
        }
  );
  await remove(
    refRT(
      realTimeDB,
      `${USERS_D}/${user1Id}/${RECEIVED_FRIENDS_REQUESTS}/${user2Id}`
    )
  );
  }



  
  function ContactButton({
    authUser,
    user,
    handleError,
  }: IContactButton) {
    const [waitingRequestProcessing, setWaitingRequestProcessing] =
    useState(false);
    
    const status: Status = useCheckRelationshipUserStatus(
      authUser.uid,
      user?.id,
      handleError
    );
    
    const {t} = useTranslation()
      const shownButton: { [key: string]: IButtonProp } = {
        [FRIEND]: {
          label: t("contactButton.remove"),
          onPress: removeFromFriendsList,
          buttonColor: "#dfe3ee",
          icon: "account-minus",
        },
        [SENTREQUEST]: {
          label: t("contactButton.cancel"),
          onPress: cancelFriendRequest,
          buttonColor: "#dfe3ee",
          icon: "account-cancel",
        },
        [RECEIVED_REQUEST]: {
          label: t("contactButton.accept"),
          onPress: acceptFriendRequest,
          buttonColor: "#dfe3ee",
          icon: "account-check",
        },
        [NO_CONTACT]: {
          label: t("contactButton.send"),
          onPress: sendFriendRequest,
          buttonColor: "#dfe3ee",
          icon: "account-plus",
        },
        [LOADING]: {
          label: (
            <ActivityIndicator size={25} animating={true} color={"#8b9dc3"} />
          ),
          onPress: null,
          buttonColor: "#dfe3ee",
          icon: null,
        },
      };

  const handleClickContactButton = async () => {
    setWaitingRequestProcessing(true);
    try {
      shownButton[status].onPress({ user1Id: authUser.uid, user2Id: user.id });
    } catch (error) {
      handleError(error.message);
    } finally {
      setWaitingRequestProcessing(false);
    }
  };
  return (
      <Button
        icon={shownButton[status].icon}
        color={shownButton[status].buttonColor}
        disabled={waitingRequestProcessing || status === LOADING}
        onPress={handleClickContactButton}
      >
        {shownButton[status].label}
      </Button>
  );
}

export {
  ContactButton,
  cancelFriendRequest,
  removeFromFriendsList,
  acceptFriendRequest,
};
