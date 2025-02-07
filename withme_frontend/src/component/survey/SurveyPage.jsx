import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const SurveyPage = () => {
  const navigate = useNavigate();
  const userType = useSelector((state) => state.auth.user?.userType);

  useEffect(() => {
    if (userType === "FREE") {
      navigate("/survey/free");
    } else if (userType === "PAID") {
      navigate("/survey/paid");
    } else {
      navigate("/login");
    }
  }, [userType, navigate]);

  return <div>문진 검사 페이지로 이동 중...</div>;
};

export default SurveyPage;
