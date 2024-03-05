import "./App.css";
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./pages/Login";

function App() {
  return (
  <Router future={{ v7_startTransition: true }} >
    <Routes>
        <Route path="/" Component={Login} />
    </Routes>
  </Router>
    );
}

export default App;
