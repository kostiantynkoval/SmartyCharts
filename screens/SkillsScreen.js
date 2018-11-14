import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AsyncStorage
} from 'react-native';
import {connect} from 'react-redux'
import {getSkills} from "../store/actions/index";
import { StackedAreaChart, StackedBarChart, YAxis, Grid, XAxis } from 'react-native-svg-charts'
import {withAuth} from '../hoc/isAuthenticated'

function parseJwt (token) {
  const base64Url = token.split('.')[1];
  console.log('base64Url', base64Url);
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  console.log('base64', base64);
  return JSON.parse(window.atob(base64));
}

const getData = (data) => {
  const requiredData = data
    .filter(item => parseInt(item.mark) > 9 )
    .map((item, i) => ({
      title: item.skill.title,
      mark: item.mark - item.disposition,
      disposition: item.disposition,
    }))
  console.log('requiredData', requiredData)

  return requiredData
}

const colors = [ 'rgba(0,100,0,0.8)', 'rgba(139,0,0,0.8)' ]

const keys = [ 'mark', 'disposition' ]

const yAxisData = [0,1,2,3,4,5,6,7,8,9]

class SkillsScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    this.parsedUser = parseJwt(this.props.token)
    console.log('parsedUser', this.parsedUser);
    this.props.getSkills(this.parsedUser.id)
  }

  render() {
    if (this.props.isLoading) {
      return (
        <View><Text>Loading...</Text></View>
      )
    } else {
      const dataP = getData(this.props.skills)
      console.log('dataP', dataP)
      return (
        <View style={styles.container}>
          <YAxis
            data={ yAxisData }
            contentInset={{ top: 20, bottom: 20 }}
            svg={{
              fill: 'black',
              fontSize: 10,
            }}
            numberOfTicks={ 10 }
          />
          <View style={{ flex: 1 }}>
            <StackedBarChart
              style={ { flex: 1 } }
              keys={ keys }
              colors={ colors }
              data={ dataP }
              showGrid={ true }
              contentInset={{ top: 20, bottom: 20 }}
              spacingInner={0.4}
              spacingOuter={0.4}
            >
              <Grid/>
            </StackedBarChart>
            <XAxis
              data={ dataP }
              contentInset={{ top: 20, bottom: 20 }}
              formatLabel={ (value, index) => { console.log('value', index, value); return index} }
            />
          </View>
        </View>
      )
    }

  }
}

const styles = StyleSheet.create({
  container: {
    height: 400,
    flexDirection: 'row',
    padding: 20,
    ...Platform.select({
      ios: {
        backgroundColor: '#fff',
      },
      android: {
        backgroundColor: '#ccc',
      },
    }),
  },
});

export default withAuth(connect(
  store => ({
    skills: store.data.skills,
    token: store.auth.token,
    isLoading: store.data.isLoading,
  }),
  dispatch => ({
    getSkills: id => dispatch(getSkills(id))
  })
)(SkillsScreen))