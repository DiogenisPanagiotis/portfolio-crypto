import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions/actions'
import { Link, withRouter } from 'react-router-dom'
import arrow from '../icons/left-arrow.svg'

class navContainer extends Component {

    logout() {
        // let { appReducer } = this.props
        let { toggleSignedup } = this.props.actions
        toggleSignedup(true)
        localStorage.removeItem('user')
        localStorage.removeItem('rowClicked')
        this.props.history.push('/')
    }

    renderUserLink() {
        let { user } = window.localStorage
        return (
            <div className="dropdown">
              <button className="btn no-glow dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {JSON.parse(user).username}
              </button>
              <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                { user ? <Link to='/' onClick={() => this.logout()}> <span className="nav-link">Logout</span></Link> : null}
              </div>
            </div>
        )
    }

    renderToggler() {
        return (
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav">
                <span className="navbar-toggler-icon"></span>
            </button>
        )
    }

    renderBackBtn() {
        if (window.location.pathname === '/form') {
            return (
                <Link to='/dashboard'>
                    <button type="button" className="btn btn-primary btn-arrow">
                        <img alt='arrow' className='arrow' src={arrow}/>
                    </button>
                </Link>
            )
        }
    }

    renderBrand() {
        if (window.location.pathname === '/form') {
            return
        }
        return <a id="Cryptofolio" className="navbar-brand mx-auto" href="/">Cryptofolio</a>
    }

    render() {
        let { user } = window.localStorage
        let issuesUrl = 'https://github.com/DiogenisPanagiotis/portfolio-crypto/issues'
        return (
            <nav className="navbar fixed-top navbar-light">
                {this.renderBrand()}
                {this.renderBackBtn()}
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item active">
                        <a className="nav-link" href="#"><span className="sr-only">(current)</span></a>
                    </li>
                </ul>
                {user ? this.renderToggler() : null}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item active">
                            <div className="j" aria-labelledby="dropdownMenuButton">
                                <div className="dropdown-header">{user ? `@${JSON.parse(user).username}` : ''}</div>
                                <Link to='/'> <span className="nav-link">Home</span></Link>
                                <a href={issuesUrl}><span className="nav-link">Issues</span></a>
                                { user ? <Link to='/' onClick={() => this.logout()}> <span className="nav-link">Logout</span></Link> : null}
                            </div>
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
