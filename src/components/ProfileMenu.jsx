import { Menu } from 'primereact/menu';
import { Avatar } from 'primereact/avatar';
import { useContext, useRef } from 'react';
import { AuthContext } from '../context/auth.context';
import { Link, useNavigate } from 'react-router-dom';

function ProfileMenu() {
  const { isLoggedIn, logOutUser, user } = useContext(AuthContext);
  const menuRight = useRef(null);

  const navigate = useNavigate();

  const items = [];

  if (user && user.isArtist) {
    const insertItems = [
      {
        template: () => {
          return (
            <>
              {isLoggedIn && (
                <div className="profileLink">
                  <Link to={`/${user.username}`}>
                    {user.avatarUrl && (
                      <Avatar
                        image={user.avatarUrl}
                        size="xlarge"
                        shape="circle"
                        className="object-cover border-4 border-brand"
                      />
                    )}
                    {!user.avatarUrl && (
                      <Avatar
                        label={user.username[0].toUpperCase()}
                        size="xlarge"
                        shape="circle"
                        className="object-cover border-4 border-brand"
                      />
                    )}
                    <p>{user.username}</p>
                  </Link>
                </div>
              )}
            </>
          );
        },
      },
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
    items.push(insertItems);
  } else if (user && !user.isArtist) {
    const insertItems = [
      {
        template: () => {
          return (
            <>
              {isLoggedIn && (
                <div className="profileLink">
                  <Link to={`/${user.username}`}>
                    {user.avatarUrl && (
                      <Avatar
                        image={user.avatarUrl}
                        size="large"
                        shape="circle"
                        className="object-cover border-4 border-brand"
                      />
                    )}
                    {!user.avatarUrl && (
                      <Avatar
                        label={user.username[0].toUpperCase()}
                        size="large"
                        shape="circle"
                        className="object-cover border-4 border-brand"
                      />
                    )}
                    <p>{user.username}</p>
                  </Link>
                </div>
              )}
            </>
          );
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
    items.push(insertItems);
  }

  return (
    <>
      {isLoggedIn && (
        <Link to={`/${user.username}`}>
          {user.avatarUrl && (
            <Avatar
              image={user.avatarUrl}
              size="large"
              shape="circle"
              onMouseEnter={event => menuRight.current.toggle(event)}
              aria-controls="popup_menu_right"
              aria-haspopup
              className="object-cover border-4 border-brand"
            />
          )}
          {!user.avatarUrl && (
            <Avatar
              label={user.username[0].toUpperCase()}
              size="large"
              shape="circle"
              onMouseEnter={event => menuRight.current.toggle(event)}
              aria-controls="popup_menu_right"
              aria-haspopup
              className="object-cover bg-accent-light border-4 border-brand"
            />
          )}
        </Link>
      )}
      <Menu
        model={items[0]}
        popup
        ref={menuRight}
        id="popup_menu_right"
        popupAlignment="right"
        onMouseLeave={e => menuRight.current.toggle(e)}
      />
    </>
  );
}

export default ProfileMenu;
