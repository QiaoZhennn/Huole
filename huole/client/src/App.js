import React, { Component } from 'react';
import './App.css';

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
        <header className="App-header">
          <p>
            Welcome to HuoLe. It's working.
          </p>
          <Indicator loading={this.state.loading}/>
        </header>
      </div>
    );
  }
}

export default App;
