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
        let { innerWidth } = window
        let colRank = innerWidth < 376 ? 'col-2 pad-rank' : 'col-1 pad-rank'
        let colName = innerWidth < 376 ? 'col-3 pad-0' : 'col-4 pad-0'
        let iconClass = innerWidth < 376 ? 'coin align-left s-nav-txt' : 'coin align-center s-nav-txt'
        return (
                <div className='fixed-secondary-nav'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-xl-2'></div>
                                <div className='col-xl-6'>
                                    <div className="jumbotron jumbo-secondary-coin">
                                        <div className="container">
                                            <div className="row">
                                                <div className={colRank}>
                                                    <div className='coin align-left s-nav-txt'>#</div>
                                                </div>
                                                <div className="col-2 pad-0">
                                                    <div className={iconClass}>ICON</div>
                                                </div>
                                                <div className={colName}>
                                                    <div className='coin align-left s-nav-txt'>NAME</div>
                                                </div>
                                                <div className="col-3 pad-0">
                                                    <div className='coin align-center s-nav-txt'>PRICE</div>
                                                </div>
                                                <div className="col-2 pad-0">
                                                    { innerWidth < 379 ?
                                                        <div className='coin align-right s-nav-txt'>% 24h</div>
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
