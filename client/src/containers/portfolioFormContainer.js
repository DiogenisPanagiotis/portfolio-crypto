import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions/actions'
import { Link, withRouter } from 'react-router-dom'
import NavContainer from './navContainer'
import icons from '../icons/icons'
var $ = window.jQuery

class portfolioFormContainer extends Component {
    componentDidMount() {
        let { getUsers, getCryptos } = this.props.actions
        let { localStorage } = window
        if (!localStorage.user) {
            this.props.history.push('/')
        }
        getUsers().then(getCryptos())
    }

    getHoldings() {
        let { users } = this.props.userReducer
        let { localStorage } = window
        let currentUser = JSON.parse(localStorage.user).username
        let holdings = '0.00'
        if (Object.keys(localStorage).includes('rowClicked')) {    
            let cryptoClicked = JSON.parse(localStorage.rowClicked).symbol
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

    renderModal(c, i) {
        if (c) {
            let percent = c[i].percent_change_24h === null ? '?' : c[i].percent_change_24h
            let percentString = percent === '?' ? `${percent}` : ` ${percent}`
            let marketCap = this.abbreviateNumber(Number(c[i].market_cap_usd))
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
                                                <h4 className='modal-title'> {`${c[i].name} (${c[i].symbol})`} </h4>
                                                <h4 className='modal-holdings'>{`${this.getHoldings()}`}</h4>
                                            </div>
                                            <div className='jumbotron jumbo-modal-icon'>
                                                {this.renderIconModal(c[i].symbol)}
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
                                                {this.renderInput()}
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
    }

    renderInput(c, i) {
        let { localStorage } = window
        let { handleCryptocurrencyValue } = this.props.actions
        let { invalid, cryptocurrencyValue } = this.props.tableReducer

        return (
            <div id='crypto-input' className='container pad-0'>
                    <h5 className='input-header'> Your Holdings </h5>
                    <div className="input-group mb-3">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder={this.getHoldings()}
                            onChange = {({target}) => handleCryptocurrencyValue(target.value)}
                            value={cryptocurrencyValue}
                            />
                    </div>

                    <button 
                        onClick={() => this.updateUser()}
                        type="button" 
                        className="btn btn-primary btn-md btn-block">
                        Submit
                    </button>
                    { invalid ? <small id='invalid-crypto-value' className="form-text text-muted">Invalid value.</small> : ''}

            </div>     
        )
    }

    renderIcon(symbol) {
        let sym = symbol.toLowerCase()
        let svg = `${sym}.svg`
        let list = icons.icons

        for (let i = 0; i < list.length; i++) {
            let svgInList = list[i]
            if (svg === svgInList) {

                let svgSource = require(`../icons/svg/${sym}.svg`)

                return <img className='icon-lg' src={svgSource}/>
            }
        }
        return <img className='icon-lg holder' src={`http://via.placeholder.com/200x200.png/aaa?text=.`}/>
    }

    rowClicked(cryptocurrency, i) {
        let { handleRowClick } = this.props.actions
        let { localStorage } = window
        let userCookie = JSON.stringify(cryptocurrency)
        localStorage.setItem('rowClicked', userCookie)
        handleRowClick(cryptocurrency)
        $(`#modal-${i}`).modal('show')
    }

    renderUserJumbos(c, i) {
        let { cryptocurrencies } = this.props.cryptoReducer

        if (c) {     
            console.log('yooo', c)

            if (cryptocurrencies) {
                let currentCryptoIndex = cryptocurrencies.findIndex(cr => c.symbol === cr.symbol)
                let crypto = cryptocurrencies[currentCryptoIndex]
                let percent = crypto.percent_change_24h === null ? '?' : crypto.percent_change_24h
                let percentString = percent === '?' ? `${percent}` : `% ${percent}`
                let h = Number(c.holdings) * crypto.price_usd
                return (
                    <div>
                        <div className='jumbotron jumbo-holdings align-center' onClick={() => this.rowClicked(c, currentCryptoIndex)}>
                            {this.renderIcon(c.symbol)}
                        </div>
                        <div className='jumbotron jumbo-stats'>
                            <div className='row'>
                                <div className='col-6 pad-0'>
                                    <h6 className='card-name'>{`${c.name} (${c.symbol})`}</h6>
                                    <div className='card-price'>
                                        {`$ ${parseFloat(Math.round(crypto.price_usd * 100) / 100).toFixed(2)}`}
                                    </div>
                                    <div className='card-percent'>
                                        {percentString}
                                    </div>
                                </div>
                                <div className='col-6 pad-0'>
                                    <h6 className='card-name align-right'>{`${c.holdings} ${c.symbol}`}</h6>
                                    <h6 className='card-name align-right'>{`$ ${parseFloat(Math.round(h * 100) / 100).toFixed(2)}`}</h6>
                                </div>
                            </div>
                        </div>
                        <div>{this.renderModal(cryptocurrencies, currentCryptoIndex)}</div>
                    </div>
                )
            }
        }
    }

    renderIconModal(symbol) {
        let sym = symbol.toLowerCase()
        let svg = `${sym}.svg`
        let list = icons.icons

        for (let i = 0; i < list.length; i++) {
            let svgInList = list[i]
            if (svg === svgInList) {

                let svgSource = require(`../icons/svg/${sym}.svg`)

                return <img className='icon-modal' src={svgSource}/>
            }
        }
        return <img className='icon-modal holder' src="http://via.placeholder.com/25.png/aaa?text=."/>
    }

    abbreviateNumber(value) {

        let suffixes = ["", "K", "M", "B","T"];
        let suffixNum = Math.floor((""+value).length/3);
        let shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000,suffixNum)) : value).toPrecision(2));
        if (shortValue % 1 != 0) {
            var shortNum = shortValue.toFixed(1)
        }
        return shortValue + suffixes[suffixNum]

    }

    renderUserCryptos() {
        let { users } = this.props.userReducer
        if (users) {
            let currentUserIndex = users.findIndex(user => user.username === JSON.parse(localStorage.user).username)
            let currentUser = users[currentUserIndex]
            if (currentUser) {
               if (currentUser.cryptocurrencies.length > 0) {
                    return (
                        <div>
                        {
                            currentUser.cryptocurrencies.map((c, i) => {
                                return (
                                    <div key={i}>
                                    {this.renderUserJumbos(c, i)}
                                    </div>
                                )
                            })
                        }
                        <div className='margin-top'></div>
                        </div>
                    )       
               }
            }
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
                            console.log('ddd', cryps)                     
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
        let { tableReducer } = this.props
        let { localStorage } = window
        // let cryptocurrency = JSON.parse(localStorage.rowClicked)
        let currentUser = JSON.parse(localStorage.user).username

        return (
            <div className='container'>
            <NavContainer/>
                <div className="margin-top"></div>
                <div className='row'>
                    <div className='col-lg-6'>
                        <div className='container user-leftside'>
                            <Link to='/dashboard'><i className="fa fa-8x fa-user-circle"></i></Link>
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
                    <div className='col-lg-3'></div>
                    <div className='col-lg-6 pad-left-24 pad-right-24'>
                    <hr className='hr-holdings pad-left-24 pad-right-24'/> 
                    {this.renderUserCryptos()}
                    </div>
                    <div className='col-lg-3'></div>
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