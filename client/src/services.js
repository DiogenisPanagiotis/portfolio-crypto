import axios from 'axios'

export const getUsers = () => axios.get('/api/users')

export const addUser = user => axios.post('/api/users', user)

export const redirectToDashboard = (localStorage, props) => {
	if (localStorage.user) {
		props.history.push('/dashboard')
	}
}

export const getCryptos = (start, limit) => axios.get(`https://api.coinmarketcap.com/v1/ticker/?start=${start}&limit=${limit}`)

export const updateUser = userModel => axios.put(`/api/users/${userModel._id}`, userModel)

export const randomColor = function() {
    var colorClass = ['maverick', 'fusion', 'reptile', 'purp', 'sun'];
    var randomNum = Math.floor(Math.random() * Math.floor(5));
    return colorClass[randomNum];
}