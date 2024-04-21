import React from 'react'
import { Image, Dimensions } from 'react-native';

function OwnPostListItem({ post }) {
  const imageDimension = Math.floor((Dimensions.get('window').width - 37) / 3)
  return (
    <Image
      style={{ width: imageDimension, height: imageDimension, borderRadius: 10 }}
      source={{ uri: post.imageURL }}
    />
  );
}

export {OwnPostListItem}