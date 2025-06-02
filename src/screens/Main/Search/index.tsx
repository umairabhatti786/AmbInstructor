import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import sizeHelper from '../../../utils/Helpers';
import ScreenLayout from '../../../components/ScreenLayout';
import CustomText from '../../../components/Text';
import {favouritesData} from '../../../utils/Data';
import {fonts} from '../../../utils/Themes/fonts';
import {theme} from '../../../utils/Themes';
import ProductCard from '../../../components/ProductCard';
import CustomButton from '../../../components/Button';
import CustomHeader from '../../../components/Header/inde';
import CustomSearch from '../../../components/Search';
import {ApiServices} from '../../../api/ApiServices';
import debounce from 'lodash/debounce';
import {useSelector} from 'react-redux';
import {getToken} from '../../../redux/reducers/authReducer';
import CustomToast from '../../../components/CustomToast';
import {useIsFocused} from '@react-navigation/native';
import {OrderHistoryLayout} from '../../../utils/Layouts/OrderHistoryLayout';

const SearchScreen = ({navigation}: any) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<any>([]);
  const auth = useSelector(getToken);
  const [isMessage, setIsMessage] = useState<any>(false);
  const [message, setMessage] = useState<any>('');
  const [toastColor, setToastColor] = useState(theme.colors.primary);
  const [loading, setLoading] = useState(false);
  const focused = useIsFocused();
  const inputRef = useRef(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    if (focused) {
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 300); // Try 300ms for reliability

      return () => clearTimeout(timeout);
    }
  }, [focused]);

  useEffect(() => {
    setLoading(true);
    getProductData('');
  }, []);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });
  
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const getProductData = (txt: any) => {
    let param = {
      search: txt,
      id: '',
      page: 1,
      user_id: auth ? auth?.id : '',
    };

    ApiServices.GetProducts(param, async ({isSuccess, response}: any) => {
      if (isSuccess) {
        if (response?.success) {
          setProducts(response.data.products);
          setLoading(false);
        } else {
          console.warn('Product fetch unsuccessful:', response);
          setLoading(false);
        }
      } else {
        console.error('API call failed');
        setLoading(false);

      }
    });
  };

  const debouncedSearch = useCallback(
    debounce((txt: string) => {
      if (txt.trim().length === 0) {
        setLoading(true);
        getProductData("");
        return;
      }
      setLoading(true);
      getProductData(txt);

      // const params = {
      //   search: txt,
      //   id: '',
      //   page: 1,
      // };
    }, 300), // 1-second debounce
    [],
  );

  const onSearch = (txt: string) => {
    console.log('Search input:', txt);
    setSearch(txt);
    debouncedSearch(txt);
  };
  return (
    <>
      <ScreenLayout
        style={{
          flex: 1,
          paddingTop: sizeHelper.calHp(20),
          paddingHorizontal: sizeHelper.calWp(40),
        }}>
        <CustomHeader title={'Search'} />
        <CustomSearch
          value={search}
          inputRef={inputRef}
          onChangeText={onSearch}
          placeholder="Search"
        />
        {loading ? (
          <View style={{flex: 1,paddingTop:sizeHelper.calHp(20)}}>
            <OrderHistoryLayout />
          </View>
        ) : (
          <View style={{flex: 1,paddingTop:sizeHelper.calHp(20)}}>
            <FlatList
              data={products}
              showsVerticalScrollIndicator={false}
              style={{flex:1}}
              contentContainerStyle={{
                gap: sizeHelper.calWp(20),
                paddingVertical: sizeHelper.calHp(10),
                paddingBottom: sizeHelper.calHp(keyboardVisible?550:80)
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
    </>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  botttom: {
    gap: sizeHelper.calHp(20),
    paddingBottom: '10%',
  },
});
