import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions/actions'
import { withRouter } from 'react-router-dom'
import NavContainer from './navContainer'
import SecondaryNav from './secondaryNav'
import TableContainer from './tableContainer'
import icons from '../icons/icons'
var $ = window.jQuery

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

    rowClicked(cryptocurrency, i) {
        let { handleRowClick } = this.props.actions
        let { localStorage } = window
        let userCookie = JSON.stringify(cryptocurrency)
        localStorage.setItem('rowClicked', userCookie)
        handleRowClick(cryptocurrency)
        // this.props.history.push('/form')
        $(`#modal-${i}`).modal('show')
    }

    renderTrendingIcon(c, i) {
        let { cryptocurrencies } = this.props.cryptoReducer

        if (c) {

            let modalIndex = cryptocurrencies.findIndex(crypto => crypto.symbol === c[i].symbol)
            let sym = c[i].symbol.toLowerCase()
            let svg = `${sym}.svg`
            let list = icons.icons

            let percent = c[i].percent_change_1h === null ? '?' : c[i].percent_change_1h
            let percentString = percent === '?' ? `${percent}` : `% ${percent}`

            for (let x = 0; x < list.length; x++) {
                let svgInList = list[x]
                if (svg === svgInList) {
                    let svgSource = require(`../icons/svg/${sym}.svg`)
                    let classNameTrending = i === 0 ? 'trending-icon m-left-0' : 'trending-icon'
                    return (
                        <div className='jumbo-card' onClick={() => this.rowClicked(c[i], modalIndex)}>

                            <div className='jumbotron jumbo-trending align-center'>
                                <img className={classNameTrending} src={svgSource}/>
                                <div className='lightning'><i className="fa fa-bolt"></i></div>
                            </div>

                            <div className='jumbotron jumbo-stats'>
                                <div className='row'>
                                    <div className='col pad-0'>
                                        <h6 className='card-name'>{c[i] ? `${c[i].name} (${c[i].symbol})` : ''}</h6>
                                        <div className='card-percent'>
                                            {percentString}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            }

            return (
                <div className='jumbo-card' onClick={() => this.rowClicked(c[i], modalIndex)}>
                    <div className='jumbotron jumbo-trending align-center'>
                        <img className='trending-icon holder' src="http://via.placeholder.com/25.png/aaa?text=."/>
                        <div className='lightning'><i className="fa fa-bolt"></i></div>
                    </div>
                    <div className='jumbotron jumbo-stats'>
                        <div className='row'>
                            <div className='col pad-0'>
                                <h6 className='card-name'>{c[i] ? `${c[i].symbol} (${c[i].symbol})` : ''}</h6>
                                <div className='card-percent'>
                                    {percentString}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
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
                        <h3 className='trending-header'> Trending </h3>
                        {[0].map((c, i) => {

                            if (i === 1) {
                                return
                            }

                            return (
                                <div className='row' key={i}>
                                    <div className='col odd'>
                                        {trending ? this.renderTrendingIcon(trending, i) : ''}
                                    </div>
                                    <div className='col even'>
                                        {trending ? this.renderTrendingIcon(trending, i+1) : ''}
                                    </div>
                                    <div className='col odd'>
                                        {trending ? this.renderTrendingIcon(trending, i+2) : ''}
                                    </div>
                                    <div className='col even'>
                                        {trending ? this.renderTrendingIcon(trending, i+3) : ''}
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
                                {this.renderTrending()}
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