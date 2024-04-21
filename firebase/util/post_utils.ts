import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db, ref, storage } from "../auth";
import {
  LIKES,
  USERS_D,
  COMMENTS,
  MARKED_PERSONS,
  POSTS,
  TAGS_IN_THIRD_PARTY_POSTS,
} from "../../firebase_storage_path_constants/firebase_storage_path_constants";
import { deleteObject } from "firebase/storage";
import { User } from "firebase/auth";

const generateUniqueFileName = (userId: string) => {
  return `${Date.now()}-${userId}-${Math.floor(Math.random() * 10000) + 1}`;
};

const addComment = async (
  userId: string,
  postId: string,
  authUser: User,
  comment: string
) => {
  const uniqueCommentsId = generateUniqueFileName(userId);
  await setDoc(
    doc(
      db,
      `${USERS_D}/${userId}/${POSTS}/${postId}/${COMMENTS}`,
      uniqueCommentsId
    ),
    {
      id: uniqueCommentsId,
      ownerPostId: userId,
      postId: postId,
      authorId: authUser.uid,
      authorPhotoURL: authUser.photoURL,
      text: comment,
      timestamp: serverTimestamp(),
    }
  );
};

const removeComment = async (comment: {
  ownerPostId: string;
  postId: string;
  id: string;
}) => {
  await deleteDoc(
    doc(
      db,
      `${USERS_D}/${comment.ownerPostId}/${POSTS}/${comment.postId}/${COMMENTS}`,
      comment.id
    )
  );
};

const deletePersonalTag = async (tagData: {
  id: string;
  personId?: string;
  ownerPostId: string;
  postId: string;
}) => {
  await deleteDoc(
    doc(
      db,
      `${USERS_D}/${tagData.ownerPostId}/${POSTS}/${tagData.postId}/${MARKED_PERSONS}`,
      tagData.id
    )
  );
  if (tagData.personId !== tagData.ownerPostId) {
    await deleteDoc(
      doc(
        db,
        `${USERS_D}/${tagData.personId}/${TAGS_IN_THIRD_PARTY_POSTS}`,
        tagData.id
      )
    );
  }
};

const removeLike = async (likeDoc: {
  id: string;
  ownerPostId: string;
  postId: string;
}) => {
  await deleteDoc(
    doc(
      db,
      `${USERS_D}/${likeDoc.ownerPostId}/${POSTS}/${likeDoc.postId}/${LIKES}`,
      likeDoc.id
    )
  );
};

const toogleVisibilityComments = async (
  userId: string,
  postId: string,
  isShown: boolean
) => {
  const postRef = doc(db, `${USERS_D}/${userId}/${POSTS}/${postId}`);
  await updateDoc(postRef, { showComments: isShown });
};

const deletePost = async (post: {
  id: string;
  imageURL: string;
  ownerPostId: string;
  showComments: boolean;
  text: string;
}) => {
  const collectionsRefs = [
    {
      callback: deletePersonalTag,
      ref: collection(
        db,
        `${USERS_D}/${post.ownerPostId}/${POSTS}/${post.id}/${MARKED_PERSONS}`
      ),
    },
    {
      callback: removeLike,
      ref: collection(
        db,
        `${USERS_D}/${post.ownerPostId}/${POSTS}/${post.id}/${LIKES}`
      ),
    },
    {
      callback: removeComment,
      ref: collection(
        db,
        `${USERS_D}/${post.ownerPostId}/${POSTS}/${post.id}/${COMMENTS}`
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

  await deleteDoc(
    doc(db, `${USERS_D}/${post.ownerPostId}/${POSTS}/${post?.id}`)
  );
  await deleteObject(ref(storage, `${POSTS}/${post.ownerPostId}/${post?.id}`));
};

const updateTagCords = async (
  postId: string,
  userId: string,
  tagId: string,
  cords: { x: string; y: string }
) => {
  const docRef = doc(
    db,
    `${USERS_D}/${userId}/${POSTS}/${postId}/${MARKED_PERSONS}`,
    tagId
  );
  await updateDoc(docRef, {
    ...cords,
  });
};

const addUserTag = async (
  postId: string,
  ownerPostId: string,
  personId: string,
  newTagCords: { x: string; y: string }
) => {
  const tagId = generateUniqueFileName(personId);

  await setDoc(
    doc(
      db,
      `${USERS_D}/${ownerPostId}/${POSTS}/${postId}/${MARKED_PERSONS}`,
      tagId
    ),
    {
      id: tagId,
      ...newTagCords,
      personId,
      ownerPostId,
      postId,
    }
  );

  if (personId !== ownerPostId) {
    await setDoc(
      doc(db, `${USERS_D}/${personId}/${TAGS_IN_THIRD_PARTY_POSTS}`, tagId),
      {
        id: tagId,
        ownerPostId,
        postId,
        timestamp: serverTimestamp(),
      }
    );
  }
};

export {
  deletePost,
  removeComment,
  deletePersonalTag,
  addComment,
  toogleVisibilityComments,
  updateTagCords,
  addUserTag,
};
