import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
  Alert,
  Platform,
} from 'react-native';
import sizeHelper, {screenWidth, screentHeight} from '../../utils/Helpers';
import {fonts} from '../../utils/Themes/fonts';
import {theme} from '../../utils/Themes';
import icons from '../../utils/Constants/icons';
import CustomText from '../Text';
import {appStyles} from '../../utils/GlobalStyles';
import {dollarSymbol, generateUniqueIdGenerator} from '../../utils/CommonHooks';
import {useEffect, useState} from 'react';
import {ApiServices} from '../../api/ApiServices';
const CartItem = ({
  item,
  onIncrementCart,
  onDecrementCart,
  setIsMessage,
  setMessage,
  setToastColor,
  token,
  isFavorite,
}: any) => {
  const [isFavourit, setIsFavourit] = useState(item?.is_favorite);

  useEffect(() => {
    setIsFavourit(item?.is_favorite);
  }, [item]);

  let isDisable =
    item?.data?.product_sold_out !== 'available' ||
    (item?.data &&
      item?.data?.stock_control === 1 &&
      item?.data?.stock_quantity === 0);

  const onAddFavourits = () => {
    if (isDisable) {
      setIsMessage(true);
      setMessage('Only available products can be added to favourites.');

      return;
    }
    if (!token) {
      setToastColor(theme.colors.red);
      setIsMessage(true);
      setMessage('Please log in to add items to your favourites.');

      return;
    }
    const formData = new FormData();
    formData.append('product_id', item?.id);
    if (isFavorite) {
      formData.append('type', 'remove');
    } else {
      formData.append('type', !isFavourit ? 'add' : 'remove');
    }
    let data = {
      form: formData,
      token: token,
    };
    ApiServices.AddRemoveFavourit(data, async ({isSuccess, response}: any) => {
      if (isSuccess) {
        let result = JSON.parse(response);
        if (result?.success) {
          if (isFavorite) {
            setToastColor(theme.colors.primary);

            setMessage('Product remove in favourits');
            setIsMessage(true);
          } else {
            setToastColor(theme.colors.primary);
            setIsMessage(true);
            setMessage(result?.message);
            setIsFavourit(isFavourit ? false : true);
          }
        } else {
          setIsMessage(true);
          setToastColor(theme.colors.red);

          setMessage(result?.message);
          setIsFavourit(false);
        }
      } else {
        setMessage(response?.message);
        setToastColor(theme.colors.red);
        setIsMessage(true);
        setIsFavourit(false);

        // setIsDisable(false);
      }
    });
  };

  return (
    <>
      <View
        style={[
          {
            ...styles.Container,
          },
        ]}>
        <Image
          source={{uri: item?.image}}
          resizeMode="cover"
          style={{
            width: sizeHelper.calWp(150),
            height: '100%',
            opacity: isDisable ? 0.5 : 1,
          }}
        />
        <View
          style={{
            padding: sizeHelper.calWp(20),
            gap: sizeHelper.calHp(5),
            flex: 1,
          }}>
          <View style={{...appStyles.rowjustify}}>
            <View>
              <View
                style={{
                  ...appStyles.row,
                  gap: sizeHelper.calWp(5),
                  width: '80%',
                }}>
                <CustomText
                  text={item?.name}
                  fontWeight="600"
                  style={{opacity: isDisable ? 0.5 : 1}}
                  numberOfLines={1}
                  fontFam={fonts.Poppins_SemiBold}
                  color={theme.colors.secondry}
                  size={22}
                />
                {item?.unit_of_measurement != '' && (
                  <CustomText
                    text={`(${item?.unit_of_measurement})`}
                    fontWeight="600"
                    style={{opacity: isDisable ? 0.5 : 1}}
                    fontFam={fonts.Poppins_SemiBold}
                    color={theme.colors.gray}
                    size={19}
                  />
                )}
              </View>

              <CustomText
                text={item?.description}
                style={{
                  opacity: isDisable ? 0.5 : 1,
                  width: sizeHelper.calWp(380),
                }}
                numberOfLines={1}
                color={theme.colors.gray}
                size={16}
              />


              {isDisable ? (
                <CustomText
                  color={'red'}
                  text={'OUT OF STOCK'}
                  size={25}
                  style={{marginTop: sizeHelper.calHp(10)}}
                />
              ) : (
                <>
                  {item?.discounted_price > 0 && (
                    <CustomText
                      text={
                        dollarSymbol +
                        `${Number(
                          item.discounted_price * item?.quantity,
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      }
                      style={{opacity: isDisable ? 0.5 : 1}}
                      textDecorationLine="line-through"
                      color={theme.colors.gray}
                      size={20}
                    />
                  )}
                </>
              )}
            </View>
           
          </View>

          <View
            style={{
              ...appStyles.rowjustify,
              gap: sizeHelper.calWp(10),
            }}>
            <CustomText
              text={
                dollarSymbol +
                `${
                  item?.priceByQty
                    ? Number(item?.priceByQty)?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : '0'
                }`
              }
              style={{opacity: isDisable ? 0.5 : 1}}
              fontWeight="700"
              fontFam={fonts.Poppins_Bold}
              color={theme.colors.secondry}
              size={25}
            />
            <View style={{...appStyles.row, gap: sizeHelper.calWp(10)}}>
              <TouchableOpacity
                disabled={isDisable}
                style={styles.quantityMain}
                onPress={onDecrementCart}>
                <TouchableOpacity
                  disabled={isDisable}
                  onPress={onDecrementCart}
                  style={{
                    ...styles.quantityInner,
                    backgroundColor: isDisable
                      ? theme.colors?.gray
                      : theme.colors.primary,
                  }}>
                  <Image
                    source={icons.minus}
                    resizeMode="contain"
                    style={styles.quantity_icon}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
              <View
                style={{
                  alignItems: 'center',
                  paddingHorizontal: sizeHelper.calWp(6),
                }}>
                <CustomText
                  text={item?.quantity}
                  fontWeight="600"
                  fontFam={fonts.Poppins_SemiBold}
                  color={theme.colors.secondry}
                  size={20}
                />
              </View>

              <TouchableOpacity
                disabled={isDisable}
                style={styles.quantityMain}
                onPress={onIncrementCart}>
                <TouchableOpacity
                  style={{
                    ...styles.quantityInner,
                    backgroundColor: isDisable
                      ? theme.colors?.gray
                      : theme.colors.primary,
                  }}
                  disabled={isDisable}
                  onPress={onIncrementCart}>
                  <Image
                    source={icons.plus}
                    resizeMode="contain"
                    style={styles.quantity_icon}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};
export default CartItem;
const styles = StyleSheet.create({
  img: {width: 23, height: 23},
  Container: {
    height: sizeHelper.calHp(Platform.OS == 'ios' ? 150 : 165),
    width: '100%',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderRadius: sizeHelper.calWp(15),
    alignItems: 'center',
    gap: sizeHelper.calWp(10),
    borderWidth: 1,
    borderColor: '#F2F2F2',
    overflow: 'hidden',
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
    height: sizeHelper.calWp(50),
    width: sizeHelper.calWp(50),
    borderRadius: sizeHelper.calWp(13),
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity_icon: {
    width: sizeHelper.calWp(23),
    height: sizeHelper.calWp(23),
  },
});
