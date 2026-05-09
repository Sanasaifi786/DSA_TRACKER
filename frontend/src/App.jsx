import { useState } from 'react'
import Home from './pages/Home.jsx';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
function App() {

  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path = "/" element = {<Home/>}/>
        <Route path = "/signIn" element = {<SignIn/>}/>
        <Route path = "/signUp" element = {<Signup/>}/>
        <Route path="/sheet/:sheet" element={<SheetPage />} />
        <Route path="/progress" element={<Progress />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
