import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions/actions'
import { withRouter } from 'react-router-dom'
import NavContainer from './navContainer'

class portfolioFormContainer extends Component {
    componentDidMount() {
        let { tableReducer } = this.props
        let { localStorage } = window
        if (!localStorage.user) {
            this.props.history.push('/')
        }
    }

    renderCardBody() {
        let { localStorage } = window
        let cryptocurrency = JSON.parse(localStorage.rowClicked)

        return (
            <div className="table-responsive-xs">
                <table className="table">
                  <tbody>
                    <tr>
                      <th className='table-top-border' scope="row">Price</th>
                      <td className='table-top-border'>{`$${JSON.parse(localStorage.rowClicked).price_usd}`}</td>
                    </tr>
                    <tr>
                      <th scope="row">Change (1h)</th>
                      <td>{`${cryptocurrency.percent_change_1h}%`}</td>
                    </tr>
                    <tr>
                      <th scope="row">Market Cap</th>
                      <td>{`$${ JSON.parse((cryptocurrency.market_cap_usd)).toLocaleString() }`}</td>
                    </tr>
                    <tr>
                      <th scope="row">Supply</th>
                      <td>{`${JSON.parse((cryptocurrency.available_supply)).toLocaleString()} ${cryptocurrency.symbol}`}</td>
                    </tr>
                  </tbody>
                </table>
            </div>
        )
    }

    renderInput() {
        let { localStorage } = window
        let cryptocurrency = JSON.parse(localStorage.rowClicked)
        return (
            <div id='crypto-input' className='container'>
                <div className='row'>
                    <div className='col-xl-4'></div>
                    <div className='col-xl-4'>
                    <div className="card card-form">
                        <div className="card-body card-body-form">
                            <div className='col-xs'>
                                <div className="input-group mb-3">
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder={cryptocurrency.symbol}
                                        />
                                </div>
                            </div>
                            <div className='col-xs'>
                                <div className="input-group mb-3">
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder='USD'
                                        />
                                </div>
                            </div>
                            <button type="button" className="btn btn-primary btn-sm btn-block">Submit</button>
                        </div>

                    </div>
                    </div>
                    <div className='col-xl-4'></div>
                </div>
            </div>     
        )
    }

    render() {
        let { tableReducer } = this.props
        let { localStorage } = window
        let cryptocurrency = JSON.parse(localStorage.rowClicked)
        return (
            <div className='container-dash'>
                <NavContainer/>
                <div className='container'>
                <div className='row'>
                    <div className='col-xl-4'></div>
                    <div className='col-xl-4'>
                    <div id="currencyTable" className='card card-form'>
                        <div className='card-body card-body-form card-form-crypto-name'>
                        { `${cryptocurrency.name} (${cryptocurrency.symbol})`}
                        </div>
                    </div>
                    </div>
                    <div className='col-xl-4'></div>
                </div>
                </div>
                <div className='container'>
                    <div className='row'>
                        <div className='col-xl-4'></div>
                        <div className='col-xl-4'>
                        <div className="card card-form">
                            <div className="card-body card-body-form">
                                {this.renderCardBody()}
                            </div>
                        </div>
                        </div>
                        <div className='col-xl-4'></div>
                    </div>
                </div>
                {this.renderInput()}
            </div>
        )
    }
}

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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(portfolioFormContainer))