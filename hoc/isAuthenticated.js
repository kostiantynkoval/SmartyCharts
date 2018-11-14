import React, { Component } from 'react'
import { connect } from 'react-redux'

export function withAuth(WrappedComponent) {
  class AuthHandler extends Component {

    static navigationOptions = {
      header: null,
    };

    constructor(props) {
      console.log('props', props)
      super(props)
      if(!props.isAuthenticated) {
        props.navigation.navigate('SignIn')
      }
    }

    componentDidMount() {

    }

    render() {
      return <WrappedComponent {...this.props}/>
    }
  }

  return connect(state => ({isAuthenticated: state.auth.isAuthenticated}))(AuthHandler)
}