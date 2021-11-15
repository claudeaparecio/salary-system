import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import R from 'ramda';

import Section from 'react-bulma-companion/lib/Section';
import Container from 'react-bulma-companion/lib/Container';
import Title from 'react-bulma-companion/lib/Title';
import { Bar } from 'react-chartjs-2'
import {
  Columns,
  Column,
  Box,
  Notification,
} from 'react-bulma-companion'

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

const data = {
  labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'],
  datasets: [
    {
      data: [1200, 1900, 3000, 5000, 2000, 3000],
      // backgroundColor: [
      //   'rgba(255, 99, 132, 0.2)',
      //   'rgba(54, 162, 235, 0.2)',
      //   'rgba(255, 206, 86, 0.2)',
      //   'rgba(75, 192, 192, 0.2)',
      //   'rgba(153, 102, 255, 0.2)',
      //   'rgba(255, 159, 64, 0.2)',
      // ],
      // borderColor: [
      //   'rgba(255, 99, 132, 1)',
      //   'rgba(54, 162, 235, 1)',
      //   'rgba(255, 206, 86, 1)',
      //   'rgba(75, 192, 192, 1)',
      //   'rgba(153, 102, 255, 1)',
      //   'rgba(255, 159, 64, 1)',
      // ],
      borderWidth: 1,
    },
  ],
};


export default function HomePage() {
  const dispatch = useDispatch();
  const { user } = useSelector(R.pick(['user']));

  useEffect(() => {
    if (R.isEmpty(user)) {
      dispatch(push('/login'));
    }
  }, []);

  return (
    <div className="home-page page">
      <Section>
        <Container>
          <Title size="1">
            Home Page
          </Title>
          <Columns>
            <Column>
              <Box>
                Balance
              </Box>
              <Box>
                History
                <Notification>
                  Transaction 1
                </Notification>
                <Notification>
                  Transaction 2
                </Notification>
                <Notification>
                  Transaction 3
                </Notification>
              </Box>
            </Column>
            <Column>
              <Box>
                Contracts
              </Box>
              <Box>
                Money Earned Graph
                <Bar data={data} options={{
                  onHover: () => {}
                }} />
              </Box>
            </Column>
          </Columns>
        </Container>
      </Section>
    </div>
  );
}
