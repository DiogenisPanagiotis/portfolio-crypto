import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions/actions'
import { withRouter } from 'react-router-dom'

class secondaryNav extends Component {

    componentDidMount() {
        window.addEventListener('resize', this.resize)
    }

    resize = () => this.forceUpdate()

    componentWillUnmount() {
      window.removeEventListener('resize', this.resize)
    }

    render() {
        let width = window.innerWidth
        return (
                <div className='fixed-secondary-nav'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-xl-2'></div>
                                <div className='col-xl-6'>
                                    <div className="jumbotron jumbo-secondary-coin">
                                        <div className="container">
                                            <div className="row">
                                                <div className="col-1 pad-0">
                                                    <div className='coin align-left s-nav-txt'>#</div>
                                                </div>
                                                <div className="col-2 pad-0">
                                                    <div className='coin align-left s-nav-txt'>ICON</div>
                                                </div>
                                                <div className="col-4 pad-0">
                                                    <div className='coin align-left s-nav-txt'>NAME</div>
                                                </div>
                                                <div className="col-3 pad-0">
                                                    <div className='coin align-center s-nav-txt'>PRICE</div>
                                                </div>
                                                <div className="col-2 pad-0">
                                                    { width < 379 ?
                                                        <div className='coin align-right s-nav-txt'>%</div>
                                                        :
                                                        <div className='coin align-right s-nav-txt'>% CHANGE</div>
                                                    }
                                                </div>
                                            </div>

                                        </div>
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
