# GymRat Android application

Android app made using React, React-Native, Google Firebase and React-Native Paper
This mobile app allows user to create workouts, check friends workouts, compete with other users and collect points.

## Prerequesites

- Node.js
- JDK
- Android Studio
- Android Device

## Build and run project

### Install dependencies

To build project following commands should be run from project directory:

```
npm install

```

---

### Run Debug

To run this project Android Device should be connected to PC with debugging via USB enabled.
Following commands should be run from project directory:

```
npm run android
```

Now application should install and run on connected device.

---

### Create Apk

Go into android directory and run following command:

```
./gradlew assembleRelease
```

Now apk file should be present in android\app\build\outputs\apk\release directory

---

### File structure

Application files are located inside src folder
Inside src folder there are folders:

- Assets - images used in application
- Components - React-native components used in this project
- Containers - React-native components used as navigation containers
- Hooks - React hooks
- Navigators - React-native-navigation components
- Store - Types and utils used with data stored in Google Firestore
- Theme - Common styles of the application
- Translations - translated phrases
