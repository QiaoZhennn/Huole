import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import 'semantic-ui-css/semantic.min.css';

// import drizzle functions and contract artifact
import { Drizzle, generateStore } from "drizzle";
import { DrizzleContext } from "drizzle-react";
import {BrowserRouter, Route, Link, Switch} from 'react-router-dom';

import HuoLe from "./contracts/HuoLe.json";

import Layout from './components/Layout';
import NewPost from "./components/NewPost";
import Faucet from './components/Faucet';

const drizzleOptions = {
  contracts: [
    HuoLe
  ]
}

const drizzleStore = generateStore(drizzleOptions);
const drizzle = new Drizzle(drizzleOptions, drizzleStore);

// pass in the drizzle instance
ReactDOM.render(
  (
    <DrizzleContext.Provider drizzle={drizzle}>

      <BrowserRouter>
      <Layout>
        <Switch>
          <Route path='/' exact component={App}/>
          <Route path='/newpost' exact component={NewPost}/>
          <Route path='/faucet' exact component={Faucet}/>
        </Switch>
      </Layout>
      </BrowserRouter>
    </DrizzleContext.Provider>
  ),
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
