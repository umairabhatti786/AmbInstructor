import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import sizeHelper from '../../utils/Helpers';
import {fonts} from '../../utils/Themes/fonts';
import {theme} from '../../utils/Themes';
import CustomText from '../Text';
import images from '../../utils/Constants/images';
import {useNavigation} from '@react-navigation/native';

const CategoryCard = ({
  selectedCategory,
  setSelectedCategory,
  item,
  onPress,
}: any) => {
  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        style={{
          ...styles.categoryContainer,
          backgroundColor:
            selectedCategory?.id == item?.id
              ? '#B7EFC543'
              : theme.colors.background,
        }}>
        <Image
          style={{
            width: sizeHelper.calWp(35),
            height: sizeHelper.calWp(35),
            resizeMode: 'contain',
            tintColor:
              selectedCategory?.id == item?.id
                ? theme.colors.primary
                : theme.colors.secondry,
          }}
          source={item?.category_image ? item?.category_image : images.fruite}
        />
        <CustomText
          color={
            selectedCategory?.id == item?.id
              ? theme.colors.primary
              : theme.colors.secondry
          }
          text={item?.name}
          fontWeight="600"
          fontFam={fonts.Poppins_SemiBold}
          size={22}
        />
      </TouchableOpacity>
    </>
  );
};
export default CategoryCard;

const styles = StyleSheet.create({
  categoryContainer: {
    borderRadius: sizeHelper.calHp(10),
    paddingHorizontal: sizeHelper.calWp(30),
    alignItems: 'center',
    justifyContent: 'center',
    padding: sizeHelper.calWp(15),
    flexDirection: 'row',
    gap: sizeHelper.calWp(13),
  },
});
