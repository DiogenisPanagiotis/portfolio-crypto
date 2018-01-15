import React from 'react'
import NavContainer from './navContainer'

const errorContainer = () => {
	return (
		<div className='container-dash'>
			<NavContainer/> 
			<div className='container'>
				<div className='row'>
					<div className='col-lg-4'></div>
						<div className='col-lg-4'>
							<div className='jumbotron'>
								<h2 className='error404'>Oops, 404!</h2>
							</div>
						</div>
					<div className='col-lg-4'></div>
				</div>
			</div>
		</div>
	)
}

export default errorContainer