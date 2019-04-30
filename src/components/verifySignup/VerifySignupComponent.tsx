// - Import react components
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Map} from 'immutable'
import { push } from 'connected-react-router'
import { NavLink, withRouter } from 'react-router-dom'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import RaisedButton from '@material-ui/core/Button'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import config from 'src/config'

import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import { translate, Trans } from 'react-i18next'

// - Components

// - Import actions
import * as authorizeActions from 'src/store/actions/authorizeActions'
import * as globalActions from 'src/store/actions/globalActions'

// - Import app API
import StringAPI from 'src/api/StringAPI'

import { UserRegisterModel } from 'src/models/users/userRegisterModel'
import CircularProgress from '@material-ui/core/CircularProgress'
import { ServerRequestStatusType } from 'src/store/actions/serverRequestStatusType'
import { ServerRequestType } from 'src/constants/serverRequestType'
import { verifySignupStyles } from './verifySignupStyles'
import RecaptchaComponent from 'src/components/recaptcha'
import { IVerifySignupProps } from './IVerifySignupProps'
import { IVerifySignupState } from './IVerifySignupState'

// - Create Verify Signup component class
export class VerifySignupComponent extends Component<IVerifySignupProps, IVerifySignupState> {

  /**
   * Component constructor
   *
   */
  constructor(props: IVerifySignupProps) {
    super(props)

    this.state = {
      code: '',
      codeError: ''
    }
    // Binding function to `this`
    this.handleForm = this.handleForm.bind(this)

  }

  /**
   * Handle data on input change
   * @param  {event} evt is an event of inputs of element on change
   */
  handleInputChange = (event: any) => {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    this.setState({
      [name]: value
    })

    switch (name) {
      case 'code':
        this.setState({
          codeError: ''
        })
        break
      default:

    }
  }


  /**
   * Handle register form
   */
  handleForm = () => {

    const { code, codeError } = this.state
    const { verify, t } = this.props
    if (code && code.trim() === '') {
    
      this.setState({
        codeError: t!('signup.codeRequiredError')
      })
    }
    else if (code.length !== 4 && t) {
      this.setState({
        codeError: t('signup.codeNumberOfDigitsError')
      })
    } else {
      
      verify!(code)
    }


  }

  /**
   * Reneder component DOM
   * 
   */
  render() {

    const { classes, t,  signupRequest } = this.props
    const {code} = this.state
    const signupRequestId = StringAPI.createServerRequestId(ServerRequestType.AuthSignup, code)
    const signupRequestStatus = signupRequest!.get(signupRequestId, { status: ServerRequestStatusType.NoAction }).status
    const loading = signupRequestStatus === ServerRequestStatusType.Sent
    return (
      <div className={classes.root}>
        <TextField
          className={classes.textField}
          autoFocus
          color='secondary' 
          disabled={loading}         
          onChange={this.handleInputChange}
          helperText={this.state.codeError}
          error={this.state.codeError.trim() !== ''}
          name='code'
          label={t!('signup.codeLabel')}
          type='text'
        /><br />
       
       <div style={{height: 30}} />

        <br />
        <div className={classes.signupButtonRoot}>
        <div className={classes.wrapperButton}>
              <Button
                variant='contained'
                className={classes.signupButton}
                color='secondary'
                disabled={loading}
                onClick={this.handleForm}
                fullWidth
                tabIndex={3}
              >
                {t!('signup.verifyButton')}
              </Button>
              {loading && <CircularProgress size={24} className={classes.buttonProgress} />}

            </div>
        </div>
        <Typography className={classes.caption} variant='caption' component='p'>
          {t!('signup.termCaption')} <NavLink to='/terms'> {t!('signup.termCaptionLink')} </NavLink>
        </Typography>
        <Divider />
          <div >
            <span className={classes.bottomPaper}>{t!('login.loginText')} <NavLink to='/login' className={classes.link}>{t!('login.loginButton')}</NavLink></span>
          </div>

      </div>

    )
  }
}

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any, ownProps: IVerifySignupProps) => {
  return {
    showError: (message: string) => {
      dispatch(globalActions.showMessage(message))
    },
    verify: (code: string,) => {
      dispatch(authorizeActions.asyncVerifyUserRegisterCode(code))
    },
    loginPage: () => {
      dispatch(push('/login'))
    }
  }
}

/**
 * Map state to props
 */
const mapStateToProps = (state: Map<string, any>, ownProps: IVerifySignupProps) => {
  const signupRequest = state.getIn(['server', 'request'], Map({}))
  return {
    signupRequest
  }
}

// - Connect component to redux store
const translateWrraper = translate('translations')(VerifySignupComponent as any)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(verifySignupStyles as any)(translateWrraper as any) as any) as any)