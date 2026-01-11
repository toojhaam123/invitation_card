import "./App.css";
import { Route, Routes } from "react-router-dom";
import GuestInvitation from "./assets/Views/GuestInvitation";
import Home from "./assets/components/Home";
import Login from "./assets/Views/Login";
import Register from "./assets/Views/Register";
import CreateInvitation from "./assets/Views/CreatInvitations";
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login></Login>}></Route>
      <Route path="/register" element={<Register></Register>}></Route>
      {/* Route tạo thiệp */}
      <Route
        path="/create"
        element={<CreateInvitation></CreateInvitation>}
      ></Route>
      {/* Xem chi tiết thiệt */}
      <Route path=":slug" element={<GuestInvitation></GuestInvitation>}></Route>
      {/* Trang 404 */}
      <Route path="/" element={<Home></Home>}></Route>
    </Routes>
  );
}

export default App;
