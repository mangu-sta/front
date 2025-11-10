import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Scheduler from "./pages/Scheduler";
import Community from "./pages/Community";
import CharacterSearch from "./pages/CharacterSearch";
import RaidInfo from "./pages/RaidInfo";
import Sasaeng from "./pages/AccidentSearch";
import "./styles/common.css";
import "./styles/page.css";

export default function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scheduler" element={<Scheduler />} />
          <Route path="/community" element={<Community />} />
          <Route path="/character/search" element={<CharacterSearch />} />
          <Route path="/raid/info" element={<RaidInfo />} />
          <Route path="/AccidentSearch" element={<Sasaeng />} />
        </Routes>
      </main>
    </Router>
  );
}
