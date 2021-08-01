import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Memo from "./pages/Memo";
import { GlobalStyle } from "./styles";

function App() {
    return (
        <BrowserRouter>
            <GlobalStyle />
            <Switch>
                <Route exact path="/" component={Memo} />
                <Redirect to="/" />
            </Switch>
        </BrowserRouter>
    );
}

export default App;
