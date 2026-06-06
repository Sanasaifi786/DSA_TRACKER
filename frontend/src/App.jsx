import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import SignIn from './pages/SignIn.jsx';
import SignUp from './pages/SignUp.jsx';
import SheetPage from './pages/SheetPage.jsx';
import Progress from './pages/Progress.jsx';
import AIInsights from './pages/AIInsights.jsx';
import NotFound from './pages/NotFound.jsx';
import Navbar from './components/Navbar.jsx';
import PageTitle from './components/PageTitle.jsx';
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
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/sheet/:sheet" element={<SheetPage />} />

            {/* Protected — login required */}
            <Route path="/progress" element={
              <ProtectedRoute><Progress /></ProtectedRoute>
            } />
            <Route path="/ai-insights" element={
              <ProtectedRoute><AIInsights /></ProtectedRoute>
            } />

            {/* 404 — catch all unknown routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
