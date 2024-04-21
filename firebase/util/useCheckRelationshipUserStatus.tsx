import React from 'react'
import { useDocument } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';
import { db } from '../../firebase/auth';
import {
  FRIEND,
  SENTREQUEST,
  RECEIVED_REQUEST,
  NO_CONTACT,
  LOADING
} from "./contact_status";
import { FRIENDS_LIST, RECEIVED_FRIENDS_REQUESTS, SENT_FRIENDS_REQUESTS, USERS_D } from '../../firebase_storage_path_constants/firebase_storage_path_constants';



function useCheckRelationshipUserStatus( authUserId:string, checkingUserId:string, handleError:(message:string) => void ) {
  const [isFriend, loadingIF, errorIF] = useDocument(
    doc(db, `/${USERS_D}/${authUserId}/${FRIENDS_LIST}/${checkingUserId}`)
  );
  const [isSentFriendRequest, loadingISFR, errorISFR] = useDocument(
    doc(db, `/${USERS_D}/${authUserId}/${SENT_FRIENDS_REQUESTS}/${checkingUserId}`)
  );
  const [isReceivedFriendRequest, loadingIRFR, errorIRFR] = useDocument(
    doc(
      db,
      `/${USERS_D}/${authUserId}/${RECEIVED_FRIENDS_REQUESTS}/${checkingUserId}`
    )
  );
  if (errorIF || errorISFR || errorIRFR) {
    handleError(errorIF.message || errorISFR.message || errorIRFR.message);
    return
  }
    if (loadingIF || loadingISFR || loadingIRFR) {
      return LOADING;
    };

  if(isFriend?.exists()){
    return FRIEND
  }
  if (isSentFriendRequest?.exists()) {
    return SENTREQUEST
  }
  if (isReceivedFriendRequest?.exists()) {
    return RECEIVED_REQUEST;
  }
  return NO_CONTACT
}

export { useCheckRelationshipUserStatus };