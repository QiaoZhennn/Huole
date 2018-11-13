import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import 'semantic-ui-css/semantic.min.css';

import {Drizzle, generateStore} from "drizzle";

import HuoLe from "./contracts/HuoLe.json";
import Lottery from "./contracts/Lottery.json";

const drizzleOptions = {
  contracts: [
    HuoLe,
    Lottery
  ]
};

const drizzleStore = generateStore(drizzleOptions);
const drizzle = new Drizzle(drizzleOptions, drizzleStore);

ReactDOM.render(
  (
      <App drizzle={drizzle}/>
  ),
  document.getElementById('root')
);

serviceWorker.unregister();
