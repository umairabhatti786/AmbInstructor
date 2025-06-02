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
import {useDispatch, useSelector} from 'react-redux';
import {
  getCartData,
  setCartData,
  setDecrementCartItem,
  setUpdateCartItem,
} from '../../redux/reducers/cartReducer';
import {ApiServices} from '../../api/ApiServices';
import {getToken} from '../../redux/reducers/authReducer';
const ProductCard = ({
  item,
  setMessage,
  setIsMessage,
  isFavorite,
  onRemoveitem,
  setToastColor,
}: any) => {
  const cardData = useSelector(getCartData);
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const [isFavourit, setIsFavourit] = useState<any>();

  console.log('item', item);

  const foundCardIndex = cardData.findIndex((it: any) => it?.id === item?.id);
  let cardProduct: any = cardData[foundCardIndex];
  const [quantity, setQuantity] = useState(
    cardProduct?.quantity ? cardProduct?.quantity : 0,
  );
  useEffect(() => {
    setQuantity(cardProduct?.quantity ? cardProduct?.quantity : 0);
    setIsFavourit(item?.is_favorite == 1);
  }, [cardData, item]);

  let isDisable =
    item?.data?.product_sold_out !== 'available' ||
    (item?.data &&
      item?.data?.stock_control === 1 &&
      item?.data?.stock_quantity === 0);

  const mergeDuplicateProducts = (cartData: any) => {
    const productMap: any = {};
    const filterProduct = cartData.filter((it: any) => it?.id == item?.id);

    filterProduct.forEach((ite: any) => {
      const productId = ite.id;

      if (productMap[productId]) {
        productMap[productId].quantity += ite.quantity;
        // Optionally merge other properties if needed, like `addons`, etc.
      } else {
        productMap[productId] = {...ite};
      }
    });

    return productMap[item.id];
  };

  const checkStock = (productData: any, stockQuantity: any) => {
    if (productData?.data?.stock_control == 1) {
      if (stockQuantity >= Number(productData?.data?.stock_quantity)) {
        Alert.alert(
          `Stock Limit Exceeded`,
          `You can only add up to" ${productData?.data?.stock_quantity} items to your cart.`,

          [
            {
              text: `Ok`,
            },
          ],
        );

        return false;
      }
    }

    return true;
  };

  const onAddToCart = () => {
    console.log('AddcctoCsrd', item);
    let productItem = {
      ...item,
      addons: null,
      cartId: generateUniqueIdGenerator(),
      data: {
        ...item.data,
        payment_service: 'disabled',
        payment_service_price: 0,
        payment_service_details: {},
      },
    };

    let obj = {
      ...productItem,
      priceByQty: Number(item?.price) * 1,
      price: Number(item?.price),
      quantity: 1,
    };

    const foundAddonsProduct: any = cardData[foundCardIndex];

    if (foundCardIndex != -1) {
      if (foundAddonsProduct) {
        const data = {
          product: obj,
          index: foundCardIndex,
          quantity: obj?.quantity + foundAddonsProduct?.quantity,
        };
        dispatch(setUpdateCartItem(data));
      } else {
        dispatch(setCartData(obj));
      }
    } else {
      dispatch(setCartData(obj));
    }
  };

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

    if (isFavorite) {
      setToastColor(theme.colors.primary);
      setMessage('Product remove in favourits');
      setIsMessage(true);
    } else {
      setToastColor(theme.colors.primary);
      setIsMessage(true);
      setMessage(
        !isFavourit
          ? 'Product Added To Favourit List'
          : 'Product Remove From Favourit List',
      );
      setIsFavourit(isFavourit ? false : true);
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
          onRemoveitem?.();
          // if (isFavorite) {
          //   setToastColor(theme.colors.primary);

          //   setMessage('Product remove in favourits');
          //   setIsMessage(true);
          // } else {
          //   setToastColor(theme.colors.primary);
          //   setIsMessage(true);
          //   setMessage(result?.message);
          //   setIsFavourit(isFavourit ? false : true);
          // }
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
                  width: sizeHelper.calWp(360),
                }}
                numberOfLines={1}
                color={theme.colors.gray}
                size={16}
              />
              {isDisable ? (
                <CustomText
                  color={'red'}
                  text={'OUT OF STOCK'}
                  size={18}
                  style={{marginTop: sizeHelper.calHp(10)}}
                />
              ) : (
                <>
                  {item?.discounted_price > 0 && (
                    <CustomText
                      text={
                        dollarSymbol +
                        `${Number(item.discounted_price).toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}`
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
            <TouchableOpacity
              onPress={onAddFavourits}
              disabled={isDisable}
              style={{
                width: sizeHelper.calWp(80),
                height: sizeHelper.calWp(95),
                alignItems: 'flex-end',
              }}>
              <TouchableOpacity
                onPress={onAddFavourits}
                disabled={isDisable}
                style={{
                  width: sizeHelper.calWp(56),
                  height: sizeHelper.calWp(56),
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isFavourit
                    ? theme.colors.red + '20'
                    : '#F2F2F2',
                  borderRadius: sizeHelper.calWp(15),
                  // alignSelf: 'flex-start',
                }}>
                <Image
                  source={icons.unfilled_favurits}
                  style={{
                    width: '60%',
                    height: '60%',
                    tintColor: isFavourit
                      ? theme.colors.red
                      : theme.colors.gray,
                  }}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>

          <View
            style={{
              ...appStyles.rowjustify,
              gap: sizeHelper.calWp(10),
            }}>
            <CustomText
              text={
                dollarSymbol +
                `${Number(item.price).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
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
                onPress={() => {
                  if (quantity != 0) {
                    const foundAddonsProduct: any = cardData[foundCardIndex];

                    const data = {
                      index: foundCardIndex,
                      item: foundAddonsProduct,
                    };
                    dispatch(setDecrementCartItem(data));

                    setQuantity(pre => pre - 1);
                  }
                }}>
                <TouchableOpacity
                  disabled={isDisable}
                  onPress={() => {
                    if (quantity != 0) {
                      const foundAddonsProduct: any = cardData[foundCardIndex];

                      const data = {
                        index: foundCardIndex,
                        item: foundAddonsProduct,
                      };
                      dispatch(setDecrementCartItem(data));

                      setQuantity(pre => pre - 1);
                    }
                  }}
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
                  text={quantity}
                  fontWeight="600"
                  fontFam={fonts.Poppins_SemiBold}
                  color={theme.colors.secondry}
                  size={20}
                />
              </View>

              <TouchableOpacity
                disabled={isDisable}
                style={styles.quantityMain}
                onPress={() => {
                  const card = mergeDuplicateProducts(cardData);
                  console.log('quantityData', card?.quantity);

                  let stockQuantity =
                    foundCardIndex === -1
                      ? quantity
                      : quantity + card?.quantity;
                  const isQuantity = checkStock(
                    foundCardIndex == -1 ? item : card,
                    stockQuantity,
                  );
                  console.log('stockQuantity', stockQuantity);
                  if (isQuantity) {
                    setQuantity(pre => pre + 1);
                    onAddToCart();
                  }
                }}>
                <TouchableOpacity
                  style={{
                    ...styles.quantityInner,
                    backgroundColor: isDisable
                      ? theme.colors?.gray
                      : theme.colors.primary,
                  }}
                  disabled={isDisable}
                  onPress={() => {
                    const card = mergeDuplicateProducts(cardData);

                    let stockQuantity =
                      foundCardIndex === -1
                        ? quantity
                        : quantity + card?.quantity;
                    const isQuantity = checkStock(
                      foundCardIndex == -1 ? item : card,
                      stockQuantity,
                    );
                    console.log('stockQuantity', stockQuantity);
                    if (isQuantity) {
                      setQuantity(pre => pre + 1);
                      onAddToCart();
                    }
                  }}>
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
export default ProductCard;
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
