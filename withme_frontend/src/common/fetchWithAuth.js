/**
 * src/common/fetchWithAuth.js
 * - API 요청 시 JWT 인증 토큰을 헤더에 포함하여 요청시 사용
 * - fetch API를 사용하여 API 요청을 보내고, 응답을 반환
 * - fetch API의 두 번째 인자로 옵션 객체를 받아서 사용
 * - 기본 Content-Type은 application/json으로 설정
 * - 인증 토큰은 localStorage에서 가져와서 헤더에 추가
 * - 401 상태 발생 시 리프레시 토큰으로 새로운 액세스 토큰 발급 및 요청 재시도
 */

import { API_URL } from "../constant";

/**
 * 리프레시 토큰을 사용해 새로운 액세스 토큰 발급
 * - 기존 액세스 토큰이 만료된 경우 실행
 * - 리프레시 토큰이 유효하면 새로운 액세스 토큰을 발급받아 저장
 * - 리프레시 토큰도 만료된 경우, localStorage 초기화 후 로그인 페이지로 이동
 */
const refreshAccessToken = async () => {
    try {
        const refreshToken = localStorage.getItem("refreshToken"); // 리프레시 토큰 가져오기
        if (!refreshToken) {
            throw new Error("리프레시 토큰 없음");
        }

        const response = await fetch(`${API_URL}auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
            throw new Error("리프레시 토큰 갱신 실패");
        }

        const data = await response.json();
        localStorage.setItem("token", data.accessToken); // 새 액세스 토큰 저장
        return data.accessToken;
    } catch (error) {
        console.error("🔴 리프레시 토큰 처리 오류:", error.message);

        // [🚀 추가] 리프레시 토큰까지 만료되었을 경우, 강제 로그아웃 처리
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // 로그인 페이지로 리디렉트

        return null;
    }
};

/**
 * API 요청을 보내는 함수
 * 요청을 보낼 때 헤더와 JWT 토큰을 포함하여 요청
 * Options 객체에 method, body등을 설정하여 전달
 * @param {string} url 요청할 URL
 * @param {Object} options fetch API의 두번째 인자로 전달할 옵션 객체
 */
export const fetchWithAuth = async (url, options = {}) => {
    // ✅ 1. 로컬 스토리지에서 토큰 가져오기
    const token = localStorage.getItem("token");

    // ✅ 2. 서버에 보낼 때 전달할 헤더 설정 (🚀 token이 있을 때만 Authorization 추가)
    const headers = {
        ...options.headers,
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}), // ✅ 토큰이 있는 경우만 Authorization 추가
    };

    // ✅ 3. options 객체와 headers 객체를 합쳐서 새로운 config 객체 생성
    const config = { ...options, headers };

    // ✅ 4. fetch API로 요청 보내기
    try {
        let response = await fetch(url, config);

        if (response.status === 401) {
            console.warn("⚠️ 401 Unauthorized: 액세스 토큰 만료 가능");

            const newToken = await refreshAccessToken(); // 리프레시 토큰 사용
            if (newToken) {
                headers.Authorization = `Bearer ${newToken}`; // 새 토큰으로 헤더 갱신
                response = await fetch(url, { ...options, headers }); // 요청 재시도
            } else {
                throw new Error("토큰 갱신 실패로 요청 중단");
            }
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`🔴 API 오류: ${errorData.message || response.status}`);
        }

        // ✅ [수정] 응답 본문이 있는 경우에만 JSON으로 파싱
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json(); // 서버에서 받은 JSON 데이터를 자바스크립트 객체로 변환
        } else {
            return response; // JSON이 아닌 경우 response 객체 그대로 반환
        }
    } catch (error) {
        console.error("🔴 API 요청 실패:", error.message);
        throw error;
    }
};
