import React, { Component } from 'react';
import './App.css';

import {
  Button,
  Grid,
  Header,
  Message,
} from 'semantic-ui-react'

function Indicator(props) {
  if (props.loading) return "Loading Drizzle...";
  return <div className="App">Drizzle is ready</div>;
}

class App extends Component {
  state = { loading: true, drizzleState: null };

  componentDidMount() {
    const { drizzle } = this.props;
  
    // subscribe to changes in the store
    this.unsubscribe = drizzle.store.subscribe(() => {
  
      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();
  
      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        this.setState({ loading: false, drizzleState });
      }
    });
  }
  
  compomentWillUnmount() {
    this.unsubscribe();
  }

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
                <Indicator loading={this.state.loading}/>
                <Button color='blue'>Does nothing &raquo;</Button>
              </Message>
            </Grid.Column>
          </Grid.Row>

        </Grid>
      </div>
    );
  }
}

export default App;
