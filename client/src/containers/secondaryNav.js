import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions/actions'
import { withRouter } from 'react-router-dom'

class secondaryNav extends Component {

    render() {
        return (
                <div className='fixed-secondary-nav'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-xl-3'></div>
                                <div className='col-xl-6'>
                                    <div className="jumbotron jumbo-secondary-coin">
                                        <div className="container">
                                            <div className="row">
                                                <div className="col-2 pad-0">
                                                    <div className='coin align-left s-nav-txt'>ICON</div>
                                                </div>
                                                <div className="col-4 pad-0">
                                                    <div className='coin align-left s-nav-txt'>NAME</div>
                                                </div>
                                                <div className="col-3 pad-0">
                                                    <div className='coin align-center s-nav-txt'>PRICE</div>
                                                </div>
                                                <div className="col-3 pad-0">
                                                    <div className='coin align-right s-nav-txt'>% CHANGE</div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            <div className='col-xl-3'></div>
                        </div>
                    </div>
                </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(secondaryNav))
