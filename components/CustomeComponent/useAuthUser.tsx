import React, { useContext } from "react";
import { AuthUserContext } from "../../App";


const useAuthUser = () => {
  return useContext(AuthUserContext);
};
export { useAuthUser };
