import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import R from 'ramda';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Icon from 'react-bulma-companion/lib/Icon';
import Box from 'react-bulma-companion/lib/Box';
import Field from 'react-bulma-companion/lib/Field';
import Label from 'react-bulma-companion/lib/Label';
import Control from 'react-bulma-companion/lib/Control';
import Input from 'react-bulma-companion/lib/Input';
import Columns from 'react-bulma-companion/lib/Columns';
import Column from 'react-bulma-companion/lib/Column';
import Title from 'react-bulma-companion/lib/Title';
import Textarea from 'react-bulma-companion/lib/Textarea';
import Button from 'react-bulma-companion/lib/Button';
import Help from 'react-bulma-companion/lib/Help';
import styled from 'styled-components'

import { attemptAddInvoice } from '_thunks/invoices';

import * as Yup from 'yup'
import { Formik } from 'formik'

const SubmitButton = styled(Button)`
    background-color: #2c71f0;;
`;

const SubmitText = styled.p`
    color: #ffffff;
    font-weight: 600;
`;

const CreateInvoiceSchema = Yup.object().shape({
    hourlyRate: Yup.number().required('Required').typeError('Must be a number'),
    numberOfHours: Yup.number().required('Required').typeError('Must be a number'),
    description: Yup.string(),
    startDate: Yup.date().default(() => new Date()),
    endDate: Yup.date().when(
        "startDate",
        (startDate, schema) => startDate && schema.min(startDate)
    ).typeError('Must later than start date'),
})

const invoiceFields = [
    {
        name: 'hourlyRate',
        label: 'Hourly Rate',
        placeholder: 'Rate'
    },
    {
        name: 'numberOfHours',
        label: 'Number of Hours',
        placeholder: 'Hours'
    }
]

const dateFields = [
    {
        name: 'startDate',
        label: 'Start Date',
    },
    {
        name: 'endDate',
        label: 'End Date',
    },
]

export default function CreateInvoice() {
    const dispatch = useDispatch();
    const { user } = useSelector(R.pick(['user']));

    return (
        <Formik
            validateOnMount={false}
            initialValues={{
                numberOfHours: undefined,
                description: '',
                hourlyRate: undefined,
                startDate: null,
                endDate: null,
            }}
            onSubmit={(values) => {
                dispatch(attemptAddInvoice({
                    ...values,
                    amount: Number(values.hourlyRate * values.numberOfHours),
                    user: user.id
                }))
                .catch(R.identity);
            }}
            validationSchema={CreateInvoiceSchema}
        >
        {formikProps => {
            const {
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
            } = formikProps
            return (
                <Box>
                    <Title size="3">
                        Create Invoice
                    </Title>
                    <Columns>
                    {invoiceFields.map((field, index) =>
                        <Column size="6" key={`createInvoice.field.${index}`}>
                            <Field>
                                <Label htmlFor="first-name" className="Label">
                                    {field.label}
                                </Label>
                                <Control iconsRight>
                                <Input
                                    placeholder={field.placeholder}
                                    name={field.name}
                                    value={values[`${field.name}`]}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                />
                                {touched[`${field.name}`] && errors[`${field.name}`] && (
                                    <Icon
                                        size="small"
                                        align="right"
                                        color={'danger'}
                                    >
                                    <FontAwesomeIcon
                                        icon={faExclamationTriangle}
                                    />
                                    </Icon>
                                )}
                                </Control>
                                {touched[`${field.name}`] && errors[`${field.name}`] && (
                                    <Help color={'danger'}>
                                        {errors[`${field.name}`]}
                                    </Help>
                                )}
                            </Field>
                        </Column>
                    )}
                    </Columns>
                    <Columns>
                        {dateFields.map((field, index) =>
                            <Column size="6">
                                <Field>
                                    <Label htmlFor="first-name" className="Label">
                                        {field.label}
                                    </Label>
                                    <Control iconsRight>
                                    <Input
                                        type="date"
                                        name={field.name}
                                        value={values[`${field.name}`]}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                    {touched[`${field.name}`] && errors[`${field.name}`] && (
                                        <Icon
                                            size="small"
                                            align="right"
                                            color={'danger'}
                                        >
                                        <FontAwesomeIcon
                                            icon={faExclamationTriangle}
                                        />
                                        </Icon>
                                    )}
                                    </Control>
                                    {touched[`${field.name}`] && errors[`${field.name}`] && (
                                        <Help color={'danger'}>
                                            {errors[`${field.name}`]}
                                        </Help>
                                    )}
                                </Field>
                            </Column>
                        )}
                    </Columns>
                    <Field>
                        <Label htmlFor="profile-pic-url">
                        Description
                        </Label>
                        <Control>
                        <Textarea
                            placeholder="Describe the invoice here..."
                            name='description'
                            value={values.description}
                            onBlur={handleBlur}
                            onChange={handleChange}
                        />
                        </Control>
                    </Field>
                    <hr className="separator" />
                    <SubmitButton onClick={handleSubmit} color="#ffffff" fullwidth size="medium">
                        <SubmitText>
                            Submit
                        </SubmitText>
                    </SubmitButton>
                </Box>
            )
        }}
        </Formik>
    )
}