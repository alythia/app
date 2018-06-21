import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {Input, Button, Icon} from 'react-materialize'
import {auth} from '../store'

const AuthForm = props => {
  const {name, displayName, handleSubmit, error} = props

  return (
    <div className="container row white z-depth-2 form-container">
      <form onSubmit={handleSubmit} name={name}>
        <center className="row">
          <h4 className="teal-text">{displayName}</h4>
          <div className="col s12">
            <Input type="email" name="email" htmlFor="email" label="Email" />
          </div>
          <div className="col s12">
            <Input
              type="password"
              name="password"
              htmlFor="password"
              label="Password"
            />
          </div>
        </center>
        <center>
          <Button id="login" type="submit">
            <Icon left>email</Icon>
            {displayName} with Email
          </Button>
          {error && error.response && <div> {error.response.data} </div>}
          <a href="/auth/google">
            <div className="btn_google center">
              <img src="/img/btn_google.svg" />
              <p>{displayName} with Google</p>
            </div>
          </a>
        </center>
      </form>
    </div>
  )
}

const mapLogin = state => {
  return {
    name: 'login',
    displayName: 'Log In',
    error: state.developer.error
  }
}

const mapSignup = state => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.developer.error
  }
}

const mapDispatch = dispatch => {
  return {
    handleSubmit(evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value
      const password = evt.target.password.value
      dispatch(auth(email, password, formName))
    }
  }
}

export const Login = connect(mapLogin, mapDispatch)(AuthForm)
export const Signup = connect(mapSignup, mapDispatch)(AuthForm)

AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}
