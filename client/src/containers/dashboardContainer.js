import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions/actions'
import { withRouter } from 'react-router-dom'
import NavContainer from './navContainer'
import SecondaryNav from './secondaryNav'
import TableContainer from './tableContainer'
import icons from '../icons/icons'

class dashboardContainer extends Component {
    componentDidMount() {
        let { getUsers, getCryptos } = this.props.actions
        if (!window.localStorage.user) {
            this.props.history.push('/')
        }
        getCryptos(0, 100).then(() => {
            getUsers()
        })
    }

    componentWillMount() {
        document.body.style.backgroundColor = '#fafafa'
    }

    componentWillUnmount() {
        document.body.style.backgroundColor = null
    }

    renderTrending() {
        let { cryptocurrencies } = this.props.cryptoReducer
        let { localStorage } = window
        let sorted = []
        if (cryptocurrencies) {

            let coins = cryptocurrencies.slice()

            let trending = coins.sort((a, b) => {
                let keyA = a.percent_change_1h
                let keyB = b.percent_change_1h
                if(keyA < keyB) return -1
                if(keyA > keyB) return 1
                return 0
            }).reverse()

            return (
                    <div>
                        {trending.map((c, i) => {
                            if (i > 4) {
                                return
                            }
                            return (
                            <div className='container container-fluid' key={i}>
                                <div className='row'>
                                    <div className='col pad-0'>
                                        <div className='trending-name align-center'>{c.name.toUpperCase()}</div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col pad-0'>
                                        <div className='stat'>
                                            <button 
                                                type="button" 
                                                className='btn btn-sm btn-table btn-success align-center poz'
                                                >
                                                {`${c.percent_change_1h} %`}
                                                </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            )
                        })}
                    </div>
            )
        } 
    }

    renderTopCoins() {
        let { users } = this.props.userReducer
        let { localStorage } = window
        let currentUser = JSON.parse(localStorage.user).username
        if (users) {
            return (
                <div>
                {users.map((user, x) => {
                    if (user.username === currentUser) {
                        if (user.cryptocurrencies.length > 0) {
                            console.log('here')
                            return (
                                <div key={x}>
                                    {user.cryptocurrencies.map((c, i) => {
                                        if (i > 4) {
                                            return
                                        }
                                        let svg = c.symbol.toLowerCase()
                                        let svgSrc = require(`../icons/svg/${svg}.svg`)
                                        return (
                                        <div className='container container-fluid topcoin-container' key={i}>
                                            <div className='row'>
                                                <div className='col-5 pad-0'>
                                                    <img className='topcoin' src={svgSrc}/>
                                                </div>
                                                <div className='col-7 pad-0'>
                                                    <div className='row'>
                                                        <div className='col'>
                                                            <div className='topcoin-sym'>{c.name.toUpperCase()}</div>
                                                            <div className='topcoin-holdings'>{`(${c.holdings} ${c.symbol})`}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        )
                                    })}
                                </div>
                            )
                        }
                    }
                })}
                </div>
            )
        } 
    }

    renderTotalHoldings() {
        let { getCryptos } = this.props.actions
        let { users } = this.props.userReducer
        let { localStorage } = window
        let currentUser = JSON.parse(localStorage.user).username
        let holdings = 0
        let used = []

        let { cryptocurrencies } = this.props.cryptoReducer

        if (users) {
            users.forEach(user => {
                if (user.username === currentUser) {
                    if (user.cryptocurrencies.length > 0) {
                        user.cryptocurrencies.forEach((crypto, i) => {
                            if (!used.includes(crypto.symbol)) {
                                let priceUsd
                                if (cryptocurrencies) {                      
                                    cryptocurrencies.forEach((c, i) => {
                                        if (c.symbol === crypto.symbol) {
                                            priceUsd = c.price_usd
                                        }
                                    })
                                    holdings += Number(crypto.holdings) * Number(priceUsd)
                                    used.push(crypto.symbol)
                                }
                            }
                        })
                    }
                }
            })
        }

        return `$${parseFloat(Math.round(holdings * 100) / 100).toFixed(2)}`       
    }

    render() {
        let currentUser = JSON.parse(localStorage.user).username
        let { users } = this.props.userReducer

        return (
            <div className='container-dash'>
                <NavContainer/>
                <div className='container container-table'>
                    <div className='row'>
                        {<div className='col-md-1'></div>}
                        <div className='col-md-10'>
                            <div className='margin-top'></div>
                                <TableContainer/>
                            </div>
                        {<div className='col-md-1'></div>}
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