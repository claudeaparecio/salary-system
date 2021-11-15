import React, { useState, useEffect }  from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import R from 'ramda';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoice, faHome, faCog, faSignOutAlt, faWallet } from '@fortawesome/free-solid-svg-icons';
import { ethers } from 'ethers'
import styled from 'styled-components'

import {
  Menu,
  Columns,
  Column,
  Navbar,
  Title,
  Image,
} from 'react-bulma-companion'

import { attemptLogout } from '_thunks/auth';

const StyledColumn = styled(Column)`
`

const StyledTitle = styled(Title)`
  color: #ffffff;
`

const TitleContainer = styled(Navbar.Item)`
  :hover {
    cursor: pointer;
  }
`


export default function Navigation({ pathname }) {
  const dispatch = useDispatch();
  const { user } = useSelector(R.pick(['user']));

  const [auth, setAuth] = useState(!R.isEmpty(user));

  useEffect(() => {
    setAuth(!R.isEmpty(user));
  }, [user.username]);

  const openMetaMask = () => {
    // A Web3Provider wraps a standard Web3 provider, which is
    // what MetaMask injects as window.ethereum into each page
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    const signer = provider.getSigner()
  }

    const logout = () =>
    dispatch(attemptLogout())
      .catch(R.identity);

  const isAdmin = user.role === 'admin'
  return auth ? (
    <StyledColumn size="2">
        <Menu>
        <TitleContainer
            to={'/home'}
            aria-label="main navigation"
          >
            <StyledTitle className="logo" size="3">
              Salary System
            </StyledTitle>
          </TitleContainer>
          <button  onClick={openMetaMask}/>
          <Image />
            <Menu.List>
              <Menu.ListItem>
                <Menu.Link
                  to="/home"
                  active={location.pathname.includes('home')}
                  component={Link}
                >
                  <FontAwesomeIcon icon={faHome}/>
                  Home
                </Menu.Link>
              </Menu.ListItem>
              {isAdmin && <Menu.ListItem>
                <Menu.Link
                  to="/wallet"
                  active={location.pathname.includes('wallet')}
                  component={Link}
                >
                  <FontAwesomeIcon icon={faWallet}/>
                  Wallet
                </Menu.Link>
              </Menu.ListItem>}
              <Menu.ListItem>
                <Menu.Link
                >
                  <FontAwesomeIcon icon={faFileInvoice} />
                  Invoices
                </Menu.Link>
                <Menu.List>
                <Menu.ListItem>
                  <Menu.Link
                    to="/invoice/history"
                    active={pathname.includes('history') || pathname === '/invoice' || pathname === '/invoice/'}
                    component={Link}
                  >
                    Invoices
                  </Menu.Link>
                </Menu.ListItem>
                {!isAdmin && <Menu.ListItem>
                  <Menu.Link
                    to="/invoice/create"
                    active={pathname.includes('create')}
                    component={Link}
                  >
                    Create
                  </Menu.Link>
                </Menu.ListItem>}
                </Menu.List>
              </Menu.ListItem>
              <Menu.ListItem>
                <Menu.Link>
                <FontAwesomeIcon icon={faCog} />
                  Settings
                </Menu.Link>
                <Menu.List>
                  <Menu.ListItem>
                    <Menu.Link
                      to="/settings/profile/"
                      active={location.pathname.includes('/settings/profile')}
                      component={Link}
                    >
                      Profile
                    </Menu.Link>
                  </Menu.ListItem>
                  <Menu.ListItem>
                    <Menu.Link
                      to="/settings/account/"
                      active={location.pathname.includes('/settings/account')}
                      component={Link}
                    >
                      Account
                    </Menu.Link>
                  </Menu.ListItem>
                </Menu.List>
            </Menu.ListItem>
            <Menu.ListItem>
              <Menu.Link onClick={logout} onKeyPress={logout}>
                <FontAwesomeIcon icon={faSignOutAlt} />
                Logout
              </Menu.Link>
            </Menu.ListItem>
          </Menu.List>
        </Menu>
        </StyledColumn>
    // <Navbar fixed="top" shadow>
    //   <Container>
    //     <Navbar.Brand>
    //       <Navbar.Item
    //         to={auth ? '/home' : '/'}
    //         aria-label="main navigation"
    //         component={Link}
    //       >
    //         <Title className="logo" size="3">
    //           Salary System
    //         </Title>
    //       </Navbar.Item>
    //       <div className="navbar-brand-right">
    //         {!auth && (
    //           <Navbar.Item
    //             className="is-hidden-desktop"
    //             to="/login"
    //             component={Link}
    //           >
    //             <Title size="6">
    //               Login
    //             </Title>
    //           </Navbar.Item>
    //         )}
    //         {!auth && (
    //           <Navbar.Item
    //             className="is-hidden-desktop"
    //             to="/register"
    //             component={Link}
    //           >
    //             <Button color="success">Sign Up</Button>
    //           </Navbar.Item>
    //         )}
    //         {auth && (
    //           <Navbar.Item
    //             className="is-hidden-desktop"
    //             onClick={toggleDropdown}
    //             onKeyPress={toggleDropdown}
    //             hoverable
    //             component="a"
    //           >
    //             <Image size="32x32">
    //               <Image.Content
    //                 className="profile-img"
    //                 src={user.profilePic || '/images/default-profile.png'}
    //               />
    //             </Image>
    //             <span className="dropdown-caret" />
    //           </Navbar.Item>
    //         )}
    //       </div>
    //     </Navbar.Brand>

    //     {auth ? (
    //       <Navbar.Menu>
    //         <Navbar.Start>
    //           <Navbar.Item
    //             className="is-hidden-mobile"
    //             to="/home"
    //             active={isHome}
    //             tab
    //             component={Link}
    //           >
    //             <Title size="6">Home</Title>
    //           </Navbar.Item>
    //           <Navbar.Item
    //             className="is-hidden-mobile"
    //             to="/invoice"
    //             active={isInvoice}
    //             tab
    //             component={Link}
    //           >
    //             <Title size="6">
    //               Invoice
    //             </Title>
    //           </Navbar.Item>
    //           <Navbar.Item
    //             className="is-hidden-mobile"
    //             to="/settings"
    //             active={isSettings}
    //             tab
    //             component={Link}
    //           >
    //             <Title size="6">
    //               Settings
    //             </Title>
    //           </Navbar.Item>
    //         </Navbar.Start>
    //         <Navbar.End>
    //           <Navbar.Item onClick={toggleDropdown} onKeyPress={toggleDropdown} hoverable component="a">
    //             <Image size="32x32">
    //               <Image.Content
    //                 className="profile-img"
    //                 src={user.profilePic || '/images/default-profile.png'}
    //               />
    //             </Image>
    //             <span className="dropdown-caret" />
    //           </Navbar.Item>
    //         </Navbar.End>
    //       </Navbar.Menu>
    //     ) : (
    //       <Navbar.Menu>
    //         <Navbar.End>
    //           <Navbar.Item to="/login" component={Link}>
    //             <Title size="6">
    //               Login
    //             </Title>
    //           </Navbar.Item>
    //           <Navbar.Item to="/register" component={Link}>
    //             <Button color="success">Sign Up</Button>
    //           </Navbar.Item>
    //         </Navbar.End>
    //       </Navbar.Menu>
    //     )}
    //     <UserDropdown open={open} closeDropdown={closeDropdown} />
    //   </Container>
    // </Navbar>
  ) : null;
}

Navigation.propTypes = {
  pathname: PropTypes.string.isRequired,
};
