import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  FlatList,
} from 'react-native';
import sizeHelper from '../../../utils/Helpers';
import {theme} from '../../../utils/Themes';
import ScreenLayout from '../../../components/ScreenLayout';
import CustomButton from '../../../components/Button';
import CustomText from '../../../components/Text';
import {fonts} from '../../../utils/Themes/fonts';
import CustomInput from '../../../components/Input';
import {appStyles} from '../../../utils/GlobalStyles';
import icons from '../../../utils/Constants/icons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {emailRegex, passwordRegex} from '../../../utils/Regex';
import CustomHeader from '../../../components/Header/inde';
import NotificationCard from './NotificationCard';

const NotificationScreen = ({navigation}: any) => {
  const [focusedInput, setFocusedInput] = useState(null);

  const [isMessage, setIsMessage] = useState<any>(false);
  const [message, setMessage] = useState<any>('');
  const [messageColor, setMessageColor] = useState(theme.colors.primary);
  const [loading, setloading] = useState(false);
  const [errors, setErrors] = useState({
    username_error: '',
    shop_name_error: '',
    email_error: '',
    password_error: '',
  });

  const [values, setValues] = useState({
    username: 'umari719',
    shop_name: 'Green Grocer',
    phone: '011111111111',
    email: '',
    password: '',
  });

   const notificationCardData = [
    {
        title: "Speeding your way",
        description: "Lorem ipsum dolor sit amet ab ipsam ut dolores mai",
        // image: images.shippingFast
    },
    {
        title: "Order Delivered",
        description: "Lorem ipsum dolor sit amet ab ipsam ut dolores mai",
        // image: images.checkCircle
    },
    {
        title: "Order Cancelled",
        description: "Lorem ipsum dolor sit amet ab ipsam ut dolores mai",
        // image: images.crossCircle
    },
    {
        title: "Order Delivered",
        description: "Lorem ipsum dolor sit amet ab ipsam ut dolores mai",
        // image: images.checkCircle
    },
    {
        title: "Order Delivered",
        description: "Lorem ipsum dolor sit amet ab ipsam ut dolores mai",
        // image: images.checkCircle
    },
]

  const onSignup = () => {
    Keyboard.dismiss();

    if (!values?.username) {
      setMessage('Username is required');
      setIsMessage(true);
      setMessageColor(theme.colors.red);

      return;
    }

    if (!values?.shop_name) {
      setMessage('Shop Name is required');
      setIsMessage(true);
      setMessageColor(theme.colors.red);

      return;
    }
    if (!values?.email) {
      setMessage('Email is required');
      setIsMessage(true);
      return false;
    }
    if (values?.email) {
      if (!emailRegex.test(values?.email)) {
        setMessage('Invalid Email Address');
        setIsMessage(true);
        setMessageColor(theme.colors.red);

        return;
      }
    }
    if (!values?.password) {
      setMessage('Password is required');
      setIsMessage(true);
      setMessageColor(theme.colors.red);

      return;
    }
    if (!passwordRegex.test(values?.password)) {
      setMessage(
        'Your password must be at least 8 characters long, including an uppercase letter, a lowercase letter, a number, and a special character',
      );
      setIsMessage(true);
      setMessageColor(theme.colors.red);

      return;
    }

    navigation.navigate('BottomTab');
  };

  return (
    <ScreenLayout
      style={{
        flex: 1,
        paddingHorizontal: sizeHelper.calWp(50),
        paddingTop: sizeHelper.calHp(10),
      }}>
      <CustomHeader title={'Notification'} />

      <View style={{gap: sizeHelper.calHp(8), flex: 1}}>
      <FlatList
            data={notificationCardData}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: 20,
            }}
           
            renderItem={({ item }) => {
              return <NotificationCard data={item} />;
            }}
          />
      </View>
    </ScreenLayout>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  botttom: {
    gap: sizeHelper.calHp(20),
    paddingTop: '100%',
  },
});
