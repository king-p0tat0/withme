import { Routes, Route } from "react-router-dom";
import MainNotice from "./components/notice/MainNotice.jsx";
import NoticeList from "./components/notice/NoticeList.jsx";
import CreateNotice from "./components/notice/CreateNotice.jsx";
import EditNotice from "./components/notice/EditNotice.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainNotice />} />
      <Route path="/notices" element={<NoticeList />} />
      <Route path="/create" element={<CreateNotice />} />
      <Route path="/edit/:id" element={<EditNotice />} />
    </Routes>
  );
};

export default App;
