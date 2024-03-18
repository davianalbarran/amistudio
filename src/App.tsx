import "./App.css";
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./pages/Login";
import Home, { HomeProps } from "./pages/Home";
import Registration from "./pages/Register";
import AmiCreation from "./pages/AmiCreation";

function App() {
    const defaultAmiProps: HomeProps = {
    amiData: {
      name: 'Your Ami',
      // Add other Ami data properties
    },
    stats: {
      str: 10,
      end: 8,
      int: 12,
    },
  };

    return (
        <Router future={{ v7_startTransition: true }} >
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/Home" element={<Home {...defaultAmiProps} />} />
                <Route path="/AmiCreation" Component={AmiCreation} />
                <Route path="/Registration" Component={Registration} />
            </Routes>
        </Router>
    );
}

export default App;
