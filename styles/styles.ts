import { StyleSheet } from "react-native";

const gStyle = StyleSheet.create({
  temporary: {
    borderWidth: 1,
    borderColor: "red",
    borderStyle: "solid",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  main: {
    flex: 1,
  },
  loginPage__container: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    gap: 35,
  },
  loginPage__choosePhotoButton: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderStyle: "dotted",
    borderColor: "#8c8c8c",
    borderRadius: 100,
    padding: 20,
  },
  loginPage__imageContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  loginPage__helperText: {
    position: "absolute",
    bottom: -25,
  },
  loginPage__title: {
    color: "red",
    fontSize: 40,
  },
  loginPage__input: {
    width: 250,
  },
  ownPage__container: {
    padding: 10,
  },
  ownPage__PD_container: {
    flexDirection: "row",
    gap: 20,
    overflow: "hidden",
  },
  ownPage_PD_text_container: {
    maxWidth: "100%",
    overflow: "hidden",
    gap: 10,
  },
  avatar_space: {
    maxHeight: "100%",
    overflow: "hidden",
  },
  chatPage__input: {
    backgroundColor: "#dfe3ee",
    maxHeight: 100,
    width: '100%',

  },
});
export {gStyle}