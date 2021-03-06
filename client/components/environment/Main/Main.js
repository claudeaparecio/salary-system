import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router";
import ReactNotification from "react-notifications-component";
import { useDispatch } from "react-redux";
import R from "ramda";

import { attemptGetUser } from "_thunks/user";

import { Columns, Column, Navbar, Button } from "react-bulma-companion";

import LoginPage from "_pages/LoginPage";
import RegisterPage from "_pages/RegisterPage";
import HomePage from "_pages/HomePage";
import InvoicePage from "_pages/InvoicePage";
import SettingsPage from "_pages/SettingsPage";
import LostPage from "_pages/LostPage";
import ReceiptPage from "_pages/ReceiptPage";

import Navigation from "_organisms/Navigation";
import Footer from "_organisms/Footer";

export default function Main({ location }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscribed = true;

    dispatch(attemptGetUser())
      .then(() => subscribed && setLoading(false))
      .catch(R.identity);

    return () => {
      subscribed = false;
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    !loading && (
      <div>
        <Columns>
          <Navigation pathname={location.pathname} />
          <ReactNotification />
          <Column>
            <div className="main">
              <Switch>
                <Route exact path="/" component={LoginPage} />
                <Route path="/register" component={RegisterPage} />
                <Route path="/home" component={HomePage} />
                <Route path="/invoice" component={InvoicePage} />
                <Route path="/receipt" component={ReceiptPage} />
                <Route path="/settings" component={SettingsPage} />
                <Route path="*" component={LostPage} />
              </Switch>
            </div>
            <Footer />
          </Column>
        </Columns>
      </div>
    )
  );
}

Main.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
};
