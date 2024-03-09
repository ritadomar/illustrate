import './App.css';

import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import LogIn from './pages/LogIn';
import IsAnon from './components/IsAnon';
import IsPrivate from './components/IsPrivate';
import UploadArt from './pages/UploadArt';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />
        <Route
          path="/signup"
          element={
            <IsAnon>
              <SignUp />
            </IsAnon>
          }
        />
        <Route
          path="/login"
          element={
            <IsAnon>
              <LogIn />
            </IsAnon>
          }
        />
        <Route
          path="/newPost"
          element={
            <IsPrivate>
              <UploadArt />
            </IsPrivate>
          }
        />
      </Routes>
    </>
  );
}

export default App;
