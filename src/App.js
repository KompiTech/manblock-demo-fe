import React from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Get from './Get'
import Send from './Send'
import Home from './Home'

import 'antd/dist/antd.css'
import './App.css'
import Config from './Config'

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/send" component={Send} />
                <Route path="/get" component={Get} />
                <Route path="/config" component={Config} />
                <Route path="*" component={Home} />
            </Switch>
        </Router>
    )
}

export default App
