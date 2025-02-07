import { createSlice } from "@reduxjs/toolkit";
import { fetchWithAuth } from "../common/fetchWithAuth";
import { API_URL } from "../constant";

/**
 * Redux Toolkit의 createSlice 함수를 사용하여 auth 슬라이스를 정의
 * - 로그인 상태 및 사용자 정보를 관리하는 리덕스 슬라이스
 */
const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,         // 사용자 정보
        isLoggedIn: false,  // 로그인 여부
        userType: null,     // 🆕 회원 유형 (FREE or PAID)
    },
    reducers: {
        /**
         * 로그인 후 사용자 정보를 저장하는 액션
         * @param {Object} state - 현재 상태
         * @param {Object} action - 액션 객체 (payload에 사용자 정보 포함)
         */
        setUser(state, action) {
            state.user = action.payload;
            state.isLoggedIn = true;
            state.userType = action.payload.userType; // 🆕 회원 유형 저장 (FREE or PAID)
        },
        /**
         * 로그아웃 시 사용자 정보를 초기화하는 액션
         * @param {Object} state - 현재 상태
         */
        clearUser(state) {
            state.user = null;
            state.isLoggedIn = false;
            state.userType = null; // 🆕 회원 유형 초기화
        },
    },
});

/**
 * ✅ 사용자 정보를 가져오는 비동기 함수 (Thunk)
 * - 서버에서 회원 정보를 가져오고 Redux 상태에 업데이트
 */
export const fetchUserInfo = () => async (dispatch) => {
    try {
        const response = await fetchWithAuth(`${API_URL}auth/userInfo`);
        if (!response.ok) {
            if (response.status === 401) {
                console.warn("인증되지 않은 사용자 요청입니다.");
                return;
            }
            throw new Error("사용자 정보 가져오기 실패");
        }
        const userData = await response.json();
        console.log("✅ 사용자 정보:", userData);

        if (!userData || Object.keys(userData).length === 0) {
            console.warn("존재하지 않는 사용자 정보입니다.");
            return;
        }

        // 🆕 사용자 정보와 함께 `userType`(무료회원/유료회원) 저장
        dispatch(setUser({
            ...userData,
            userType: userData.type, // 🆕 백엔드에서 받은 회원 유형 (FREE or PAID)
        }));
    } catch (error) {
        console.error("사용자 정보 가져오기 오류:", error.message);
        dispatch(clearUser());
    }
};

/**
 * ✅ 자동 생성된 액션 내보내기
 * - `setUser`: 로그인 시 사용자 정보 저장
 * - `clearUser`: 로그아웃 시 사용자 정보 초기화
 */
export const { setUser, clearUser } = authSlice.actions;

/**
 * ✅ authSlice의 리듀서 내보내기
 * - store.js에서 리덕스 스토어에 추가해야 사용 가능
 */
export default authSlice.reducer;
