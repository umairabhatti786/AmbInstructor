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
import {getToken, getUserData} from '../../../redux/reducers/authReducer';
import {ApiServices} from '../../../api/ApiServices';
import CategoryCard from '../../../components/CategoryCard';
import {ViewAllProductLayout} from '../../../utils/Layouts/ViewAllProductLayout';
import {OrderHistoryLayout} from '../../../utils/Layouts/OrderHistoryLayout';
import {useIsFocused} from '@react-navigation/native';
import CustomToast from '../../../components/CustomToast';

const FavouritesScreen = ({navigation}: any) => {
  const auth = useSelector(getUserData);
  const [loading, setLoading] = useState(true);
  const token = useSelector(getToken);
  const focused = useIsFocused();
  const [isMessage, setIsMessage] = useState<any>(false);
  const [message, setMessage] = useState<any>('');
  const [toastColor,setToastColor]=useState(theme.colors.primary)
  const [selectedCategory, setSelectedCategory] = useState({
    id: '',
    name: 'All',
    category_image: images.all_category,
    isDefault: 'All',
  });
  const [categories, setCategories] = useState<any>([]);
  const [products, setProducts] = useState<any>([]);

  useEffect(() => {
    getProductData();
  }, [focused]);

  const getProductData = () => {
    const formData = new FormData();
    formData.append('page', 1);
    formData.append('type','view');
    let param = {
      token: token,
      data: formData,
    };
    ApiServices.GetFavourits(param, async ({isSuccess, response}: any) => {
      if (isSuccess) {
        console.log('response', response?.data?.favorite_product);
        if (response?.success) {
          setProducts(response?.data?.favorite_product);
          setLoading(false);
        } else {
          console.log('errocdcdr', response);
          setLoading(false);
        }
      } else {
      }
    });
  };


  const Header = () => {
    return (
      <View
        style={{
          ...appStyles.rowjustify,
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: sizeHelper.calWp(100),
            height: sizeHelper.calWp(100),
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
            text={'Favourites'}
            fontWeight="600"
            fontFam={fonts.Poppins_SemiBold}
            color={theme.colors.secondry}
            size={25}
          />
        </View>
        <View style={{width: 60}} />
      </View>
    );
  };

  return (
    <>
      <ScreenLayout
        style={{
          flex: 1,
          paddingTop: sizeHelper.calHp(20),
          paddingHorizontal: sizeHelper.calWp(40),
        }}>
        <Header />
        {loading ? (
          <View
            style={{
              flex: 1,
              gap: sizeHelper.calWp(25),
              marginTop: sizeHelper.calHp(10),
          
            }}>
            <OrderHistoryLayout />
          </View>
        ) : (
          <View style={{flex: 1, gap: sizeHelper.calWp(25)}}>
            <FlatList
              data={products}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                gap: sizeHelper.calWp(20),
                paddingVertical: sizeHelper.calHp(10),
              }}
              renderItem={({item, index}: any) => {
                return (
                  <>
                    <ProductCard 
                    isFavorite={true}
                    setMessage={setMessage}
                    setIsMessage={setIsMessage}
                    setToastColor={setToastColor}

                    onRemoveitem={()=>{
                      let removeItem=products?.filter((it:any)=>it?.id!=item?.id)
                      setProducts(removeItem)



                    }}
                    item={item} />
                  </>
                );
              }}
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
                      text={'No favourites available'}
                      fontWeight="700"
                      style={{textAlign: 'center'}}
                      fontFam={fonts.Poppins_Bold}
                      color={theme.colors.secondry}
                      size={25}
                    />
                  </View>
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

export default FavouritesScreen;

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
