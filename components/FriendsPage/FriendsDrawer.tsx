import { collection } from 'firebase/firestore';
import React from 'react';
import { Text, ActivityIndicator } from 'react-native-paper';
import { db } from '../../firebase/auth';
import { FRIENDS_LIST, RECEIVED_FRIENDS_REQUESTS, SENT_FRIENDS_REQUESTS, USERS_D } from '../../firebase_storage_path_constants/firebase_storage_path_constants';
import { useAuthUser } from '../CustomeComponent/useAuthUser';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { View } from 'react-native';
import { UsersList } from './UsersList';

type UserList = { id: string };

function FriendsDrawer() {
  const authUser = useAuthUser()
    const [friendsList, loadingFL, errorFL] = useCollectionData(
      collection(db, `${USERS_D}/${authUser.uid}/${FRIENDS_LIST}`)
  );
  const [receivedFriendsRequest, loadingRFR, errorRFR] = useCollectionData(
    collection(db, `${USERS_D}/${authUser.uid}/${RECEIVED_FRIENDS_REQUESTS}`)
  );
  const [sentFriendsRequest, loadingSFR, errorSFR] = useCollectionData(
    collection(db, `${USERS_D}/${authUser.uid}/${SENT_FRIENDS_REQUESTS}`)
  );
  
  if (loadingFL || loadingRFR || loadingSFR) {
    return (
      <View>
        <ActivityIndicator animating={true} color="#8b9dc3" size={20} />
      </View>
    );
  }

  return (
    <View style={{ padding: 10, flex: 1 }}>
      <UsersList sentFriendsList={sentFriendsRequest as Array<UserList>} receivedFriendsRequest={receivedFriendsRequest as Array<UserList>} friendsList={friendsList as Array<UserList>} />
    </View>
  );
}

export  {FriendsDrawer}