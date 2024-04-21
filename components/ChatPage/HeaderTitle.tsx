import React, { useEffect, useState } from "react";
import { View, Image } from "react-native";
import { Text } from "react-native-paper";
import { UserAvatar } from "../CustomeComponent/UserAvatar";
import { useObjectVal } from "react-firebase-hooks/database";
import { realTimeDB } from "../../firebase/auth";
import { ref } from "firebase/database";
import {
  PRESENT,
  USERS_D,
} from "../../firebase_storage_path_constants/firebase_storage_path_constants";
import { useTranslation } from "react-i18next";

type IisOnlineSnapShot = {
  isOnline: boolean;
  lastVisit: any;
};

function HeaderTitle({ displayName, photoURL, userId }) {
  const [isOnlineSnapShot, loading, error] = useObjectVal<IisOnlineSnapShot>(
    ref(realTimeDB, `${USERS_D}/${userId}/${PRESENT}`)
  );
  const [lastVisitMessage, setLastVisitMessage] = useState<string>("");

  const { t } = useTranslation();

  useEffect(() => {
    if (!!isOnlineSnapShot?.lastVisit && !isOnlineSnapShot?.isOnline) {
      let minutesleft = Math.floor(
        (Date.now() - isOnlineSnapShot.lastVisit) / (1000 * 60)
      );
      if (minutesleft >= 0 && minutesleft < 2) {
        setLastVisitMessage(t("left.justLeft"));
      } else if (minutesleft >= 2 && minutesleft < 60) {
        setLastVisitMessage(t("left.minutes", { minutes: minutesleft }));
      } else if (minutesleft >= 60 && minutesleft < 1440) {
        let hours = Math.floor(minutesleft / 60);
        setLastVisitMessage(t("left.hours", { hours }));
      } else if (minutesleft >= 1440 && minutesleft < 11520) {
        let days = Math.floor(minutesleft / (60 * 24));
        setLastVisitMessage(t("left.days", { days }));
      } else if (minutesleft >= 11520 && minutesleft < 46080) {
        let weeks = Math.floor(minutesleft / (60 * 24 * 7));
        setLastVisitMessage(t("left.weeks", { weeks }));
      } else if (minutesleft >= 46080 && minutesleft < 276480) {
        let months = Math.floor(minutesleft / (60 * 24 * 7 * 4));
        setLastVisitMessage(t("left.months", { months }));
      } else if (minutesleft >= 276480) {
        setLastVisitMessage(t("left.longTimeAgo"));
      }
    } else if (isOnlineSnapShot?.isOnline && lastVisitMessage) {
      setLastVisitMessage('')
    }
  }, [isOnlineSnapShot?.isOnline]);

  if (loading) {
    return null;
  }

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      <UserAvatar displayName={displayName} photoURL={photoURL} size={50} />
      <View>
        <Text numberOfLines={1} ellipsizeMode="tail" variant="bodyLarge">
          {displayName}
        </Text>
        <Text numberOfLines={1} ellipsizeMode="tail" variant="bodySmall">
          {!!isOnlineSnapShot?.isOnline ? "Online" : lastVisitMessage ? lastVisitMessage: null}
        </Text>
      </View>
    </View>
  );
}

export { HeaderTitle };
