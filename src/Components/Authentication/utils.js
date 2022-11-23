import auth from '@react-native-firebase/auth'
import { LoginManager, AccessToken } from 'react-native-fbsdk-next'

export async function signIn() {
  try {
    // Login the User and get his public profile and email id.
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ])

    // If the user cancels the login process, the result will have a
    // isCancelled boolean set to true. We can use that to break out of this function.
    if (result.isCancelled) {
      throw 'User cancelled the login process'
    }

    // Get the Access Token
    const data = await AccessToken.getCurrentAccessToken()

    // If we don't get the access token, then something has went wrong.
    if (!data) {
      throw 'Something went wrong obtaining access token'
    }

    // Use the Access Token to create a facebook credential.
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    )

    // Use the facebook credential to sign in to the application.
    return auth().signInWithCredential(facebookCredential)
  } catch (error) {
    alert(error)
  }
}
