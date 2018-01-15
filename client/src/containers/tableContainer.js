import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions/actions'
import { withRouter } from 'react-router-dom'
import '../index.css'

class tableContainer extends Component {

    componentDidMount() {
        let { getCryptos } = this.props.actions

        getCryptos(0, 100)
    }

    renderTables() {
        let { cryptocurrencies } = this.props.cryptoReducer

        if (cryptocurrencies) {       
            return (
                <div className="table-responsive-sm">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className='table-header-border' scope="col">#</th>
                                <th className='table-header-border' scope="col">Name</th>
                                <th className='table-header-border' scope="col">Price</th>
                                <th className='table-header-border' scope="col">Change</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            cryptocurrencies.map((cryptocurrency, i) => {
                                let { symbol, price_usd, percent_change_24h } = cryptocurrency
                                percent_change_24h = percent_change_24h === null ? '?' : percent_change_24h
                                let percentString = percent_change_24h === '?' ? `${percent_change_24h}` : `${percent_change_24h}%`
                                return (
                                    <tr key={i}>
                                        <th scope="row">{i + 1}</th>
                                        <td>{symbol}</td>
                                        <td>{`$${price_usd}`}</td>
                                        <td className={`${percent_change_24h[0] === '-' ? 'negative' : 'positive'}`}>
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(tableContainer))