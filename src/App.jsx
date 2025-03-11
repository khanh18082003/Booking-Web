import AppLayout from "./components/layout/AppLayout";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./page/Home";
import Login from "./page/Login";
import Register from "./page/Register";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
