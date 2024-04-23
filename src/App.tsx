import "./App.css";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Registration from "./pages/Register";
import AmiCreation from "./pages/AmiCreation";
import Friends from "./pages/Friends";
import Showdowns from "./pages/Showdowns";
import MatchSimulation from "./pages/MatchSimulation";

function App() {
  return (
    <Router future={{ v7_startTransition: true }}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Home" Component={Home} />
        <Route path="/AmiCreation" Component={AmiCreation} />
        <Route path="/Registration" Component={Registration} />
        <Route path="/Friends" Component={Friends} />
        <Route path="/Showdowns" Component={Showdowns} />
        <Route path="/MatchSimulation" Component={MatchSimulation} />
      </Routes>
    </Router>
  );
}

export default App;
