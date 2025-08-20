// src/components/layout/SheetContainer.tsx per tastiera in sovrapposizione a form 

import React, { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ViewStyle, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';

type Props = {
  children: ReactNode;
  style?: ViewStyle;
  headerHeight?: number; // altezza header custom dentro al modal
};

export default function SheetContainer({ children, style, headerHeight = 56 }: Props) {
  const insets = useSafeAreaInsets();
  const keyboardOffset = Platform.OS === 'ios' ? insets.top + headerHeight : 0;

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom }, style]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardOffset}
      >
        {children}
      </KeyboardAvoidingView>
    </View>
  );
}