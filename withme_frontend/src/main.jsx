import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store"; // Redux 스토어 및 Persistor 가져오기
import { PersistGate } from "redux-persist/integration/react"; // PersistGate 가져오기
import { ThemeProvider } from "@mui/material/styles"; // MUI 테마 적용
import theme from "./assets/css/mui/theme"; // MUI 테마 파일 가져오기

/**
 * 🚀 React 앱의 시작점
 * - `Provider store={store}` : Redux 스토어를 모든 컴포넌트에서 사용할 수 있도록 설정
 * - `PersistGate persistor={persistor}` : Redux Persist를 사용하여 상태를 유지
 * - `ThemeProvider theme={theme}` : MUI 커스텀 테마 적용
 * - `BrowserRouter` : React Router를 사용하여 클라이언트 측 라우팅 활성화
 */

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </ThemeProvider>
  </Provider>
);

/**
 * 🚀 Redux Persist 상태 변경 감지
 * - Redux Persist가 로컬 스토리지에 저장된 상태를 불러오면 콘솔에 현재 상태를 출력
 */
persistor.subscribe(() => {
  console.log("🟢 Redux Persist 상태 변경 감지:", store.getState());
});
