import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chat from './pages/Chat';
import { useSelector, useStore } from 'react-redux';
import { useState } from 'react';
import { AppContext, socket } from './context/appContext';

function App() {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState([]);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [privateMemberMsg, setPrivateMemberMsg] = useState({});
  const [newMessages, setNewMessages] = useState({});

// to access the state and grab the user (react-redux)
  const user = useSelector((state) => state.user);

  return (
    // All the states have to be passed as values so the components have access to them. Context documentation https://reactjs.org/docs/context.html#contextprovider
    <AppContext.Provider value={{ socket, rooms, setRooms, currentRoom, setCurrentRoom, members, setMembers, messages, setMessages, privateMemberMsg, setPrivateMemberMsg, newMessages, setNewMessages}}>
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
    </AppContext.Provider>
  );
}

export default App;
