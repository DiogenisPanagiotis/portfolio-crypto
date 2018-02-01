import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions/actions'
import { withRouter } from 'react-router-dom'

const modal = (c, i, getHoldings, renderIconModal, renderInput, percentString, marketCap) => {
    return (
        <div className="modal" id={`modal-${i}`} tabIndex="-1" role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col">
                                    <h4 className='modal-title'></h4>
                                </div>
                                <div className="col">
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                <div className="modal-body">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-1"></div>
                            <div className="col-lg-10">
                                <div className='align-center'>
                                    <div className="col pad-0">
                                        <h4 className='modal-title'> {`${c[i]} (${c[i]})`} </h4>
                                        <h4 className='modal-holdings'>{`${getHoldings()}`}</h4>
                                    </div>
                                    <div className='jumbotron jumbo-modal-icon'>
                                        {renderIconModal(c[i].symbol)}
                                    </div>
                                <div className='jumbotron jumbo-modal-stats'>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">
                                            <div className='row'>
                                                <div className='col'>
                                                    <div className='align-left'>
                                                        <span className='align-left'>Rank</span>
                                                    </div>
                                                </div>
                                                <div className='col'>
                                                    <div className='align-right'>
                                                        <span className='align-right'>{`#${i + 1}`}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="list-group-item">
                                            <div className='row'>
                                                <div className='col'>
                                                    <div className='align-left'>
                                                        <span className='align-left'>Price</span>
                                                    </div>
                                                </div>
                                                <div className='col'>
                                                    <div className='align-right'>
                                                        <span className='align-right'>{`$${parseFloat(Math.round(c[i].price_usd * 100) / 100).toFixed(2)}`}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="list-group-item">
                                            <div className='row'>
                                                <div className='col'>
                                                    <div className='align-left'>
                                                        <span className='align-left'>% Change 24h</span>
                                                    </div>
                                                </div>
                                                <div className='col'>
                                                    <div className='align-right'>
                                                        <span className='align-right'>{`${percentString}%`}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="list-group-item">
                                            <div className='row'>
                                                <div className='col'>
                                                    <div className='align-left'>
                                                        <span className='align-left'>Market Cap</span>
                                                    </div>
                                                </div>
                                                <div className='col'>
                                                    <div className='align-right'>
                                                        <span className='align-right'>{marketCap}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                    <div className=''>
                                        {renderInput()}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-1"></div>
                        </div>
                    </div>
                </div>
            <div className='modal-footer'></div>
            </div>
          </div>
        </div>
    )
}

// export default modal

function mapStateToProps(state) {
    const { userReducer, cryptoReducer, tableReducer } = state
    return { userReducer, cryptoReducer, tableReducer }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            ...actions
        }, dispatch)
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(modal))






