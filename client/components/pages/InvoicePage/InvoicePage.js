import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { Switch, Route } from "react-router";
import R from "ramda";

import { attemptGetInvoices } from "_thunks/invoices";
import Section from "react-bulma-companion/lib/Section";
import Container from "react-bulma-companion/lib/Container";
import Columns from "react-bulma-companion/lib/Columns";
import Column from "react-bulma-companion/lib/Column";

import InvoiceMenu from "_organisms/InvoiceMenu";
import InvoiceList from "_templates/InvoiceList";
import InvoiceDetails from "_templates/InvoiceDetails";
import CreateInvoice from "_templates/CreateInvoice";

export default function InvoicePage({ location }) {
  const dispatch = useDispatch();
  const { user } = useSelector(R.pick(["user"]));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (R.isEmpty(user)) {
      dispatch(push("/"));
    } else {
      dispatch(attemptGetInvoices())
        .catch(R.identity)
        .then((res) => setLoading(false));
    }
  }, []);

  return (
    <div className="invoice-page page">
      <Section>
        <Container>
          <Columns>
            <Column>
              <Switch>
                <Route path="/invoice/history/" component={InvoiceList} />
                <Route
                  exact
                  path="/invoice/details/:id"
                  component={InvoiceDetails}
                />
                <Route path="/invoice/create/" component={CreateInvoice} />
                <Route path="*" component={InvoiceList} />
              </Switch>
            </Column>
          </Columns>
        </Container>
      </Section>
    </div>
  );
}
