import React from 'react';
import { Button } from 'react-native';
import { onFacebookButtonPress } from './FacebookSignLogic';

export function FacebookSignIn() {
  return (
    <Button
      title="Facebook Sign-In"
      onPress={() => onFacebookButtonPress().then(() => console.log('Signed in with Facebook!'))}
    />
  );
}