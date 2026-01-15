import "./App.css";
import { Route, Routes } from "react-router-dom";
import GuestInvitation from "./assets/Views/GuestInvitation";
import Home from "./assets/components/Home";
import Login from "./assets/Views/Login";
import Register from "./assets/Views/Register";
import CreateEvent from "./assets/Views/AddWeddingEvent";
import InvitationList from "./assets/Views/InvitationList";
import AddInvitation from "./assets/Views/AddInvitation";
function App() {
  return (
    <div className="app-container overflow-x-hidden dark:bg-black bg-white font-sans">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        {/* Tạo sự kiện  */}
        <Route path="/create-event" element={<CreateEvent />} />

        {/* Tạo thiệp mới và danh sách các thiệp mời */}
        <Route
          path="/:weddingSlug/create-invitation"
          element={<AddInvitation />}
        />
        {/* Xem chi tiết thiệp mời  */}
        <Route
          path="/:weddingSlug/:guestNameSlug"
          element={<GuestInvitation />}
        ></Route>
        {/* Danh sách các thiệp */}
        <Route path="/:weddingSlug" element={<InvitationList />} />
      </Routes>
    </div>
  );
}

export default App;
