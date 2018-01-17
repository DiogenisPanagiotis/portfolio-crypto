const UserModel = require('../models/UserModel.js')

module.exports = {
    getUsers: (req, res) => {
        UserModel.find((err, models) => {
            err ? res.status(500).send(err) : res.status(200).json(models);
        })
    },
    addUser: (req, res) => {
        let model = new UserModel()
        model.email = req.body.email
        model.username = req.body.username
        model.password = req.body.password
        model.save(err => {
            err ? res.status(500).send(err) : res.status(200).json({message: 'User Created!'})
        })
    },
    updateUser: (req, res) => {
        UserModel.findById(req.params.id, (err, model) => {
                console.log(req.body)
            if (err) {
                res.status(500).send(err)
            } else {

                let crypto = {
                    name: req.body.name,
                    symbol: req.body.symbol,
                    holdings: req.body.holdings
                }

                // let found = false

                // model.cryptocurrencies.forEach((cryptocurrency, i) => {     
                //     if (cryptocurrency.name === req.body.name) {
                //         console.log('before ', model.cryptocurrencies[i] )
                //         cryptocurrency.holdings = req.body.holdings
                //         // model.cryptocurrencies[i] = crypto
                //         console.log('after', model.cryptocurrencies[i] )
                //     }
                //     found = true
                // })

                // if (!found) {
                    console.log('adding crypto!')
                    model.cryptocurrencies.push(crypto)
                // }

                model.save(error => {
                    error ? res.status(500).send(error) : res.status(204).json({message: 'Model Updated!'})
                });
            }
        })
    },

}