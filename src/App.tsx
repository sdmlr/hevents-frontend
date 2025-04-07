import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from './pages/Home';
import Events from './pages/Events';
// You can add more pages like Login, Dashboard, etc.

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/events" element={<Events />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
