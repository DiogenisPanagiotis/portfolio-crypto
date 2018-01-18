import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions/actions'
import { withRouter } from 'react-router-dom'
import NavContainer from './navContainer'

class portfolioFormContainer extends Component {
    componentDidMount() {
        let { tableReducer } = this.props
        let { getUsers } = this.props.actions
        let { localStorage } = window
        if (!localStorage.user) {
            this.props.history.push('/')
        }
        getUsers()
    }

    getHoldings() {
        let { getUsers } = this.props.actions
        let { users } = this.props.userReducer
        let { localStorage } = window
        let currentUser = JSON.parse(localStorage.user).username
        let cryptoClicked = JSON.parse(localStorage.rowClicked).symbol
        let holdings = '0.00'
        if (users) {
            users.forEach(user => {
                if (user.username === currentUser) {
                    if (user.cryptocurrencies.length > 0) {
                        user.cryptocurrencies.forEach(crypto => {
                            if (crypto.symbol === cryptoClicked) {
                                holdings = crypto.holdings
                            }
                        })
                    }
                }
            })
        }
        return `${holdings} ${cryptoClicked}`
    }

    renderCardBody() {
        let { localStorage } = window
        let cryptocurrency = JSON.parse(localStorage.rowClicked)

        return (
            <div className="table-responsive-xs">
                <table className="table">
                  <tbody>
                    <tr className='hide-hover'>
                      <th className='table-top-border' scope="row">Holdings</th>
                      <td className='table-top-border text-align-right'>{this.getHoldings()}</td>
                    </tr>
                    <tr className='hide-hover'>
                      <th className='hide-top-border' scope="row">Price</th>
                      <td className='text-align-right hide-top-border'>{`$${JSON.parse(localStorage.rowClicked).price_usd}`}</td>
                    </tr>
                    <tr className='hide-hover'>
                      <th className='hide-top-border' scope="row">Change (1h)</th>
                      <td className='text-align-right hide-top-border'>{`${cryptocurrency.percent_change_1h}%`}</td>
                    </tr>
                    <tr className='hide-hover'>
                      <th className='hide-top-border' scope="row">Market Cap</th>
                      <td className='text-align-right hide-top-border'>{`$${ JSON.parse((cryptocurrency.market_cap_usd)).toLocaleString() }`}</td>
                    </tr>
                    <tr className='hide-hover'>
                      <th className='hide-top-border' scope="row">Supply</th>
                      <td className='text-align-right hide-top-border'>{`${JSON.parse((cryptocurrency.available_supply)).toLocaleString()} ${cryptocurrency.symbol}`}</td>
                    </tr>
                  </tbody>
                </table>
            </div>
        )
    }

    updateUser() {
        let { localStorage } = window
        let id = JSON.parse(localStorage.user)._id
        let rowClicked = JSON.parse(localStorage.rowClicked)
        let { tableReducer } = this.props
        let { updateUser, getUsers, toggleInvalidValue, handleCryptocurrencyValue } = this.props.actions
        if (tableReducer.cryptocurrencyValue.length === 0 || isNaN(Number(tableReducer.cryptocurrencyValue))) {
            toggleInvalidValue(true)
            return
        } else {
            console.log('dkfjsdk')
            updateUser({
                _id: id,
                name: rowClicked.name || tableReducer.cryptocurrency.name, 
                symbol: rowClicked.symbol || tableReducer.cryptocurrency.symbol,
                holdings: tableReducer.cryptocurrencyValue
            }).then(() => {
                getUsers().then(() => {
                    handleCryptocurrencyValue('')
                })
            })
        }
        toggleInvalidValue(false)
    }

    renderInput() {
        let { localStorage } = window
        let { handleCryptocurrencyValue } = this.props.actions
        let cryptocurrency = JSON.parse(localStorage.rowClicked)
        let { invalid, cryptocurrencyValue } = this.props.tableReducer
        return (
            <div id='crypto-input'>
                <div className="input-group mb-3">
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder={this.getHoldings()}
                        onChange = {({target}) => handleCryptocurrencyValue(target.value)}
                        value={cryptocurrencyValue}
                        />
                </div>
                <button id='submit-crypto' onClick={() => this.updateUser()} type="button" className="btn btn-primary btn-sm btn-block">Submit</button>
                { invalid ? <small id='invalid-crypto-value' className="form-text text-muted">Invalid value.</small> : ''}
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
                        <div className='col-xl-3'></div>
                        <div className='col-xl-6'>
                        <div id="holdingsForm" className="card card-form">
                            <div className="card-body card-body-form">
                            <div className='form-header-holdings'>YOUR HOLDINGS</div>
                            <div className='form-holdings'>{this.getHoldings()}</div>
                            <div className='form-rate'>{`@ $${cryptocurrency.price_usd} per ${cryptocurrency.symbol}`}</div>
                                <hr />
                                {this.renderCardBody()}
                                <hr />
                                {this.renderInput()}
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