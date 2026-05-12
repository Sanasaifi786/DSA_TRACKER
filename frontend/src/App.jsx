import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import SignIn from './pages/signIn.jsx';
import SignUp from './pages/SignUp.jsx';
import Navbar from './components/Navbar.jsx';
import PageTitle from './components/PageTitle.jsx';

function App() {
  return (
    <BrowserRouter>
      <PageTitle />  {/* ← updates browser tab title on every route change */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
