import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Keyboard,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import sizeHelper from '../../../utils/Helpers';
import ScreenLayout from '../../../components/ScreenLayout';
import CustomText from '../../../components/Text';
import {fonts} from '../../../utils/Themes/fonts';
import {theme} from '../../../utils/Themes';
import {appStyles} from '../../../utils/GlobalStyles';
import icons from '../../../utils/Constants/icons';
import OrderHistoryCard from '../../../components/OrderHistory/OrderHistoryCard';
import CustomBottomSheet from '../../../components/CustomBottomSheet';
import {orderHistoryProductData} from '../../../utils/Data';
import ProductCard from '../../../components/ProductCard';
import CustomButton from '../../../components/Button';
import { ApiServices } from '../../../api/ApiServices';
import { useSelector } from 'react-redux';
import { getToken } from '../../../redux/reducers/authReducer';
import { ViewAllProductLayout } from '../../../utils/Layouts/ViewAllProductLayout';
import { OrderHistoryLayout } from '../../../utils/Layouts/OrderHistoryLayout';

const OrderHistoryScreen = ({navigation}: any) => {
  const [page, setPage] = useState(1);
  const [orderHistoryData, setOrderHistoryData] = useState<any>([]);
  const token=useSelector(getToken)
const [loading,setLoading]=useState(true)
  const [isActionVisible, setIsActionVisible] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    getProductData();
  }, []);


  const getProductData = () => {
    let param = {
      token:token,
      page: 1,
    };
    ApiServices.GetOrderHoistory(param, async ({isSuccess, response}: any) => {
      if (isSuccess) {
        console.log('response', response);
        if (response?.success) {
          setOrderHistoryData(response?.data);
          setLoading(false)
          setIsRefreshing(false)
        } else {
          console.log('errocdcdr', response);
          setLoading(false)
          setIsRefreshing(false)

        }
      } else {
        setLoading(false)

      }
    });
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    getProductData();
  };

  const OrderHistoryData = [
    {
      id: '#XYZ24DR',
      status: 'In Process',
      createdAt: '09-05-2025',
      total: '£28.23',
    },
    {
      id: '#XYZ24DR',
      status: 'Completed',
      createdAt: '09-05-2025',
      total: '£28.23',
    },
    {
      id: '#XYZ24DR',
      status: 'Cancelled',
      createdAt: '09-05-2025',
      total: '£28.23',
    },
    {
      id: '#XYZ24DR',
      status: 'In Process',
      createdAt: '09-05-2025',
      total: '£28.23',
    },
    {
      id: '#XYZ24DR',
      status: 'Completed',
      createdAt: '09-05-2025',
      total: '£28.23',
    },
    {
      id: '#XYZ24DR',
      status: 'Cancelled',
      createdAt: '09-05-2025',
      total: '£28.23',
    },
    {
      id: '#XYZ24DR',
      status: 'In Process',
      createdAt: '09-05-2025',
      total: '£28.23',
    },
    {
      id: '#XYZ24DR',
      status: 'In Process',
      createdAt: '09-05-2025',
      total: '£28.23',
    },
  ];

  const Header = ({title}: any) => {
    return (
      <>
        <View>
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
            <CustomText
              text={'Order History'}
              fontWeight="600"
              style={{marginLeft: sizeHelper.calWp(30)}}
              fontFam={fonts.Poppins_SemiBold}
              color={theme.colors.secondry}
              size={25}
            />
            <TouchableOpacity
              onPress={() => setIsActionVisible(!isActionVisible)}
              style={{...appStyles.row, gap: sizeHelper.calWp(10)}}>
              <CustomText
                text={'Sort'}
                color={theme.colors.secondry}
                size={22}
              />
              <Image
                style={{
                  width: sizeHelper.calWp(40),
                  height: sizeHelper.calWp(40),
                  resizeMode: 'contain',
                  tintColor: theme.colors.secondry,
                }}
                source={icons.down}
              />
            </TouchableOpacity>
          </View>

          {isActionVisible && (
            <View style={styles.actionContainer}>
              <TouchableOpacity
                onPress={() => setIsActionVisible(false)}
                style={{
                  ...styles.actionInner,
                  paddingTop: sizeHelper.calHp(10),
                }}>
                <CustomText
                  text={'In Progress'}
                  // style={{textAlign:"center"}}
                  color={theme.colors.inProgress}
                  size={22}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsActionVisible(false)}
                style={styles.actionInner}>
                <CustomText
                  text={'Completed'}
                  // style={{textAlign:"center"}}
                  color={theme.colors.primary}
                  size={22}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsActionVisible(false)}
                style={styles.actionInner}>
                <CustomText
                  text={'Cancelled'}
                  // style={{textAlign:"center"}}
                  color={theme.colors.red}
                  size={22}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsActionVisible(false)}
                style={{...styles.actionInner, borderBottomWidth: -1}}>
                <CustomText
                  text={'Reset'}
                  // style={{textAlign:"center"}}
                  color={theme.colors.secondry}
                  size={22}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </>
    );
  };
  return (
    <>
      <ScreenLayout
        style={{
          flex: 1,
          // gap: sizeHelper.calWp(25),
          paddingHorizontal: sizeHelper.calWp(40),
          paddingTop: sizeHelper.calHp(10),
        }}>
        <View
          // onPress={() => setIsActionVisible(false)}
          // activeOpacity={1}
          style={{
            flex: 1,
            // gap: sizeHelper.calWp(25),
          }}>
          <Header />
          {
            loading?(
              <View
              style={{
              
                gap: sizeHelper.calWp(25),
                marginTop:sizeHelper.calHp(10)
                // alignItems: 'center',
              }}>
              <OrderHistoryLayout />
            </View>
            ):(

              <FlatList
              data={orderHistoryData}
              showsVerticalScrollIndicator={false}
              style={{flex:1}}
              refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
              }

              
              contentContainerStyle={{
                gap: sizeHelper.calWp(40),
                paddingTop: sizeHelper.calHp(10),
                paddingBottom: sizeHelper.calHp(20),
              }}
              renderItem={({item, index}: any) => {
                return (
                  <>
                    <OrderHistoryCard
                      onDetail={() => {
                        navigation.navigate('OrderHistoryDetail', {detail: item});
                      }}
                      item={item}
                    />
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
                      paddingTop: '90%',
                    }}>
                    <CustomText
                      text={'No order history available'}
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

            )
            

          }

         
        </View>
      </ScreenLayout>
    </>
  );
};

export default OrderHistoryScreen;

const styles = StyleSheet.create({
  botttom: {
    gap: sizeHelper.calHp(20),
    paddingBottom: '10%',
  },
  actionContainer: {
    position: 'absolute',
    width: '31%',
    backgroundColor: theme.colors.background,
    right: 0,
    zIndex: 999,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: sizeHelper.calWp(15),
    top: sizeHelper.calHp(45),
    gap: sizeHelper.calHp(15),
  },
  actionInner: {
    width: '100%',
    borderBottomWidth: 1,
    paddingBottom: sizeHelper.calHp(10),
    paddingHorizontal: sizeHelper.calWp(15),
    // padding: sizeHelper.calWp(10),
  },
});
