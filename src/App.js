import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Invoices } from './features/invoice/Invoices';
import { Invoice } from './features/invoice/Invoice';
import './App.css';
import { Header } from './components/Header';

function App() {
  return (
    <Router>
      <Header>Invoice App</Header>
      {/* <Link to="/">Invoices</Link> */}
      <Switch>
        <Route 
          path={[ '/create', '/:id']} 
          render={(props) => 
            <Invoice key={props.match.params.id} />
          } 
        />
        <Route path="/">
          <Invoices />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
