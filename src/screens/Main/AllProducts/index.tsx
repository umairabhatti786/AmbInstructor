import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Platform,
  Alert,
} from 'react-native';
import sizeHelper from '../../../utils/Helpers';
import ScreenLayout from '../../../components/ScreenLayout';
import {appStyles} from '../../../utils/GlobalStyles';
import {theme} from '../../../utils/Themes';
import CustomText from '../../../components/Text';
import images from '../../../utils/Constants/images';
import {fonts} from '../../../utils/Themes/fonts';
import icons from '../../../utils/Constants/icons';
import ProductCard from '../../../components/ProductCard';
import {favouritesData} from '../../../utils/Data';
import CustomButton from '../../../components/Button';
import {useSelector} from 'react-redux';
import {getUserData} from '../../../redux/reducers/authReducer';
import {ApiServices} from '../../../api/ApiServices';
import CategoryCard from '../../../components/CategoryCard';
import {ViewAllProductLayout} from '../../../utils/Layouts/ViewAllProductLayout';
import CustomToast from '../../../components/CustomToast';
import { useIsFocused } from '@react-navigation/native';

const AllProducts = ({navigation}: any) => {
  const auth = useSelector(getUserData);
  const [loading, setLoadig] = useState(false);
  const [isMessage, setIsMessage] = useState<any>(false);
  const [message, setMessage] = useState<any>('');
  const [toastColor, setToastColor] = useState(theme.colors.primary);
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true); // Flag to indicate if more data is available
  const focused=useIsFocused()

  const [selectedCategory, setSelectedCategory] = useState({
    id: '',
    name: 'All',
    category_image: images.all_category,
    isDefault: 'All',
  });
  const [categories, setCategories] = useState<any>([]);
  const [products, setProducts] = useState<any>([]);

  useEffect(() => {
    getCategories();
    getProductData();
  }, [focused]);

  const getCategories = () => {
    setLoadig(true)
    setHasMoreData(true)

    ApiServices.GetCategories(async ({isSuccess, response}: any) => {
      if (isSuccess) {
        if (response?.success) {
          setCategories(response?.data?.product_categories);
          setLoadig(false);
        } else {
          console.log('errocdcdr', response);
          setLoadig(false);
        }
      } else {
        setLoadig(false);

        Alert.alert('Alert!', 'Something want wrong');
      }
    });
  };

  const getProductData = () => {
    let param = {
      search: '',
      id: '',
      page: 1,
      user_id: auth ? auth?.id : '',
    };
    setPage(2);
    setHasMoreData(true)
    ApiServices.GetProducts(param, async ({isSuccess, response}: any) => {
      if (isSuccess) {
        console.log('response', response);
        if (response?.success) {
          setProducts(response?.data?.products);
        } else {
          console.log('errocdcdr', response);
        }
      } else {
      }
    });
  };

  const OnSelectedCategory = (item: any) => {
    let param = {
      search: '',
      id: item?.id,
      page: 1,
      user_id: auth ? auth?.id : '',
      
    };
    setPage(2);

    ApiServices.GetProducts(param, async ({isSuccess, response}: any) => {
      if (isSuccess) {
        if (response?.success) {
          setProducts(response?.data?.products);
        } else {
          console.log('errocdcdr', response);
        }
      } else {
      }
    });
  };

  const onEndReached = () => {
    let param = {
      search: '',
      id: '',
      page: page,
      user_id: auth ? auth?.id : '',
    };

    ApiServices.GetProducts(param, async ({isSuccess, response}: any) => {
      if (isSuccess) {
        console.log('response', response?.data?.products.length);
        if (response?.success) {
          if (response?.data?.products.length == 0) {
            setHasMoreData(false);
          }

          setProducts(prevData => {
            return [...prevData, ...response?.data?.products];
          });

          setPage(page + 1);
          setIsRefreshing(false);
        } else {
          setIsRefreshing(false);
          setHasMoreData(false);
          setMessage(response?.message);
          setIsMessage(true);

          console.log('errocdcdr', response);
        }
      } else {

        setIsRefreshing(false);
        setHasMoreData(false);
        setIsMessage(true);
        setMessage("Something went wrong");

      }
    });

    // ApiServices.BookCategorySearch(
    //   params,
    //   async ({ isSuccess, response }: any) => {
    //     if (isSuccess) {
    //       let result = JSON.parse(response);
    //       if (result?.books) {
    //         if (result?.books.length == 0) {
    //           setHasMoreData(false);
    //         }
    //         setCategoryBooks((prevData) => {
    //           return [...prevData, ...result?.books];
    //         });

    //         setPage(page + 1);

    //         setIsRefreshing(false);
    //       } else {
    //         setIsRefreshing(false);

    //         setMessage(result?.error);
    //         setIsMessage(true);
    //       }
    //     } else {
    //       setIsRefreshing(false);
    //       setMessage("Something went wrong");
    //       setIsMessage(true);
    //     }
    //   }
    // );
  };

  const Header = () => {
    return (
      <View
        style={{
          ...appStyles.rowjustify,
          paddingHorizontal: sizeHelper.calWp(50),
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: sizeHelper.calWp(60),
            height: sizeHelper.calWp(60),
            justifyContent: 'center',
          }}>
          <Image
            style={{
              width: sizeHelper.calWp(40),
              height: sizeHelper.calWp(40),
              resizeMode: 'contain',
              tintColor: theme.colors.secondry,
            }}
            source={icons.back_arrow}
          />
        </TouchableOpacity>
        <View style={{flex: 1, alignItems: 'center'}}>
          <CustomText
            text={'Products'}
            fontWeight="600"
            fontFam={fonts.Poppins_SemiBold}
            color={theme.colors.secondry}
            size={25}
          />
        </View>
        <View style={{width: 40}} />
      </View>
    );
  };

  return (
    <>
      <ScreenLayout
        style={{
          flex: 1,
          gap: sizeHelper.calWp(25),
          paddingTop: sizeHelper.calHp(20),
        }}>
        <Header />
        {loading ? (
          <View
            style={{
              flex: 1,
              gap: sizeHelper.calWp(25),
              alignItems: 'center',
              marginLeft: sizeHelper.calWp(20),
            }}>
            <ViewAllProductLayout />
          </View>
        ) : (
          <View style={{flex: 1, gap: sizeHelper.calWp(25)}}>
            <View>
              <FlatList
                data={categories}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{
                  paddingLeft: sizeHelper.calWp(50),
                  // backgroundColor:"red",
                  paddingVertical: 10,
                }}
                contentContainerStyle={{
                  gap: sizeHelper.calWp(10),
                  paddingRight: sizeHelper.calWp(
                    Platform.OS == 'ios' ? 40 : 100,
                  ),
                }}
                ListHeaderComponent={({item, index}: any) => {
                  return (
                    <>
                      <CategoryCard
                        onPress={() => {
                          setSelectedCategory({
                            id: '',
                            name: 'All',
                            category_image: images.all_category,
                            isDefault: 'All',
                          });
                          OnSelectedCategory({
                            id: '',
                            name: 'All',
                            category_image: images.all_category,
                            isDefault: 'All',
                          });
                        }}
                        setSelectedCategory={setSelectedCategory}
                        item={{
                          id: '',
                          name: 'All',
                          category_image: images.all_category,
                          isDefault: 'All',
                        }}
                        selectedCategory={selectedCategory}
                      />
                    </>
                  );
                }}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}: any) => {
                  return (
                    <CategoryCard
                      setSelectedCategory={setSelectedCategory}
                      onPress={() => {
                        console.log('ckdnckd', item);
                        setSelectedCategory(item);
                        OnSelectedCategory(item);
                      }}
                      item={item}
                      selectedCategory={selectedCategory}
                    />
                  );
                }}
              />
            </View>

            <FlatList
              data={products}
              showsVerticalScrollIndicator={false}
              style={{
                paddingLeft: sizeHelper.calWp(50),
              }}
              contentContainerStyle={{
                gap: sizeHelper.calWp(20),
                paddingRight: sizeHelper.calWp(40),
                paddingVertical: sizeHelper.calHp(10),
                paddingBottom:sizeHelper.calHp(50)
              }}
              // onEndReached={() => {
              //   if (!isRefreshing && products?.length > 0 && hasMoreData) {
              //     // Only load more data if not refreshing
              //     onEndReached();
              //   }
              // }}
              ListEmptyComponent={() => {
                return (
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingTop: '80%',
                    }}>
                    <CustomText
                      text={'No Products available'}
                      fontWeight="700"
                      style={{textAlign: 'center'}}
                      fontFam={fonts.Poppins_Bold}
                      color={theme.colors.secondry}
                      size={25}
                    />
                  </View>
                );
              }}
              renderItem={({item, index}: any) => {
                return (
                  <>
                    <ProductCard
                      setMessage={setMessage}
                      setIsMessage={setIsMessage}
                      setToastColor={setToastColor}
                      item={item}
                    />
                  </>
                );
              }}
            />
          </View>
        )}
      </ScreenLayout>

      <CustomToast
        isVisable={isMessage}
        setIsVisable={setIsMessage}
        backgroundColor={toastColor}
        message={message}
      />

      {/* <View style={styles.botttom}>
        <CustomButton width={'83%'} text="Add To Cart" />
      </View> */}
    </>
  );
};

export default AllProducts;

const styles = StyleSheet.create({
  botttom: {
    width: '100%',
    position: 'absolute',
    bottom: sizeHelper.calHp(50),
    alignItems: 'center',
  },

  categoryContainer: {
    borderRadius: sizeHelper.calHp(10),
    paddingHorizontal: sizeHelper.calWp(30),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: sizeHelper.calHp(12),
    flexDirection: 'row',
    gap: sizeHelper.calWp(13),
    backgroundColor: 'red',
  },
});
