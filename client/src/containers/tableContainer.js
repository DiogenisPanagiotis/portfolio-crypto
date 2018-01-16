import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions/actions'
import { withRouter } from 'react-router-dom'

class tableContainer extends Component {

    componentDidMount() {
        let { getCryptos } = this.props.actions
        getCryptos(0, 100)
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