import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions/actions'
import { Link, withRouter } from 'react-router-dom'
import NavContainer from './navContainer'
import SecondaryNav from './secondaryNav'
import TableContainer from './tableContainer'
import icons from '../icons/icons'
var $ = window.jQuery

class dashboardContainer extends Component {
    componentDidMount() {
        let { getUsers, getCryptos } = this.props.actions
        let { localStorage } = window
        let currentUser = JSON.parse(localStorage.user).username

        if (!window.localStorage.user) {
            this.props.history.push('/')
        }

        let used = []

        let holdings = 0

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
        $(`#modal-${i}`).modal('show')
    }

    renderTrendingIcon(c, i, category) {
        let { cryptocurrencies } = this.props.cryptoReducer

        if (c) {
            let modalIndex = cryptocurrencies.findIndex(crypto => crypto.symbol === c[i].symbol)
            let sym = c[i].symbol.toLowerCase()
            let svg = `${sym}.svg`
            let list = icons.icons

            let percent = c[i].percent_change_1h === null ? '?' : c[i].percent_change_1h
            let percentString = percent === '?' ? `${percent}` : `% ${percent}`
            let faClass = category === 'Gainers' ? 'lightning' : 'arrow-down'
            let faIcon = category === 'Gainers' ? 'fa fa-bolt' : 'fas fa-arrow-down'

            for (let x = 0; x < list.length; x++) {
                let svgInList = list[x]
                if (svg === svgInList) {
                    let svgSource = require(`../icons/svg/${sym}.svg`)
                    let classNameTrending = i === 0 ? 'trending-icon m-left-0' : 'trending-icon'
                    return (
                        <div className='jumbo-card' onClick={() => this.rowClicked(c[i], modalIndex)}>

                            <div className='jumbotron jumbo-trending align-center'>
                                <img className={classNameTrending} src={svgSource}/>
                                <div className={faClass}>
                                    <i className={faIcon}></i>
                                </div>
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
                        <i className='fas fa-6x fa-question-circle trending-icon'></i>
                        <div className={faClass}><i className={faIcon}></i></div>
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

    renderTrending(category) {
        let { cryptocurrencies } = this.props.cryptoReducer
        let { localStorage } = window
        let sorted = []

        if (cryptocurrencies) {

            let coins = cryptocurrencies.slice()

            let trending = coins.sort((a, b) => {
                let keyA = Number(a.percent_change_1h)
                let keyB = Number(b.percent_change_1h)
                if(keyA < keyB) return -1
                if(keyA > keyB) return 1
                return 0
            }).reverse()

            return (
                    <div>
                        <h3 className='trending-header'> {category} </h3>
                        {[0].map((c, i) => {

                            if (i === 1) {
                                return
                            }

                            if (category === 'Gainers') {
                                i = 0
                            } 

                            if (category === 'Losers') {
                                i = 96
                            }

                            return (
                                <div className='row' key={i}>
                                    <div className='col odd'>
                                        {trending ? this.renderTrendingIcon(trending, i, category) : ''}
                                    </div>
                                    <div className='col even'>
                                        {trending ? this.renderTrendingIcon(trending, i+1, category) : ''}
                                    </div>
                                    <div className='col odd'>
                                        {trending ? this.renderTrendingIcon(trending, i+2, category) : ''}
                                    </div>
                                    <div className='col even'>
                                        {trending ? this.renderTrendingIcon(trending, i+3, category) : ''}
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
        let holdings = 0
        let { users } = this.props.userReducer
        let { cryptocurrencies: cryps } = this.props.cryptoReducer
        let { localStorage } = window
        if (users) {
            let currentUserIndex = users.findIndex(user => user.username === JSON.parse(localStorage.user).username)
            let currentUser = users[currentUserIndex]
            if (currentUser) {
               console.log(currentUser) 
               if (currentUser.cryptocurrencies) {
                    currentUser.cryptocurrencies.forEach((c, i) => {
                        let priceUsd
                        if (cryps) {                  
                            cryps.forEach((cr, i) => {
                                if (c.symbol === cr.symbol) {
                                    priceUsd = cr.price_usd
                                }
                            })
                        }                       
                        holdings = holdings + (Number(c.holdings) * Number(priceUsd))         
                    })
               }
            }
        } 
        return ` ${parseFloat(Math.round(holdings * 100) / 100).toFixed(2)}` 
    }

    render() {
        let currentUser = JSON.parse(localStorage.user).username
        let { users } = this.props.userReducer

        return (
            <div className='container-dash'>
                <NavContainer/>
                <div className='margin-top'></div>

                <div className='container container-table'>
                    <div className='row'>
                        <div className='col-lg-6'>
                            <div className='container user-leftside'>
                                <Link to='/form'><i className="fa fa-8x fa-user-circle"></i></Link>
                            </div>
                        </div>
                        <div className='col-lg-6'>
                            <div className='container user-rightside'>
                                <h4 className='current-user'>{`@${currentUser}`}</h4>
                                <h2 className='total-holdings'>
                                    <i className='fa fa-md fa-dollar-sign'></i>
                                    {this.renderTotalHoldings()}
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        {<div className='col-md-1'></div>}
                        <div className='col-md-10'>
                            <hr className='hr-color'/> 
                            {this.renderTrending('Gainers')}
                            {this.renderTrending('Losers')}
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