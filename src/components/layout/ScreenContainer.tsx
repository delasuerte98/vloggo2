// src/components/layout/ScreenContainer.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Keyboard,
  TextInput as RNTextInput,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  children: React.ReactNode;
  /** true = fornisce uno ScrollView verticale già pronto */
  withScroll?: boolean;
  /** altezza approssimativa dell’header (per offset della tastiera) */
  headerHeight?: number;
  /** offset extra per stare larghi */
  keyboardOffset?: number;
  /** padding orizzontale del contenuto */
  contentPaddingHorizontal?: number;
  /** include il padding top della safe-area (default: true).
   *  Mettilo a false quando usi l'header nativo dello stack! */
  includeTopSafeArea?: boolean;
};

export default function ScreenContainer({
  children,
  withScroll = true,
  headerHeight = 0,
  keyboardOffset = 0,
  contentPaddingHorizontal = 0,
  includeTopSafeArea = true,
}: Props) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [scrollY, setScrollY] = useState(0);

  // Auto-scroll per tenere visibile il campo attivo quando apre la tastiera
  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        try {
          const focused =
            (RNTextInput as any).State?.currentlyFocusedInput?.() ||
            (RNTextInput as any).currentlyFocusedInput?.();
          if (!focused) return;

          (focused as any).measureInWindow?.((x: number, y: number, w: number, h: number) => {
            const screenH = Dimensions.get('window').height;
            const kbH = e.endCoordinates?.height ?? 0;

            const safeTop = (includeTopSafeArea ? insets.top : 0) + headerHeight;
            const safeBottom = kbH + (Platform.OS === 'ios' ? insets.bottom : 0) + keyboardOffset;

            const visibleTop = safeTop + 8;
            const visibleBottom = screenH - safeBottom - 8;

            const fieldBottom = y + h;
            const fieldTop = y;

            if (fieldBottom > visibleBottom) {
              const delta = fieldBottom - visibleBottom;
              scrollRef.current?.scrollTo({ y: scrollY + delta + 12, animated: true });
            } else if (fieldTop < visibleTop) {
              const delta = visibleTop - fieldTop;
              scrollRef.current?.scrollTo({ y: Math.max(0, scrollY - delta - 12), animated: true });
            }
          });
        } catch {}
      }
    );

    return () => showSub.remove();
  }, [headerHeight, keyboardOffset, insets.top, insets.bottom, includeTopSafeArea, scrollY]);

  const Avoider = (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: 'transparent' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={(headerHeight ?? 0) + (keyboardOffset ?? 0)}
    >
      {withScroll ? (
        <ScrollView
          ref={scrollRef}
          contentInsetAdjustmentBehavior="automatic"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          keyboardShouldPersistTaps="handled"
          onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) =>
            setScrollY(e.nativeEvent.contentOffset.y)
          }
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingBottom: 24 + insets.bottom,
            paddingHorizontal: contentPaddingHorizontal,
          }}
          style={{ flex: 1 }}
        >
          {children}
          <View style={{ height: 24 }} />
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>{children}</View>
      )}
    </KeyboardAvoidingView>
  );

  return (
    <View
      style={{
        flex: 1,
        // ❗️se includeTopSafeArea=false, niente paddingTop extra
        paddingTop: includeTopSafeArea ? insets.top : 0,
        paddingBottom: 0,
        backgroundColor: 'transparent',
      }}
    >
      {Avoider}
    </View>
  );
}