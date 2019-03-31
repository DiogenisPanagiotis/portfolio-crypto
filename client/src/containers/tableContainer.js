import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions/actions'
import { withRouter } from 'react-router-dom'
import icons from '../icons/icons'
import * as service from '../services'
var $ = window.jQuery

class tableContainer extends Component {

    componentDidMount() {
        let { getUsers, getCryptos } = this.props.actions
        let currentUser = JSON.parse(localStorage.user).username
        window.addEventListener('resize', this.resize)
        getCryptos(0, 100).then(() => {
            getUsers()
        })
    }

    resize = () => this.forceUpdate()

    componentWillUnmount() {
      window.removeEventListener('resize', this.resize)
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

    rowClicked(cryptocurrency, i) {
        let { handleRowClick } = this.props.actions
        let { localStorage } = window
        let userCookie = JSON.stringify(cryptocurrency)
        localStorage.setItem('rowClicked', userCookie)
        handleRowClick(cryptocurrency)
        // this.props.history.push('/form')
        $(`#modal-${i}`).modal('show')
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

        let colorClass = service.randomColor();
        let classNames = `fas fa-7x fa-question-circle trending-icon' ${colorClass}`

        return <i className={classNames}></i>
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

        let colorClass = service.randomColor();
        let classNames = `fas fa-7x fa-question-circle trending-icon' ${colorClass}`

        return <i className={classNames}></i>
    }

    trimPrice(price) {
        if (price.indexOf('.') !== -1) {
            let p = price.split('.')
            let left = p[0]
            let right = p[1].slice(0, 5)
            return `${left}.${right}`
        }
        return price
    }

    renderCard(c, i) {
        if (c) {

            let percent = c[i].percent_change_24h === null ? '?' : c[i].percent_change_24h
            let percentString = percent === '?' ? `${percent}` : `% ${percent}`

            return (
                <div>
                <div className='jumbo-card' onClick={() => this.rowClicked(c[i], i)}>

                    <div className='jumbotron jumbo-crypto align-center'>
                        {this.renderIcon(c[i].symbol)}
                    </div>

                    <div className='jumbotron jumbo-stats'>
                        <div className='row'>
                            <div className='col pad-0'>
                                <h6 className='card-name'>{`${c[i].name} (${c[i].symbol})`}</h6>
                                <div className='card-price'>
                                    {`$ ${parseFloat(Math.round(c[i].price_usd * 100) / 100).toFixed(2)}`}
                                </div>
                                <div className='card-percent'>
                                    {percentString}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                    {this.renderModal(c, i)}
                </div>
            )
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

    abbreviateNumber(value) {

        let suffixes = ["", "K", "M", "B","T"];
        let suffixNum = Math.floor((""+value).length/3);
        let shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000,suffixNum)) : value).toPrecision(2));
        if (shortValue % 1 != 0) {
            var shortNum = shortValue.toFixed(1)
        }
        return shortValue + suffixes[suffixNum]

    }

    renderModal(c, i) {
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

    renderCoins() {
        let { cryptocurrencies } = this.props.cryptoReducer
        let width = window.innerWidth
        if (cryptocurrencies) {    
            return (
                <div>
                    <h3 className='trending-header'> Cryptocurrencies </h3>
                    {
                        cryptocurrencies.map((c, i) => {
                            if (i !== 0) {
                                i = i * 4
                            }

                            if (i > 96) {
                                return
                            }

                            let { name, symbol, price_usd, percent_change_24h } = c
                            let { innerWidth } = window
                            percent_change_24h = percent_change_24h === null ? '?' : percent_change_24h
                            let percentString = percent_change_24h === '?' ? `${percent_change_24h}` : `${percent_change_24h}%`

                            return (
                                    <div className='row' key={i}>
                                        <div className='col odd'>
                                            {this.renderCard(cryptocurrencies, i)}
                                        </div> 
                                        <div className='col even'>
                                            {this.renderCard(cryptocurrencies, i+1)}
                                        </div> 
                                        <div className='col odd'>
                                            {this.renderCard(cryptocurrencies, i+2)}
                                        </div> 
                                        <div className='col even'>
                                            {this.renderCard(cryptocurrencies, i+3)}
                                        </div> 
                                    </div> 
                            )
                        })
                    }

                </div>
            )
        }
    }

    render() {
        return (
            <div>
                {this.renderCoins()}
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(tableContainer))