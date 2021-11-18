import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { Switch, Route } from "react-router";
import R from "ramda";

import { attemptGetReceipts } from "_thunks/receipts";
import Section from "react-bulma-companion/lib/Section";
import Container from "react-bulma-companion/lib/Container";
import Columns from "react-bulma-companion/lib/Columns";
import Column from "react-bulma-companion/lib/Column";

import ReceiptList from "_templates/ReceiptList";

export default function ReceiptPage({ location }) {
  const dispatch = useDispatch();
  const { user } = useSelector(R.pick(["user"]));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (R.isEmpty(user)) {
      dispatch(push("/login"));
    } else {
      dispatch(attemptGetReceipts())
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
                <Route path="/receipt/history/" component={ReceiptList} />
                <Route path="*" component={ReceiptList} />
              </Switch>
            </Column>
          </Columns>
        </Container>
      </Section>
    </div>
  );
}
