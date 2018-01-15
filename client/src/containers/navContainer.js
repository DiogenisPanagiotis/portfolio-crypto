import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions/actions'
import { Link, withRouter } from 'react-router-dom'
import '../index.css'

class navContainer extends Component {

    logout() {
        localStorage.removeItem('user')
        this.props.history.push('/')
    }

    renderToggler() {
        return (
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav">
                <span className="navbar-toggler-icon"></span>
            </button>
        )
    }
    render() {
        let { user } = window.localStorage
        return (
            <nav className="navbar navbar-expand-lg navbar-light">
              <a id="Cryptofolio" className="navbar-brand mx-auto " href="/">Cryptofolio</a>
              {user ? this.renderToggler() : null}
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item active">
                  { user ? <Link to='/' onClick={() => this.logout()}> <span className="nav-link">Logout</span></Link> : null}
                  </li>
                </ul>
              </div>
            </nav>
    	)
  	}
}

function mapStateToProps(state) {
    const { userReducer } = state
    return { userReducer }
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            ...actions
        }, dispatch)
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(navContainer))
