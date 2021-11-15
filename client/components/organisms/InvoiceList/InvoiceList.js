import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import R from 'ramda';
import { faEdit, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { v4 } from 'uuid'
import moment from 'moment'
import styled from 'styled-components'
import { accountChangedHandler, chainChangedHandler, connectWalletHandler } from '../../../hooks/useEthereum'

import {
    Table,
    Title,
    Box,
    Notification,
    Column,
    Columns,
    Button,
} from 'react-bulma-companion'

const InvoiceDateRange = styled.p`
    color: #2c71f0;
    font-size: 14px;
    font-weight: 600;
`

const InvoiceNumber = styled.p`
    font-size: 12px;
`

const Amount = styled.p`
    font-weight: bold;
    font-size: 14px;
`

const Status = styled.p`
    color: ${({ status }) => status === 'pending' ? '#f78400' : status === 'approved' ? '#00a700'  : '#7c8286'};
    text-transform: uppercase;
    font-size: 10px;
    font-weight: 600;
`

export default function InvoiceList() {
    const { invoices } = useSelector(R.pick(['invoices']));

    return (
        <Box>
            <Title>
                Invoices
            </Title>
            {invoices.map(invoice =>{
                return  (
                <Notification>
                    <Columns>
                        <Column>
                            <InvoiceDateRange>
                                For {moment(invoice.startDate).format('MMM Do')} - {moment(invoice.endDate).format('MMM Do')}
                            </InvoiceDateRange>
                            <InvoiceNumber>
                                {invoice.referenceNumber}
                            </InvoiceNumber>
                        </Column>
                        <Column narrow>
                            <Amount>
                                ${invoice.amount}
                            </Amount>
                            <Status status={invoice.status}>{invoice.status}</Status>
                        </Column>
                    </Columns>
                </Notification>    )
            })}
        </Box>
    )
}