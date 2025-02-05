import axios from "axios";
import PropTypes from "prop-types"; // prop-types 패키지 import

const DeleteButton = ({ id, onDelete }) => {
  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await axios.delete(`/api/notices/${id}`);
        alert("공지사항이 삭제되었습니다.");
        if (onDelete) onDelete(); // 삭제 후 리스트 갱신 콜백 호출
      } catch (error) {
        console.error("공지사항 삭제 중 오류가 발생했습니다.", error);
      }
    }
  };

  return <button onClick={handleDelete}>삭제</button>;
};

// Props Validation
DeleteButton.propTypes = {
  id: PropTypes.number.isRequired, // id는 필수 숫자 값
  onDelete: PropTypes.func.isRequired // onDelete는 필수 함수
};

export default DeleteButton;
