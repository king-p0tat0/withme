import { useDispatch } from "react-redux";
import {fetchUserInfo, setUser} from "../../redux/authSlice";
import { API_URL } from "../../constant";
import { fetchWithAuth } from "../../common/fetchWithAuth"; // fetchWithAuth 함수 import
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { useSelector } from "react-redux";


export default function MyPage() {
    const dispatch = useDispatch(); // Redux 디스패치 가져오기
    // URL 파라미터에서 id 가져오기, App 컴포넌트에서 Route의 path에 설정한 URL 파라미터를 가져옴,
    // 여기서는 미사용 왜냐하면 리덕스 스토어에 보관한 값을 사용, 하지만 다른 형태로 구현시 필요해서 코드 유지함.
    // 여기서 미사용시 App 컴포넌트에서 Route의 path에 설정한 URL 파라미터를 가져오는 코드를 삭제해도 무방함.
    const { id } = useParams(); //
    // 리덕스 스토어에서 사용자 정보 가져오기
    const { user } = useSelector((state) => state.auth);
    // 사용자 정보를 저장할 상태 변수
    const [member, setMember] = useState({
        id: "",
        name: "",
        email: "",
        phone: "",
        address: "",
    });

    /**
     * 컴포넌트가 처음 렌더링될 때 사용자 정보를 불러옴
     * - user가 변경될 때마다 사용자 정보를 다시 불러옴
     */
    useEffect(() => {
        if (user) {
            fetchMemberData(user.id); // url 파라미터로 받은 id를 사용하여 사용자 정보를 불러옴
        }
    }, [user]);

    /**
     * 사용자 정보 불러오기
     */
    const fetchMemberData = async (memberId) => {
            try {
                const response = await fetchWithAuth(`${API_URL}members/${memberId}`, { method: "GET" });
                console.log('fetchMemberData response : ', response);

                if (response.ok) {
                    const result = await response.json();
                    console.log('fetchMemberData result : ', result);

                    const userData = result.data;
                    setMember({
                        id: userData.id,
                        name: userData.name,
                        email: userData.email,
                        phone: userData.phone,
                        address: userData.address,
                    });
                } else {
                    console.error("사용자 정보 로드 실패:", response.status);
                    alert("사용자 정보를 불러올 수 없습니다.");
                }
            } catch (error) {
                console.error("사용자 정보 로드 중 오류 발생:", error.message);
                alert("사용자 정보 로드 실패: 네트워크 또는 서버 오류");
            }
        };


    /**
     * 사용자 정보 수정 요청 처리
     * @returns {Promise<void>}
     */
    const handleUpdate = async () => {
        try {
            // 사용자 정보 수정 요청
            const response = await fetchWithAuth(`${API_URL}members/${user.id}`, {
                method: "PUT",
                body: JSON.stringify(member),
            });
            console.log(`${API_URL}`);
            if (response.ok) {
                const result = await response.json();

                // 컨트롤러 응답에서 사용자 데이터 추출
                const updatedData = {
                    id: result.id,
                    email: result.email,
                    name: result.name,
                    roles: result.roles,
                };

                console.log("사용자 정보 수정 성공:", updatedData);

                // Redux 상태 업데이트
                dispatch(setUser(updatedData));

                alert("사용자 정보가 수정되었습니다.");
            } else {
                console.error("사용자 정보 수정 실패:", response.status);
                alert("사용자 정보 수정 실패");
            }
        } catch (error) {
            console.error("사용자 정보 수정 중 오류 발생:", error.message);
            alert("사용자 정보 수정 실패: 네트워크 또는 서버 오류");
        }
    };

    const handleInputChange = (event) => {
        setMember({ ...member, [event.target.name]: event.target.value });
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px" }}>
            <Typography variant="h4" style={{ marginBottom: "20px", fontWeight: "bold" }}>
                마이페이지
            </Typography>
            <TextField label="Name" name="name" value={member.name} onChange={handleInputChange} style={{ width: "400px", marginBottom: "10px" }} />
            <TextField label="Email" name="email" value={member.email} disabled style={{ width: "400px", marginBottom: "10px" }} />
            <TextField label="Phone" name="phone" value={member.phone} onChange={handleInputChange} style={{ width: "400px", marginBottom: "10px" }} />
            <TextField label="Address" name="address" value={member.address} onChange={handleInputChange} style={{ width: "400px", marginBottom: "10px" }} />
            <Button variant="contained" onClick={handleUpdate} style={{ marginTop: "20px" }}>
                저장
            </Button>
        </div>
    );
}
