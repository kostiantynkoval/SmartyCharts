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
import * as shape from 'd3-shape'
import { StackedAreaChart, StackedBarChart, YAxis, Grid } from 'react-native-svg-charts'
import {withAuth} from '../hoc/isAuthenticated'

const colors = [ '#33691E', '#689F38' ]
const data = [
  {
      desirable: {
        value: 3840,
        svg: {
          onPress: () => console.log('onPress => 0:broccoli:3840'),
        },
      },
      present: {
        value: 1920,
        svg: {
          onPress: () => console.log('onPress => 0:celery:1920'),
        },
      },
  },
  {
      desirable: {
        value: 2840,
        svg: {
          onPress: () => console.log('onPress => 1:broccoli:2840'),
        },
      },
      present: {
        value: 2220,
        svg: {
          onPress: () => console.log('onPress => 1:celery:2220'),
        },
      },
  },
]

const keys = [ 'desirable', 'present' ]

class SkillsScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props)
    AsyncStorage.clear()
  }

  componentDidMount() {
    this.props.getSkills()
  }

  render() {
    return (
      <StackedBarChart
        style={{ height: 600 }}
        colors={ colors }
        contentInset={{ top: 50, bottom: 50 }}
        data={ data }
        keys={ keys }
        valueAccessor={ ({ item, key }) => item[ key ].value }
      >
        <Grid />
      </StackedBarChart>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    skills: store.data.skills
  }),
  dispatch => ({
    getSkills: () => dispatch(getSkills())
  })
)(SkillsScreen))