# Cách chạy
npx create-expo-app@latest Lab06 --template blank-typescript
cd Lab06
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs @react-navigation/drawer react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated react-native-worklets @expo/vector-icons
# Chép đè index.ts, App.tsx, thư mục src/ và assets/ của gói này vào project, rồi:
npx expo start -c
# Thêm vào package.json (scripts):  "typecheck": "tsc --noEmit"
