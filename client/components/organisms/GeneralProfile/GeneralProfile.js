import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import R from 'ramda';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons/faUpload';

import Box from 'react-bulma-companion/lib/Box';
import Icon from 'react-bulma-companion/lib/Icon';
import Title from 'react-bulma-companion/lib/Title';
import Columns from 'react-bulma-companion/lib/Columns';
import Column from 'react-bulma-companion/lib/Column';
import Image from 'react-bulma-companion/lib/Image';
import Field from 'react-bulma-companion/lib/Field';
import Control from 'react-bulma-companion/lib/Control';
import Label from 'react-bulma-companion/lib/Label';
import Input from 'react-bulma-companion/lib/Input';
import File from 'react-bulma-companion/lib/File';

import { attemptUpdateUser } from '_thunks/user';
import * as Yup from 'yup'
import { Formik } from 'formik'

const SubmitButton = styled.button`
  border: none;
  background-color: #2c71f0;
  color: #ffffff;
  font-weight: 500;
  font-size: 16px;
  width: 100%;
  border-radius: 8px;
  padding: 10px 10px;
  cursor: pointer;
`;

const GeneralProfileSchema = Yup.object().shape({
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  profilePic: Yup.object(),
  walletAddress: Yup.string(),
  email: Yup.string().email('Invalid Email'),
})

export default function GeneralProfile() {
  const dispatch = useDispatch();
  const { user } = useSelector(R.pick(['user']));

  return (
    <Formik
      validateOnMount={false}
      initialValues={{
          firstName: user.firstName,
          lastName: user.lastName,
          profilePic: user.profilePic,
          walletAddress: user.walletAddress,
          email: user.email,
          fileName: ''
      }}
      onSubmit={(values) => {
        dispatch(attemptUpdateUser(values))
      }}
      validationSchema={GeneralProfileSchema}    
    >
      {formikProps => {
        const {
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          setFieldValue,
          errors,
        } = formikProps;

        console.log(errors, values)
        const onFileChange = (event) => {
          const file = event.target.files[0]
          const reader = new FileReader()
          
          reader.onload = (e) => {
            setFieldValue('profilePic', file)
            setFieldValue('fileName', file.name)
          }
        }
        return (
          <Box className="general-profile"> 
          <Title size="3">
            General
          </Title>
          <hr className="separator" />
          <Columns>
            <Column>
              <Columns>
                <Column size="6">
                  <Field>
                    <Label htmlFor="first-name" className="Label">
                      First Name
                    </Label>
                    <Control>
                      <Input
                        id="first-name"
                        placeholder="First Name"
                        name="firstName"
                        value={values.firstName}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </Control>
                  </Field>
                </Column>
                <Column size="6">
                  <Field>
                    <Label htmlFor="last-name">
                      Last Name
                    </Label>
                    <Control>
                      <Input
                        id="last-name"
                        placeholder="Last Name"
                        name="lastName"
                        value={values.lastName}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </Control>
                  </Field>
                </Column>
              </Columns>
              <Field>
                <Label htmlFor="email">
                  Email
                </Label>
                <Control>
                  <Input
                    id="email-address"
                    placeholder="Enter your email address"
                    value={values.email}
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Control>
              </Field>
              <Field>
                <Label htmlFor="walletAddress">
                  Wallet Address
                </Label>
                <Control>
                  <Input
                    id="wallet-address"
                    placeholder="Enter your wallet address"
                    value={values.walletAddress}
                    name="walletAddress"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Control>
              </Field>
            </Column>
          </Columns>
          <hr className="separator" />
          <SubmitButton onClick={handleSubmit}>
            Save
          </SubmitButton>
        </Box>
        )
      }}
    </Formik>
  );
}
