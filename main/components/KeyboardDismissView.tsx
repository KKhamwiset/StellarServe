import React from 'react';
import { TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';

interface Props {
  children: React.ReactElement;
}

export function KeyboardDismissView({ children }: Props) {
  if (Platform.OS === 'web') {
    return <>{children}</>;
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {children}
    </TouchableWithoutFeedback>
  );
}
