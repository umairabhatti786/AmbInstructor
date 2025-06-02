import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
  Alert,
} from 'react-native';
import sizeHelper, {screenWidth, screentHeight} from '../../utils/Helpers';
import {fonts} from '../../utils/Themes/fonts';
import {theme} from '../../utils/Themes';
import icons from '../../utils/Constants/icons';
import CustomText from '../Text';
import {appStyles} from '../../utils/GlobalStyles';
import {useEffect, useState} from 'react';
import {
  getCartData,
  setCartData,
  setDecrementCartItem,
  setUpdateCartItem,
} from '../../redux/reducers/cartReducer';
import {useDispatch, useSelector} from 'react-redux';
import {dollarSymbol, generateUniqueIdGenerator} from '../../utils/CommonHooks';

const CarouselProductCard = ({item}: any) => {
  const cardData = useSelector(getCartData);

  const dispatch = useDispatch();
  const foundCardIndex = cardData.findIndex((it: any) => it?.id === item?.id);
  let cardProduct: any = cardData[foundCardIndex];
  const [quantity, setQuantity] = useState(
    cardProduct?.quantity ? cardProduct?.quantity : 0,
  );


  let isDisable =
    item?.data?.product_sold_out !== 'available' ||
    (item?.data &&
      item?.data?.stock_control === 1 &&
      item?.data?.stock_quantity === 0);

  useEffect(() => {
    setQuantity(cardProduct?.quantity ? cardProduct?.quantity : 0);
  }, [cardData]);

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
    console.log('CartObject', obj);

    const foundAddonsProduct: any = cardData[foundCardIndex];
    console.log('foundAddonsProduct', foundAddonsProduct);

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
            width: '100%',
            height: sizeHelper.calHp(200),
            opacity: isDisable ? 0.5 : 1,
          }}
        />
        <View style={{padding: sizeHelper.calWp(10)}}>
          <View style={{...appStyles.row, gap: sizeHelper.calWp(5)}}>
            <CustomText
              text={item?.name}
              fontWeight="600"
              fontFam={fonts.Poppins_SemiBold}
              color={theme.colors.secondry}
              size={18}
              style={{opacity: isDisable ? 0.5 : 1}}
              numberOfLines={1}
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
          {isDisable ? (
            <CustomText
              color={'red'}
              text={'OUT OF STOCK'}
              size={19}
              style={{marginTop: sizeHelper.calHp(10)}}
            />
          ) : (
            <>
              {item?.discounted_price > 0 && (
                <CustomText
                  text={
                    dollarSymbol +
                    `${Number(item.discounted_price).toLocaleString(undefined, {
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

          <View
            style={{
              ...appStyles.rowjustify,
              gap: sizeHelper.calWp(10),
              marginTop: sizeHelper.calHp(6),
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
              size={20}
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
                  style={{
                    ...styles.quantityInner,
                    backgroundColor: isDisable
                      ? theme.colors?.gray
                      : theme.colors.primary,
                  }}
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
export default CarouselProductCard;

const styles = StyleSheet.create({
  img: {width: 23, height: 23},

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
    borderRadius: sizeHelper.calWp(13),
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity_icon: {
    width: sizeHelper.calWp(23),
    height: sizeHelper.calWp(23),
  },
});
