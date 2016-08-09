/**
 * Created by zhirui on 8/3/16.
 */

import React, {Component} from 'react';
import {Animated, ScrollView, View, Text, StyleSheet, Dimensions, Easing} from 'react-native';

import AnimatedWrapper from './AnimatedWrapper';

let {width, height} = Dimensions.get('window');
export default class StaggeredScrollview extends Component {

  constructor(props) {
    super(props);

    this.state = {
      scrollOffset: 0,
      fadeAnim: new Animated.Value(0),
      time: 750,
      rowHeight: 200,
      screenSpace: height,
      animatedValues: [],
      visibleAnimations: [],
      alreadyAnimated: 0
    }

    this.state.visibleAnimations.push(
      Animated.timing(
      this.state.fadeAnim,
      {
        fromValue: 0,
        toValue: 1,
        duration: 1000,
        easing: Easing.easeIn,
        delay: 3000
      })
    );

    this.handleScroll = this.handleScroll.bind(this);
  }

  handleScroll(event) {
    console.log(event.nativeEvent);
    this.setState({
      scrollOffset: event.nativeEvent.contentOffset.y,
      rowHeight: event.nativeEvent.contentSize.height/this.props.children.length
    });

    while (((this.state.alreadyAnimated - 1) * this.state.rowHeight) <= (this.state.screenSpace + this.state.scrollOffset)) {
      this.state.visibleAnimations.push(Animated.timing(
        this.state.animatedValues[this.state.alreadyAnimated - 1],
        {
          fromValue: 0,
          toValue: 1,
          duration: 500,
          easing: Easing.easeIn
        }
      ));

      ++this.state.alreadyAnimated;
    }

    Animated.sequence(
      this.state.visibleAnimations
    ).start();
    this.state.visibleAnimations = [];
  }

  componentDidMount() {
    this.state.animatedValues.map((value, key) => {
      if (((key + 1) * this.state.rowHeight) <= (this.state.screenSpace + this.state.scrollOffset)) {
        this.state.visibleAnimations.push(Animated.timing(
          this.state.animatedValues[key],
          {
            fromValue: 0,
            toValue: 1,
            duration: 500,
            easing: Easing.easeIn
          }
        ));
      }
    });
    Animated.sequence(
      this.state.visibleAnimations
    ).start();
    this.state.alreadyAnimated = this.state.visibleAnimations.length;
    this.state.visibleAnimations = [];
  }
  render() {

    return (
      <Animated.View style={{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    opacity: this.state.fadeAnim
  }}>
    <ScrollView
      onScroll={this.handleScroll}
      scrollEventThrottle={100}
      showsVerticalScrollIndicator={false}>
      {this.props.children.map((child, key) => {
        let visible = ((key + 1) * this.state.rowHeight) <= (this.state.screenSpace + this.state.scrollOffset)
        this.state.animatedValues.push(new Animated.Value(0));

        return (
        <Animated.View style={{opacity: this.state.animatedValues[key]}}>
            {child}
        </Animated.View>
        );})
      }
    </ScrollView>
        </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  }
})