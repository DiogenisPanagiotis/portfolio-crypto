import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions/actions'
import { Link, withRouter } from 'react-router-dom'

class secondaryNav extends Component {

    render() {
        return (

                <div id='secondary-container' className="container">
                    <div className='row'>
                        <div className='col-xl-3'></div>
                        <div className='col-xl-6'>
                        <div id='sec-jumbo' className="jumbotron">
                            <div className="table-responsive-xs">
                                <table className="table">
                                    <thead>
                                        <tr className='hide-hover'>
                                            <th className='sec-nav-border table-header-border' scope="col">#</th>
                                            <th className='sec-nav-border table-header-border' scope="col">Name</th>
                                            <th className='sec-nav-border table-header-border' scope="col">Price</th>
                                            <th className='sec-nav-border table-header-border hide-holdings' scope="col">Holdings</th>
                                            <th className='sec-nav-border table-header-border percent' scope="col">Change</th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                        </div>
                        </div>
                        <div className='col-xl-3'></div>
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
