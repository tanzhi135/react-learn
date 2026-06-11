import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import HomePage from "./pages/HomePage";
import MapPage from "./pages/MapPage";
import BigScreen from "./pages/BigScreen";
// import Board from './pages/Board'
import Board1 from "./pages/Board1";
import NotFound from "./pages/NotFound";
import "antd/dist/reset.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/bigscreen" element={<BigScreen />} />
          {/* <Route path="/game" element={<Board />} /> */}
          <Route path="/game" element={<Board1 />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
