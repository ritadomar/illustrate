import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { useContext, useRef } from 'react';
import { AuthContext } from '../context/auth.context';
import { Link, useNavigate } from 'react-router-dom';

function ProfileMenu() {
  const { isLoggedIn, logOutUser, user } = useContext(AuthContext);
  const menuRight = useRef(null);

  const navigate = useNavigate();

  const items = [
    // {
    //   //   label: 'Options',
    //   items: [
    {
      template: () => {
        return (
          <>
            <Link to={`/${user.username}`}>
              <Avatar image={user.avatarUrl} size="xlarge" shape="circle" />
              <p>{user.username}</p>
            </Link>
            {user.isArtist && (
              <>
                <Link to="/upload">Upload Art</Link>
                <Link to="/newCommission">Create Commission</Link>
              </>
            )}
            <Link onClick={logOutUser}>Log Out</Link>
          </>
        );
      },
    },
    { separator: true },
    {
      label: 'Upload Artwork',
      icon: 'pi pi-upload',
      command: () => {
        navigate('/upload');
      },
    },
    {
      label: 'Create Commission',
      icon: 'pi pi-folder',
      command: () => {
        navigate('/newCommission');
      },
    },
    { separator: true },
    {
      label: 'Log Out',
      icon: 'pi pi-sign-out',
      command: () => {
        logOutUser();
      },
    },
  ];
  // },
  //   ];

  return (
    <>
      {isLoggedIn && (
        <>
          {user.avatarUrl.length > 0 && (
            <Avatar
              image={user.avatarUrl}
              size="large"
              shape="circle"
              onClick={event => menuRight.current.toggle(event)}
              aria-controls="popup_menu_right"
              aria-haspopup
            />
          )}
          {user.avatarUrl.length <= 0 && (
            <Avatar
              label={user.username[0].toUpperCase()}
              size="large"
              shape="circle"
              onClick={event => menuRight.current.toggle(event)}
              aria-controls="popup_menu_right"
              aria-haspopup
            />
          )}
        </>
      )}
      <Menu
        model={items}
        popup
        ref={menuRight}
        id="popup_menu_right"
        popupAlignment="right"
        // onMouseLeave={e => menuRight.current.toggle(e)}
      />
    </>
  );
}

export default ProfileMenu;
