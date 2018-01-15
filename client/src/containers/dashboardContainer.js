import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions/actions'
import { withRouter } from 'react-router-dom'
import NavContainer from './navContainer'
import TableContainer from './tableContainer'
import ErrorContainer from './errorContainer'
import '../index.css'

class dashboardContainer extends Component {
    componentDidMount() {
        if (!window.localStorage.user) {
            this.props.history.push('/')
        }
    }

    render() {
        return (
            <div className='container-dash'>
                <NavContainer/>
                <div className='container'>
                    <div className='row'>
                        <div className='col-xl-4'></div>
                        <div className='col-xl-4'>
                            <div id="currencyTable" className="jumbotron">
                                <h5 className='table-header'>Cryptocurrencies</h5>
                                <TableContainer/>
                            </div>
                        </div>
                        <div className='col-xl-4'></div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { userReducer, cryptoReducer } = state
    return { userReducer, cryptoReducer }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            ...actions
        }, dispatch)
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(dashboardContainer))