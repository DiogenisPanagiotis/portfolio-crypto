import React from 'react'
import NavContainer from './navContainer'
import { Link } from 'react-router-dom'

const errorContainer = () => {
	return (
		<div className='container-dash'>
			<NavContainer/> 
			<div className='container err-container'>
				<div className='row'>
					<div className='col-lg-4'></div>
						<div className='col-lg-4'>
							<div className='jumbotron'>
								<h1 className='error404'>Oops, 404!</h1>
                                <h6 className='card-subtitle mb-2 text-muted'>
                                    Are you lost? <Link to='/'>Follow me.</Link>
                                </h6>
							</div>
						</div>
					<div className='col-lg-4'></div>
				</div>
			</div>
		</div>
	)
}

export default errorContainer