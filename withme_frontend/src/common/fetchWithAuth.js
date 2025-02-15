import { SERVER_URL } from "../constant"; // "/refresh" 요청 시 사용

/**
 * 액세스 토큰 갱신 함수
 * - 리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급받는 함수
 * - API_URL/auth/refresh 엔드포인트로 POST 요청을 보내서 새로운 액세스 토큰을 발급받음
 * - 응답이 성공하면 새로운 액세스 토큰을 반환
 *
 * @returns {Promise<boolean>} 성공 여부 반환
 */
export const refreshAccessToken = async () => {
  try {
    const response = await fetch(`${SERVER_URL}refresh`, {
      method: "POST",
      credentials: "include", // HttpOnly 쿠키를 포함해서 요청
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log(
      "refreshAccessToken /refresh 요청 후 받은 응답 response:",
      response
    );

    if (!response.ok) {
      console.log("리프레시 토큰 갱신 실패", response.status);
      return false;
    }

    const data = await response.json();
    if (data.accessToken) {
      localStorage.setItem("token", data.accessToken); // ✅ 새로운 액세스 토큰 저장
      console.log(
        "refreshAccessToken 리프레시 토큰 발급 성공, 새로운 액세스 토큰 저장"
      );
      return true;
    }

    return false;
  } catch (error) {
    console.error("리프레시 토큰 처리 오류:", error.message);
    return false;
  }
};

/**
 * API 요청을 보내는 함수
 * - 요청을 보낼 때 헤더와 JWT 토큰을 포함하여 요청
 * - options 객체에 method, body 등을 객체 형태로 만들어서 보내기 때문에 options = {}로 초기화
 * - credentials: "include" : 요청할 때 HttpOnly 쿠키를 포함해서 요청, 이게 있어야 서버에서 인증.
 *   서버에서는 이걸 받아서 토큰을 디코딩 해서 사용자 정보를 추출하고 그것을 SecurityContext 에 저장한다.
 *   그리고 저장된 정보에서 권한을 조회해서 요청한 메뉴에 대한 권한이 있는지 확인한다.
 * @param {string} url 요청할 URL
 * @param {Object} options fetch API의 두 번째 인자로 전달할 옵션 객체
 */
export const fetchWithAuth = async (url, options = {}) => {
  let token = localStorage.getItem("token"); // ✅ 기존 저장된 액세스 토큰 가져오기

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "" // ✅ JWT 포함
    },
    credentials: "include"
  };

  try {
    let response = await fetch(url, config);

    // 401 Unauthorized 발생 시 리프레시 토큰 사용하여 재시도
    if (response.status === 401) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (jsonError) {
        console.warn("401 응답을 JSON으로 변환할 수 없음");
        throw new Error("Unauthorized: 응답이 JSON 형식이 아님");
      }

      console.warn(`401 Error: ${errorData.message}`);

      if (errorData.message.includes("만료")) {
        console.log(
          "fetchWithAuth.js: 액세스 토큰 만료되어 refreshAccessToken() 호출 - 1"
        );
        const refreshSuccess = await refreshAccessToken();

        if (refreshSuccess) {
          // ✅ 새로운 액세스 토큰을 사용하여 기존 요청 재시도
          token = localStorage.getItem("token");
          config.headers.Authorization = `Bearer ${token}`;

          console.log("리프레시 토큰 성공, 기존 요청 재시도");
          response = await fetch(url, config);
        } else {
          console.error("리프레시 토큰 갱신 실패");
          throw new Error("Unauthorized: 리프레시 토큰 갱신 실패");
        }
      } else {
        throw new Error(`Unauthorized: ${errorData.message}`);
      }
    }

    return response;
  } catch (error) {
    console.error("API 요청 실패:", error.message);
    throw error;
  }
};

/**
 * 인증이 필요 없는 API 요청을 보내는 함수
 * - JWT 토큰을 포함하지 않고 요청
 * - 예를들면 회원가입, 로그인 등
 * @param url
 * @param options
 * @returns {Promise<Response>}
 */
export const fetchWithoutAuth = async (url, options = {}) => {
  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include"
  };

  try {
    const response = await fetch(url, config); // 비동기 요청
    return response; // 서버 응답 반환
  } catch (error) {
    console.error("API 요청 실패:", error.message);
    throw error; // 오류 다시 던지기
  }
};
