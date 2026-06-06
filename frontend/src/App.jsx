import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home          from './pages/Home.jsx';
import SignIn        from './pages/signIn.jsx';
import SignUp        from './pages/SignUp.jsx';
import SheetPage     from './pages/SheetPage.jsx';
import Progress      from './pages/Progress.jsx';
import Navbar        from './components/Navbar.jsx';
import PageTitle     from './components/PageTitle.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider }  from './context/AuthContext.jsx';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <PageTitle />
          <Navbar />
          <Routes>
            <Route path="/"             element={<Home />} />
            <Route path="/signin"       element={<SignIn />} />
            <Route path="/signup"       element={<SignUp />} />
            <Route path="/sheet/:sheet" element={<SheetPage />} />

            {/* Protected — must be logged in */}
            <Route path="/progress" element={
              <ProtectedRoute><Progress /></ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
