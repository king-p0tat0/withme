import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../constant";
import { fetchWithAuth } from "../../common/fetchWithAuth";
import { EditorState, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "draft-js/dist/Draft.css";
import { stateToHTML } from "draft-js-export-html";
import htmlToDraft from "html-to-draftjs";

const PostForm = () => {
  const [post, setPost] = useState({
    title: "",
    content: "",
    postCategory: ""
  });
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const navigate = useNavigate();
  const { id } = useParams();

  // 게시글 불러오는 함수
  const fetchPost = async () => {
    try {
      const response = await fetchWithAuth(`${API_URL}posts/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
      }
      const data = await response.json();

      // Convert HTML content to DraftJS content state
      const contentBlock = htmlToDraft(data.content || "");
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        setEditorState(EditorState.createWithContent(contentState));
      }

      setPost({
        title: data.title || "",
        content: data.content || "",
        postCategory: data.postCategory || ""
      });
    } catch (error) {
      console.error("게시글 가져오기 실패:", error.message);
      alert("게시글을 불러오는데 실패했습니다.");
      navigate("/posts");
    }
  };

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  // Handle editor state changes
  const handleEditorChange = (state) => {
    setEditorState(state);
    setPost((prev) => ({
      ...prev,
      content: stateToHTML(state.getCurrentContent())
    }));
  };

  // 게시글 저장 함수
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!post.title.trim() || !post.content.trim() || !post.postCategory) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    try {
      const method = id ? "PUT" : "POST";
      const endpoint = `${API_URL}posts${id ? `/${id}` : ""}`;

      const postData = {
        title: post.title,
        content: post.content,
        postCategory: post.postCategory
      };

      const response = await fetchWithAuth(endpoint, {
        method,
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP 오류! 상태 코드: ${response.status}`
        );
      }

      alert(id ? "게시글이 수정되었습니다." : "게시글이 등록되었습니다.");
      window.scrollTo(0, 0);
      navigate("/posts");
    } catch (error) {
      console.error("게시글 저장 실패:", error.message);
      if (error.message.includes("Unauthorized")) {
        alert("로그인이 필요하거나 세션이 만료되었습니다.");
        navigate("/login");
      } else {
        alert("게시글 저장에 실패했습니다.");
      }
    }
  };

  const uploadImageCallBack = (file) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("image", file);

      fetchWithAuth(`${API_URL}upload`, {
        method: "POST",
        body: formData
      })
        .then((response) => response.json())
        .then((result) => {
          resolve({
            data: {
              link: result.imageUrl // 서버에서 반환하는 이미지 URL
            }
          });
        })
        .catch((error) => {
          console.error("Image upload error:", error);
          reject(error);
        });
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {id ? "게시글 수정" : "게시글 등록"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">제목:</label>
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">내용:</label>
          <Editor
            style={{
              height: "500px"
            }}
            editorState={editorState}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName="toolbar-class"
            onEditorStateChange={handleEditorChange}
            toolbar={{
              image: {
                uploadCallback: uploadImageCallBack,
                alt: { present: true, mandatory: false },
                previewImage: true,
                inputAccept:
                  "image/gif,image/jpeg,image/jpg,image/png,image/svg"
              }
            }}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">카테고리:</label>
          <select
            name="postCategory"
            value={post.postCategory}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500">
            <option value="">카테고리 선택</option>
            <option value="펫푸드">펫푸드</option>
            <option value="질문/꿀팁">질문/꿀팁</option>
            <option value="펫일상">펫일상</option>
            <option value="펫수다">펫수다</option>
            <option value="행사/정보">행사/정보</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none">
            저장
          </button>
          <button
            type="button"
            onClick={() => navigate("/posts")}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none">
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
