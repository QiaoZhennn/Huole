import React, { Component } from 'react';
import './App.css';

import { DrizzleContext } from "drizzle-react";
import Posts from './Posts';

import {
  Button,
  Grid,
  Header,
  Message,
} from 'semantic-ui-react'


class App extends Component {
  state = { loading: true, drizzleState: null };

  render() {
    return (
      <div className="App">
        <Grid container style={{ padding: '5em 0em' }}>

          <Grid.Row>
            <Grid.Column>
              <Header as='h1' dividing>
                Welcome to HuoLe.
              </Header>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Message>
                <Header as='h1'>It's working!</Header>          
                <Button color='blue'>Does nothing &raquo;</Button>
              </Message>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
                <DrizzleContext.Consumer>
                  {drizzleContext => {
                    const { drizzle, drizzleState, initialized } = drizzleContext;
                    if (!initialized) {
                      return "Loading...";
                    } else {
                      return (
                        <div>
                          <div> drizzle loadied.</div>
                          <Posts drizzle={drizzle} drizzleState={drizzleState} />
                        </div>
                      );
                    }
                  }}
                </DrizzleContext.Consumer>           
            </Grid.Column>
          </Grid.Row>

        </Grid>
      </div>
    );
  }
}

export default App;
