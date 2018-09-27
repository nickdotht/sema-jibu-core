/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import RNLanguages from 'react-native-languages';
import i18n from './i18n';
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { Provider } from 'react-redux';
import store from './store';
import JibuApp from '../components/JibuApp';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {
  componentWillMount() {
    RNLanguages.addEventListener('change', this._onLanguagesChange);
  }

  componentWillUnmount() {
    RNLanguages.removeEventListener('change', this._onLanguagesChange);
  }

  _onLanguagesChange = ({ language }) => {
    i18n.locale = language;
  };
  
  render() {
      return (
    <Provider store={store}>
            <JibuApp/>
    </Provider>
      );
  }
}

