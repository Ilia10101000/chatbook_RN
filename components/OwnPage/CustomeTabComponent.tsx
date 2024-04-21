import React from "react";
import { View } from "react-native";

function CustomeTabComponent({
  index,
  value,
  children,
}: {
  index: string;
  value: string;
  children: React.ReactNode;
}) {
  return <View style={index !== value && { display: "none" }}>{children}</View>;
}

export { CustomeTabComponent };
