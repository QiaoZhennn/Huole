import React, { Component } from 'react';
import './App.css';
import { DrizzleContext } from "drizzle-react";
import Posts from './Posts';

import {
  Grid,
  Header
} from 'semantic-ui-react'

import PostList from './components/PostList';
import Faucet from './Faucet';

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
                <DrizzleContext.Consumer>
                  {drizzleContext => {
                    const { drizzle, drizzleState, initialized } = drizzleContext;
                    if (!initialized) {
                      return "Loading...";
                    } else {
                      return (
                        <div>
                          <PostList drizzle={drizzle} drizzleState={drizzleState}/>
                          <Posts drizzle={drizzle} drizzleState={drizzleState} />
                          <Faucet drizzle={drizzle} drizzleState={drizzleState} />
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
