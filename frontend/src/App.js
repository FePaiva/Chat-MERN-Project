import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chat from './pages/Chat';
import { useStore } from 'react-redux';

function App() {

  const user = useStore((state) => state.user);

  return (
      <BrowserRouter> 
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            {!user && ( 
                <> 
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                </>
            )}
            <Route path="/chat" element={<Chat />} />

          </Routes>
      </BrowserRouter>
  );
}

export default App;
