import React, {Component} from 'react';
import './App.css';
import {BrowserRouter, Route} from 'react-router-dom';


import Layout from './components/Layout';
import NewPost from "./components/NewPost";


import PostList from './components/PostList';
import Faucet from './components/Faucet';

class App extends Component {
  state = {loading: true, drizzleState: null};

  componentDidMount() {
    const {drizzle} = this.props;
    this.unsubscribe = drizzle.store.subscribe(() => {
      const drizzleState = drizzle.store.getState();
      if (drizzleState.drizzleStatus.initialized) {
        this.setState({loading: false, drizzleState});
      }
    })
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    if (this.state.loading) return "Loading Drizzle..."
    return (
      <BrowserRouter>
      <Layout>
        <div className="App">
          <Route
            path='/' exact
            render={() => <PostList drizzle={this.props.drizzle} drizzleState={this.state.drizzleState}/>}
          />
          <Route
            path='/newpost'
            render={() => <NewPost drizzle={this.props.drizzle} drizzleState={this.state.drizzleState}/>}
          />
          <Route
            path='/faucet'
            render={() => <Faucet drizzle={this.props.drizzle} drizzleState={this.state.drizzleState}/>}
          />
        </div>
      </Layout>
      </BrowserRouter>
    );
  }
}

export default App;
