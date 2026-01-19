import "./App.css";
import { Route, Routes } from "react-router-dom";
import GuestInvitation from "./assets/Views/GuestInvitation";
import Home from "./assets/components/Home";
import Login from "./assets/Views/Login";
import Register from "./assets/Views/Register";
import AddOrUpdateWeddingEvent from "./assets/Views/AddOrUpdateWeddingEvent";
import InvitationList from "./assets/Views/InvitationList";
import AddInvitation from "./assets/Views/AddInvitation";
import ProtectRoute from "./assets/components/ProtectRoute";
function App() {
  return (
    <div className="app-container overflow-x-hidden dark:bg-black bg-white font-sans">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />

        {/* Tạo sự kiện  */}
        <Route
          path="/create-event/"
          element={
            <ProtectRoute>
              <AddOrUpdateWeddingEvent />
            </ProtectRoute>
          }
        />

        {/* Chỉnh sửa sự kiện */}
        <Route
          path="/edit-event/:eventId"
          element={
            <ProtectRoute>
              <AddOrUpdateWeddingEvent />
            </ProtectRoute>
          }
        ></Route>

        {/* Xem trước khi tạo sự kiện */}
        <Route
          path="/previewEvent"
          element={
            <ProtectRoute>
              <GuestInvitation />
            </ProtectRoute>
          }
        ></Route>

        {/* Tạo thiệp mới và danh sách các thiệp mời */}
        <Route
          path="/:weddingSlug/create-invitation"
          element={
            <ProtectRoute>
              <AddInvitation />
            </ProtectRoute>
          }
        />
        {/* Xem chi tiết thiệp mời  */}
        <Route
          path="/:weddingSlug/:guestNameSlug"
          element={<GuestInvitation />}
        ></Route>

        {/* Danh sách các thiệp */}
        <Route
          path="/:weddingSlug"
          element={
            <ProtectRoute>
              <InvitationList />
            </ProtectRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
