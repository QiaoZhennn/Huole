import React from 'react';
import {Container} from 'semantic-ui-react'
import Header from './Header'
import Head from 'next/head';

export default props => {
  return (
    <Container>
      <Header/>
      {props.children}
    </Container>
  );
};