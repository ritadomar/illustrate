import './App.css';

import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Error from './pages/Error';

// Explore
import Explore from './pages/Explore';
import ExploreTag from './pages/ExploreTag';
import FindCommissions from './pages/FindCommissions';
import FindCommissionsTag from './pages/FindCommissionsTag';

// Auth
import SignUp from './pages/SignUp';
import LogIn from './pages/LogIn';

// Protect
import IsAnon from './components/IsAnon';
import IsPrivate from './components/IsPrivate';
import IsForArtists from './components/IsForArtists';
import IsSigning from './components/IsSigning';

// Profile
import Profile from './pages/Profile';

// Artwork
import UploadArtwork from './pages/UploadArtwork';
import ArtworkDetails from './pages/ArtworkDetails';
import EditArtwork from './pages/EditArtwork';

// Commissions
import CreateCommission from './pages/CreateCommission';
import CommissionDetails from './pages/CommissionDetails';
import EditCommission from './pages/EditCommission';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        <Route path="/explore" element={<Explore />} />
        <Route path="/explore/:tagName" element={<ExploreTag />} />
        <Route path="/find" element={<FindCommissions />} />
        <Route path="/find/:tagName" element={<FindCommissionsTag />} />

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
        <Route
          path="/:username/artwork/:artworkId"
          element={<ArtworkDetails />}
        />
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
          path="/:username/artwork/:artworkId/edit"
          element={
            <IsPrivate>
              <IsForArtists>
                <EditArtwork />
              </IsForArtists>
            </IsPrivate>
          }
        />

        {/* Commission routes */}
        <Route
          path="/:username/commission/:commissionId"
          element={<CommissionDetails />}
        />
        <Route
          path="/newCommission"
          element={
            <IsPrivate>
              <IsForArtists>
                <CreateCommission />
              </IsForArtists>
            </IsPrivate>
          }
        />
        <Route
          path="/:username/commission/:commissionId/edit"
          element={
            <IsPrivate>
              <IsForArtists>
                <EditCommission />
              </IsForArtists>
            </IsPrivate>
          }
        />

        <Route path="*" element={<Error />} />
      </Routes>
      <IsSigning>
        <Footer />
      </IsSigning>
    </>
  );
}

export default App;
