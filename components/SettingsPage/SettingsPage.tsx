import React, { useState } from 'react';
import { Button, Text } from 'react-native-paper';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/auth';
import { View, TouchableHighlight, ScrollView } from 'react-native';
import { useAuthUser } from '../CustomeComponent/useAuthUser';
import { useTranslation } from 'react-i18next';
import { CustomeTabComponent } from '../OwnPage/CustomeTabComponent';
import { PersonalData } from './PersonalData';
import { Theme } from './Theme';
import { Security } from './Security';
import { Account } from './Account';

function SettingsPage() {

  const [page, setPage] = useState('0');
  const authUser = useAuthUser();
  const { t } = useTranslation();
  const buttons = [
    {
      value: "0",
      label: t("settingsPage.personalData"),
    },
    {
      value: "1",
      label: t("settingsPage.theme"),
    },
    {
      value: "2",
      label: t("settingsPage.security"),
    },
    {
      value: "3",
      label: t("settingsPage.account"),
    },
  ];
  return (
    <View style={{flex:1, padding:10}}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          borderRadius: 5,
          overflow: "hidden" ,
          marginBottom:20
        }}
      >
        {buttons.map((item) => (
          <TouchableHighlight
            key={item.value}
            underlayColor="transparent"
            onPress={() => setPage(item.value)}
            style={{
              flexGrow: 1,
              padding: 10,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: item.value === page ? "#3b5998" : "#f7f7f7",
            }}
          >
            <Text style={{ color: item.value === page ? "#fff" : "#000" }}>
              {item.label}
            </Text>
          </TouchableHighlight>
        ))}
      </View>
      <CustomeTabComponent index="0" value={page}>
        <PersonalData user={authUser}/>
      </CustomeTabComponent>
      <CustomeTabComponent index="1" value={page}>
        <Theme/>
      </CustomeTabComponent>
      <CustomeTabComponent index="2" value={page}>
        <Security user={authUser}/>
      </CustomeTabComponent>
      <CustomeTabComponent index="3" value={page}>
        <Account/>
      </CustomeTabComponent>
    </View>
  );
}

export {SettingsPage}