import React, { useEffect, useState, useRef } from "react";
import { Image, View, Animated } from "react-native";
import { TextInput, FAB } from "react-native-paper";
import { gStyle } from "../../styles/styles";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";

interface IChatFooter {
  isAuthUserTyping: boolean;
  sendMessage: (
    message: string,
    imageList: Array<ImagePicker.ImagePickerAsset[]>
  ) => void;
  handleError: (error: string) => void;
  handleSetTypingStatus: (status: boolean) => void;
  isCompanionTyping: string | false;
}

function ChatFooter({
  sendMessage,
  handleError,
  isAuthUserTyping,
  handleSetTypingStatus,
  isCompanionTyping,
}: IChatFooter) {
  const [message, setMessage] = useState("");
  const [imagesForSend, setImagesForSend] = useState([]);
  const { t } = useTranslation();

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
        allowsMultipleSelection: true,
        selectionLimit: 5,
      });

      if (!result.canceled) {
        setImagesForSend(result.assets);
      }
    } catch (error) {
      handleError(error.message);
    }
  };

  const handleSendMessage = async () => {
    await sendMessage(message, imagesForSend);
    setMessage("");
    setImagesForSend([]);
  };

  useEffect(() => {
    if (!isAuthUserTyping && message) {
      handleSetTypingStatus(true);
    }
    const timer1Id = setTimeout(() => {
      handleSetTypingStatus(false);
    }, 3000);
    return () => {
      clearTimeout(timer1Id);
    };
  }, [message]);


  return (
    <View style={{ marginTop: 40 }}>
      {!!imagesForSend.length && (
        <View
          style={{
            position: "absolute",
            top: 0,
            transform: [{ translateY: -60 }],
            padding: 5,
            backgroundColor: "#3b5998",
            borderRadius: 5,
          }}
        >
          <View style={{ flexDirection: "row", gap: 5 }}>
            <FAB
              icon={"trash-can"}
              onPress={() => setImagesForSend([])}
              style={{
                width: 40,
                height: 40,
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                top: 5,
                right: -55,
                backgroundColor: "#dfe3ee",
              }}
            />
            {imagesForSend.map((imageData) => (
              <Image
                key={imageData.uri}
                style={{ width: 50, height: 50, borderRadius: 5 }}
                source={{ uri: imageData.uri }}
              />
            ))}
          </View>
        </View>
      )}
      {isCompanionTyping && (
        <View style={{position:'absolute', top:-25,left:5}}>
          <TypingPlaceholder name={isCompanionTyping} />
        </View>
      )}
      <TextInput
        style={gStyle.chatPage__input}
        multiline={true}
        activeUnderlineColor="#3b5998"
        placeholder={t("messagePage.write")}
        value={message}
        cursorColor={"#000"}
        onChangeText={setMessage}
        right={
          (message.trim() || !!imagesForSend.length) && (
            <TextInput.Icon
              onPress={handleSendMessage}
              forceTextInputFocus={false}
              icon="send"
            />
          )
        }
        left={
          <TextInput.Icon
            onPress={pickImage}
            forceTextInputFocus={false}
            icon="image-area"
          />
        }
      />
    </View>
  );
}

export { ChatFooter };
  
  
const TypingPlaceholder = ({ name }: { name: string }) => {
  const {t} = useTranslation()
   const fadeAnim = useRef(new Animated.Value(0)).current;

   const startAnimation = () => {
     Animated.loop(
       Animated.sequence([
         Animated.timing(fadeAnim, {
           toValue: 1,
           duration: 1200,
           useNativeDriver: true,
         }),
         Animated.timing(fadeAnim, {
           toValue: 0,
           duration: 1200,
           useNativeDriver: true,
         }),
       ]),
       { iterations: -1 }
     ).start();
   };

   useEffect(() => {
     startAnimation();
   }, []);

   return (
     <Animated.Text
       style={{
         opacity: fadeAnim,
         fontSize: 16,
         textAlign: "center",
         color: "#3b5998",
       }}
     >
       {t("messagePage.typing", { name: name })}
     </Animated.Text>
   );
}