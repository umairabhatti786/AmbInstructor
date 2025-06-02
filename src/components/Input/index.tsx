import {Image, TouchableOpacity, View} from 'react-native';
import CustomText from '../Text';
import {InputProps} from '../../utils/Types';
import {theme} from '../../utils/Themes';
import {fonts} from '../../utils/Themes/fonts';
import sizeHelper from '../../utils/Helpers';
import {TextInput} from 'react-native-paper';
import {useState} from 'react';
import images from '../../utils/Constants/images';

const CustomInput = ({
  placeholder,
  keyboard,
  secureTextEntry,
  props,
  fontWeight,
  multiline,
  height,
  fontSize,
  value,
  onChangeText,
  onBlur,
  error,
  editable,
  color,
  maxLength,
  width,
  placeholderTextColor,
  borderRadius,
  backgroundColor,
  textAlign,
  textAlignVertical,
  paddingTop,
  onSubmitEditing,
  label,
  onFocus,
  focusedInput,
  inputKey,
  setFocusedInput,
  leftSource,
  disable,
  rightSource,
  rightIconPress,
  defaultValue,
  selection,
  onSelectionChange,
  textColor,
}: InputProps) => {
  const isFocused = focusedInput === inputKey;

  return (
    <View
      style={{
        ...props,
        width: width || '100%',
      }}>
      {label && (
        <View
          style={{
            marginBottom: sizeHelper.calHp(7),
          }}>
          <CustomText
            text={label}
            size={21}
            color={isFocused ? theme.colors.primary : color ||theme.colors.text_black}
            fontWeight="600"
            fontFam={fonts.Poppins_SemiBold}
          />
        </View>
      )}
      <TextInput
        value={value}
        editable={editable}
        disabled={disable}
        selection={selection}
        onSelectionChange={onSelectionChange}
        onSubmitEditing={onSubmitEditing}
        textColor={textColor || theme.colors.secondry}
        mode={'outlined'}
        onFocus={() => setFocusedInput(inputKey)}
        onBlur={() => setFocusedInput(null)}
        label={''}
        theme={{
          colors: {
            onSurfaceVariant: theme.colors.gray, // Label color
          },
        }}

        right={
          rightSource && (
            <TextInput.Icon
              icon={() => (
                <TouchableOpacity
                style={{height:"100%",justifyContent:"center",width:sizeHelper.calWp(100),alignItems:"center"}}
                 onPress={rightIconPress} activeOpacity={0.7}>
                  <Image
                    source={rightSource}
                    style={{
                      width: sizeHelper.calWp(37),
                      height: sizeHelper.calWp(37),
                      resizeMode: "contain",
                      tintColor: isFocused ? theme.colors.primary : theme.colors.gray,
                    }}
                  />
                </TouchableOpacity>
              )}
            />
          )
        }

        
        outlineColor="#B6B6B7" // Light grey border
        activeOutlineColor="#10451D" // Slightly darker when focused
        outlineStyle={{
          borderRadius: borderRadius || sizeHelper.calWp(15),
          borderWidth: 1.5,
        }}

        
        left={
          <TextInput.Icon
            icon={() => (
              <Image
                source={leftSource} // or { uri: 'https://...' }
                style={{
                  width: sizeHelper.calWp(30),
                  height: sizeHelper.calWp(30),
                  resizeMode:"contain",
                  tintColor: isFocused ? theme.colors.primary : theme.colors.gray,
                }}
              />
            )}
          />
        }
        allowFontScaling={false} // Disable font scaling
        style={{
          backgroundColor: isFocused ? '#B7EFC543' : '#F0F0F1',
          fontSize: fontSize || sizeHelper.calHp(22),
          height: sizeHelper.calHp(height || 80),
          width: '100%',
          textAlign: textAlign,
          textAlignVertical: textAlignVertical,
          textTransform: 'capitalize' ,
          paddingTop: paddingTop || 0,
          paddingVertical: 0, // Adjust as needed for centering
          fontFamily: fonts.Poppins_Regular,
          fontWeight: fontWeight || '500',
          color: color || theme.colors.black,
        }}
        placeholder={placeholder}
        multiline={multiline}
        placeholderTextColor={placeholderTextColor || theme.colors.gray}
        keyboardType={keyboard}
        defaultValue={defaultValue}
        maxLength={maxLength}
        // onFocus={onFocus}
        secureTextEntry={secureTextEntry || false}
        onChangeText={onChangeText}
        // onBlur={onBlur}
        autoCapitalize="none"
      />

      {error && (
        <View
          style={{
            marginTop: sizeHelper.calHp(10),
            alignItems:"flex-end"
          }}>
          <CustomText size={20} text={error} color={theme.colors.red} />
        </View>
      )}
    </View>
  );
};
export default CustomInput;
