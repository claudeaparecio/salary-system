import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import R from "ramda";
import {
  faFileInvoice,
  faHome,
  faCog,
  faSignOutAlt,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { ethers } from "ethers";
import styled from "styled-components";

import {
  Menu,
  Columns,
  Column,
  Navbar,
  Title,
  Image,
} from "react-bulma-companion";
import logo from '../../../assets/images/swipebit-white.png'

import { attemptLogout } from "_thunks/auth";

const CustomIcon = styled(FontAwesomeIcon)`
  margin-right: 10px;
`;

const Logo = styled.img`
  height: 40px;
  width: 70%;
  margin-bottom: 20px;
`;

const StyledColumn = styled(Column)`
  background-color: #0e47bb ;
  padding: 24px;
  padding-top: 35px;
`;

const StyledTitle = styled(Title)`
  color: #01090f;
  margin-bottom: 20px;
`;

const TitleContainer = styled(Navbar.Item)`
  :hover {
    cursor: pointer;
  }
`;

const MenuLink = styled(Menu.Link)`
  font-size: 13px;
  padding: 6px 16px;
  border-radius: 4px;
  color: #fff !important;
`;

const MenuItem = styled(Menu.ListItem)`
  margin-bottom: 5px;
`;

export default function Navigation({ pathname }) {
  const dispatch = useDispatch();
  const { user } = useSelector(R.pick(["user"]));

  const [auth, setAuth] = useState(!R.isEmpty(user));

  useEffect(() => {
    setAuth(!R.isEmpty(user));
  }, [user.username]);

  const logout = () => dispatch(attemptLogout()).catch(R.identity);

  const isAdmin = user.role === "admin";
  return auth ? (
    <StyledColumn size="3">
      <Menu>
        <Logo src={logo}/>
        <Image />
        <Menu.List>
          <MenuItem>
            <MenuLink
              to="/home"
              active={location.pathname.includes("home")}
              component={Link}
              color="#000"
            >
              <CustomIcon icon={faHome} />
              Home
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink>
              <CustomIcon icon={faFileInvoice} />
              Invoices
            </MenuLink>
            <Menu.List>
              <MenuItem>
                <MenuLink
                  to="/invoice/history"
                  active={
                    pathname.includes("invoice") ||
                    pathname === "/invoice" ||
                    pathname === "/invoice/"
                  }
                  component={Link}
                >
                  Invoices
                </MenuLink>
              </MenuItem>
              {!isAdmin && (
                <MenuItem>
                  <MenuLink
                    to="/invoice/create"
                    active={pathname.includes("create")}
                    component={Link}
                  >
                    Create
                  </MenuLink>
                </MenuItem>
              )}
            </Menu.List>
          </MenuItem>
          <MenuItem>
            <MenuLink
              to="/receipt/history"
              active={
                pathname.includes("receipt") ||
                pathname === "/receipt" ||
                pathname === "/receipt/"
              }
              component={Link}            
            >
              <CustomIcon icon={faFileInvoice} />
              Receipts
            </MenuLink>
          </MenuItem>
          {!isAdmin && (
            <MenuItem>
              <MenuLink>
                <CustomIcon icon={faCog} />
                Settings
              </MenuLink>
              <Menu.List>
                <MenuItem>
                  <MenuLink
                    to="/settings/profile/"
                    active={location.pathname.includes("/settings/profile")}
                    component={Link}
                  >
                    Profile
                  </MenuLink>
                </MenuItem>
                <MenuItem>
                  <MenuLink
                    to="/settings/account/"
                    active={location.pathname.includes("/settings/account")}
                    component={Link}
                  >
                    Account
                  </MenuLink>
                </MenuItem>
              </Menu.List>
            </MenuItem>
          )}
          <MenuItem>
            <MenuLink onClick={logout} onKeyPress={logout}>
              <CustomIcon icon={faSignOutAlt} />
              Logout
            </MenuLink>
          </MenuItem>
        </Menu.List>
      </Menu>
    </StyledColumn>
  ) : null;
}

Navigation.propTypes = {
  pathname: PropTypes.string.isRequired,
};
