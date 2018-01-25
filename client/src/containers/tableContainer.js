import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions/actions'
import { withRouter } from 'react-router-dom'
import icons from '../icons/icons'

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

    getHoldings(cryptocurrency) {
        let { users } = this.props.userReducer
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
        return <img className='icon-lg holder' src="http://via.placeholder.com/25.png/aaa?text=."/>
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

    renderJumbos() {
        let { cryptocurrencies } = this.props.cryptoReducer
        let width = window.innerWidth
        if (cryptocurrencies) {    
            return (
                <div>
                    {
                        cryptocurrencies.map((cryptocurrency, i) => {
                            let { name, symbol, price_usd, percent_change_24h } = cryptocurrency
                            let { innerWidth } = window
                            percent_change_24h = percent_change_24h === null ? '?' : percent_change_24h
                            let percentString = percent_change_24h === '?' ? `${percent_change_24h}` : `${percent_change_24h}%`
                            let colRank = innerWidth < 376 ? 'col-2 pad-0' : 'col-1 pad-0'
                            let colName = innerWidth < 376 ? 'col-3 pad-0' : 'col-4 pad-0'
                            let divName = innerWidth < 376 ? 'coin coin-name align-left' : 'coin coin-name align-left'
                            return (
                                    <div className="jumbotron jumbo-coin" onClick={() => this.rowClicked(cryptocurrency)} key={i}>
                                        <div className="container">
                                            <div className="row">
                                                <div className={colRank}>
                                                    <div className='align-left price-pad'>
                                                        <button type="button" className='btn btn-sm btn-table btn-rank align-left'>{i+1}</button>
                                                    </div>
                                                </div>
                                                <div className="col-2 pad-0">
                                                    <div className={innerWidth < 376 ? 'align-left' : 'align-center'}>
                                                        {this.renderIcon(symbol)}
                                                    </div>
                                                </div>
                                                <div className={colName}>
                                                    <div className='coin coin-name align-left'>
                                                        {width <= 770 ? symbol : name.toUpperCase()}
                                                    </div>
                                                </div>
                                                <div className="col-3 pad-0">
                                                    <div className='align-center price-pad'>
                                                        <button type="button" className='btn btn-sm btn-table btn-price align-right'>{`$${this.trimPrice(price_usd)}`}</button>
                                                    </div>
                                                </div>
                                                <div className={`col-2 pad-0 ${percent_change_24h[0] === '-' ? 'negative' : 'positive'}`}>
                                                    <div className='align-right percent-pad'>
                                                        <button type="button" className={`btn btn-sm btn-table btn-success align-right ${percent_change_24h[0] === '-' ? 'negz' : 'poz'}`}>{percentString}</button>
                                                    </div>
                                                </div>
                                            </div>
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
            <div>{this.renderJumbos()}</div>
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