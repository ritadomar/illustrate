import './App.css';

import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import LogIn from './pages/LogIn';
import IsAnon from './components/IsAnon';
import IsPrivate from './components/IsPrivate';
import IsForArtists from './components/IsForArtists';
import UploadArtwork from './pages/UploadArtwork';
import Profile from './pages/Profile';
import ArtworkDetails from './pages/ArtworkDetails';
import EditArtwork from './pages/EditArtwork';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Account */}
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
        {/* Profile */}
        <Route path="/:username" element={<Profile />} />

        {/* Artwork routes */}
        <Route path="/:username/:artworkId" element={<ArtworkDetails />} />
        <Route
          path="/upload"
          element={
            <IsPrivate>
              <IsForArtists>
                <UploadArtwork />
              </IsForArtists>
            </IsPrivate>
          }
        />
        <Route
          path="/:username/:artworkId/edit"
          element={
            <IsPrivate>
              <IsForArtists>
                <EditArtwork />
              </IsForArtists>
            </IsPrivate>
          }
        />

        {/* Commission routes */}
        <Route path="/:username/:artworkId" element={<ArtworkDetails />} />
        <Route
          path="/upload"
          element={
            <IsPrivate>
              <IsForArtists>
                <UploadArtwork />
              </IsForArtists>
            </IsPrivate>
          }
        />
        <Route
          path="/:username/:artworkId/edit"
          element={
            <IsPrivate>
              <IsForArtists>
                <EditArtwork />
              </IsForArtists>
            </IsPrivate>
          }
        />
      </Routes>
    </>
  );
}

export default App;
