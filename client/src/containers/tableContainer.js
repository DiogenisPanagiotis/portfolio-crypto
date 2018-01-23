import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions/actions'
import { withRouter } from 'react-router-dom'
import icons from '../icons/icons'

class tableContainer extends Component {

    componentDidMount() {
        let { getUsers } = this.props.actions
        let { getCryptos } = this.props.actions
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
        return <div id='circle'></div>
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
                            percent_change_24h = percent_change_24h === null ? '?' : percent_change_24h
                            let percentString = percent_change_24h === '?' ? `${percent_change_24h}` : `${percent_change_24h}%`
                            return (
                                    <div className="jumbotron jumbo-coin" onClick={() => this.rowClicked(cryptocurrency)} key={i}>
                                        <div className="container">
                                            <div className="row">
                                                <div className="col-2 pad-0">
                                                    <div className='vertical-align'>
                                                        {this.renderIcon(symbol)}
                                                    </div>
                                                </div>
                                                <div className="col-4 pad-0">
                                                    <div className='coin coin-name align-left'>{width <= 770 ? symbol : name.toUpperCase()}</div>
                                                </div>
                                                <div className="col-3 pad-0">
                                                    <div className='coin align-center'>{`$${this.trimPrice(price_usd)}`}</div>
                                                </div>
                                                <div className={`col-3 pad-0 ${percent_change_24h[0] === '-' ? 'negative' : 'positive'}`}>
                                                    <div className='coin align-right'>{ percentString }</div>
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

    renderTables() {
        let { cryptocurrencies } = this.props.cryptoReducer

        if (cryptocurrencies) {       
            return (
                <div className="table-responsive-xs">
                    <table className="table table-fixed">
                        <thead>
                            <tr>
                                <th className='table-header-border' scope="col">#</th>
                                <th className='table-header-border' scope="col">ICON</th>
                                <th className='table-header-border hide-holdings' scope="col">NAME</th>
                                <th className='table-header-border' scope="col">PRICE</th>
                                <th className='table-header-border hide-holdings' scope="col">HOLDINGS</th>
                                <th className='table-header-border percent' scope="col">CHANGE</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            cryptocurrencies.map((cryptocurrency, i) => {
                                let { name, symbol, price_usd, percent_change_24h } = cryptocurrency
                                percent_change_24h = percent_change_24h === null ? '?' : percent_change_24h
                                let percentString = percent_change_24h === '?' ? `${percent_change_24h}` : `${percent_change_24h}%`
                                return (
                                    <tr onClick={() => this.rowClicked(cryptocurrency)} key={i}>
                                        <th scope="row">{i + 1}</th>
                                        <td>{this.renderIcon(symbol)}</td>
                                        <td className='hide-holdings'>{name}</td>
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