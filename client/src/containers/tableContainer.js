import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions/actions'
import { withRouter } from 'react-router-dom'

class tableContainer extends Component {

    componentDidMount() {
        let { getUsers } = this.props.actions
        let { getCryptos } = this.props.actions
        getCryptos(0, 100).then(() => {
            getUsers()
        })
    }

    getHoldings(cryptocurrency) {
        let { getUsers } = this.props.actions
        let { users } = this.props.userReducer
        let { cryptocurrencies } = this.props.cryptoReducer
        let { localStorage } = window
        let currentUser = JSON.parse(localStorage.user).username
        let holdings = '0.00'
        if (users) {
            users.forEach(user => {
                if (user.username === currentUser) {
                    if (user.cryptocurrencies.length > 0) {
                        user.cryptocurrencies.forEach((crypto, i) => {
                            if (crypto.symbol === cryptocurrency.symbol) {
                                holdings = crypto.holdings
                            }
                        })
                    }
                }
            })
        }
        return `${holdings} ${cryptocurrency.symbol}`
    }

    rowClicked(cryptocurrency) {
        let { handleRowClick } = this.props.actions
        let { localStorage } = window
        let userCookie = JSON.stringify(cryptocurrency)
        localStorage.setItem('rowClicked', userCookie)
        handleRowClick(cryptocurrency)
        this.props.history.push('/form')
    }

    renderTables() {
        let { cryptocurrencies } = this.props.cryptoReducer

        if (cryptocurrencies) {       
            return (
                <div className="table-responsive-xs">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className='table-header-border' scope="col">#</th>
                                <th className='table-header-border' scope="col">Name</th>
                                <th className='table-header-border' scope="col">Price</th>
                                <th className='table-header-border hide-holdings' scope="col">Holdings</th>
                                <th className='table-header-border percent' scope="col">Change</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            cryptocurrencies.map((cryptocurrency, i) => {
                                let { symbol, price_usd, percent_change_24h } = cryptocurrency
                                percent_change_24h = percent_change_24h === null ? '?' : percent_change_24h
                                let percentString = percent_change_24h === '?' ? `${percent_change_24h}` : `${percent_change_24h}%`
                                return (
                                    <tr onClick={() => this.rowClicked(cryptocurrency)} key={i}>
                                        <th scope="row">{i + 1}</th>
                                        <td>{symbol}</td>
                                        <td className='price-usd'>{`$${price_usd}`}</td>
                                        <td className='hide-holdings'>{this.getHoldings(cryptocurrency)}</td>
                                        <td className={`percent ${percent_change_24h[0] === '-' ? 'negative' : 'positive'}`}>
                                            { percentString }
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </div>
            ) 
        } else {
            return this.renderFetching()
        }
    }

    renderFetching = () => {
        return (
            <div className="card">
              <div className="card-body">
                <p className="card-text">Fetching...</p>
              </div>
            </div>
        )
    }

    render() {
        return (
            <div>{this.renderTables()}</div>
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(tableContainer))