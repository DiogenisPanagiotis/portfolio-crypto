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
        document.body.style.backgroundColor = '#fff'
    }

    componentWillUnmount() {
        document.body.style.backgroundColor = null
    }

    renderTopCoins() {
        let { users } = this.props.userReducer
        let { localStorage } = window
        let currentUser = JSON.parse(localStorage.user).username
        if (users) {
            return (
                <div>
                {users.map(user => {
                    if (user.username === currentUser) {
                        if (user.cryptocurrencies.length > 0) {
                            console.log('here')
                            return (
                                <div>
                                    {user.cryptocurrencies.map((c, i) => {
                                        if (i > 4) {
                                            return
                                        }
                                        let svg = c.symbol.toLowerCase()
                                        let svgSrc = require(`../icons/svg/${svg}.svg`)
                                        return (
                                        <div className='container topcoin-container'>
                                            <div className='row'>
                                                <div className='col-5'>
                                                    <img className='topcoin' src={svgSrc}/>
                                                </div>
                                                <div className='col-7'>
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
                <SecondaryNav/>

                <div className='container'>
                    <div className='row'>
                        <div className='col-xl-2'></div>
                        <div className='col-xl-6'>
                        <div className='margin-top'></div>
                            <TableContainer/>
                        </div>
                        <div className='col-xl-4'>
                            <div className='jumbotron user-side fixed'> 
                                <div className='align-center'><h6>{`@${currentUser}`}</h6></div>
                                <div className='align-center'><h6>{this.renderTotalHoldings()}</h6></div>
                                <hr className='topcoin-hr' />
                                {this.renderTopCoins()}
                            </div>
                        </div>
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