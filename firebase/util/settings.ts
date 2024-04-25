import { doc, updateDoc } from "firebase/firestore";
import { storage, ref, db } from "../auth";
import {
  AVATAR_S,
  USERS_D,
} from "../../firebase_storage_path_constants/firebase_storage_path_constants";
import { User, updateProfile, updatePassword } from "firebase/auth";
import { deleteObject, getDownloadURL, uploadBytes } from "firebase/storage";
import { getBlobFroUri } from "./fs";

const saveImage = async (fsPhotoURL: string, user: User) => {
  const storageRef = ref(storage, `${AVATAR_S}/${user.uid}/${AVATAR_S}`);
  const blobImageData = await getBlobFroUri(fsPhotoURL);
  await uploadBytes(storageRef, blobImageData as Blob);

  const photourlLink = await getDownloadURL(
    ref(storage, `${AVATAR_S}/${user.uid}/${AVATAR_S}`)
  );
  await updateDoc(doc(db, USERS_D, user.uid), {
    photoURL: photourlLink,
  });
  await updateProfile(user, { photoURL: photourlLink });
};

const changeUserName = async (displayName: string, user: User) => {
  const changedUserData = {
    displayName,
    searchQuery: displayName.toLowerCase(),
  };

  await updateDoc(doc(db, USERS_D, user.uid), changedUserData);
  await updateProfile(user, { displayName });
};

const deleteUserPhoto = async (user: User) => {
  if (user.photoURL.startsWith("https://firebasestorage.googleapis.com/")) {
    await deleteObject(ref(storage, `${AVATAR_S}/${user.uid}/${AVATAR_S}`));
  }
  await updateProfile(user, {
    photoURL: "",
  });
  await updateDoc(doc(db, USERS_D, user.uid), { photoURL: "" });
};

export { deleteUserPhoto, saveImage, changeUserName };
