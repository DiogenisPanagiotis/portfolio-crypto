import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import registerServiceWorker from './registerServiceWorker'
import App from './containers/App'
import DashboardContainer from './containers/dashboardContainer'
import ErrorContainer from './containers/errorContainer'
import PortfolioFormContainer from './containers/portfolioFormContainer'
import './index.css'

render(
    <Provider store={store}>
        <BrowserRouter>
        	<Switch>
	            <Route exact path="/" component={App}/>
                <Route exact path="/dashboard" render={props => (
                    window.localStorage.user ? <DashboardContainer {...props} /> : <App/>
                )}/>
                <Route exact path="/form" render={props => (
                    window.localStorage.user ? <PortfolioFormContainer {...props}/> : <App/>
                )}/>
	            <Route component={ErrorContainer} />
        	</Switch>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
)

registerServiceWorker()
