import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions/actions'
import { withRouter } from 'react-router-dom'
import NavContainer from './navContainer'
import SecondaryNav from './secondaryNav'
import TableContainer from './tableContainer'

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
                <SecondaryNav/>

                <div className='container'>
                    <div className='row'>
                        <div className='col-xl-3'></div>
                        <div className='col-xl-6'>
                        <div className='margin-top'></div>
                            <TableContainer/>
                        </div>
                        <div className='col-xl-3'></div>
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