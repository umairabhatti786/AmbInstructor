import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
} from 'react-native';
import {useState} from 'react';
import CustomText from '../Text';

import sizeHelper, {screenWidth, screentHeight} from '../../utils/Helpers';
import {theme} from '../../utils/Themes';
import {appStyles} from '../../utils/GlobalStyles';
import {fonts} from '../../utils/Themes/fonts';
import icons from '../../utils/Constants/icons';
import {dollarSymbol, generateUniqueIdGenerator} from '../../utils/CommonHooks';
import {useDispatch, useSelector} from 'react-redux';
import {
  getCartData,
  setCartData,
  setUpdateCartItem,
} from '../../redux/reducers/cartReducer';
import CarouselProductCard from '../CarouselProductCard';
const CarouselCard = ({data, onPress, disabled}: any) => {
  return (
    <View>
      <FlatList
        data={data}
        horizontal
        style={{
          paddingLeft: sizeHelper.calWp(50),
        }}
        contentContainerStyle={{
          gap: sizeHelper.calWp(20),
          paddingRight: sizeHelper.calWp(Platform.OS == 'ios' ? 40 : 100),
        }}
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}: any) => {
          return (
            <>
              <CarouselProductCard item={item} />
            </>
          );
        }}
      />
    </View>
  );
};
export default CarouselCard;

const styles = StyleSheet.create({
  mainItem: {
    width: screenWidth / 1.3,
    marginRight: 15,
    marginVertical: 10,
    borderRadius: sizeHelper.calHp(5),
  },

  Container: {
    height: screentHeight / 4,
    width: screenWidth / 2.4,
    borderWidth: 1,
    borderColor: '#F2F2F2',
    overflow: 'hidden',
    backgroundColor: theme.colors.white,
    borderRadius: sizeHelper.calWp(15),
  },

  inputContainer: {
    flex: 1,
    fontSize: sizeHelper.calHp(22),
    fontFamily: fonts.Poppins_Regular,
    padding: 0,
  },
  quantityMain: {
    alignItems: 'center',
    justifyContent: 'center',
    height: sizeHelper.calWp(55),
    width: sizeHelper.calWp(55),
  },
  quantityInner: {
    height: sizeHelper.calWp(45),
    width: sizeHelper.calWp(45),
    backgroundColor: theme.colors.primary,
    borderRadius: sizeHelper.calWp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity_icon: {
    width: sizeHelper.calWp(23),
    height: sizeHelper.calWp(23),
  },
});
