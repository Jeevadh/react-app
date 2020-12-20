import React from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import List from "./components/list-post";
import Add from './components/add-post';
import Edit from './components/edit-post';

export default function AppRouter() {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={List} />
                <Route path="/add-post" component={Add} />
                <Route path="/edit-post/:id" component={Edit} />
            </Switch>
        </Router>
    )
}