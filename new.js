/**
 * @providesModule ClockInSwitch
 * @flow
 */
import React, {Component} from 'react';
import {View, Animated, StyleSheet, PanResponder, Text} from 'react-native';

export class ClockInSwitch extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pan: new Animated.ValueXY(),
			panValue: 0
		};
	}
	componentWillMount() {
		this._panResponder = PanResponder.create({
			onMoveShouldSetResponderCapture: () => true,
			onMoveShouldSetPanResponderCapture: () => true,
			onPanResponderGrant: (e, gestureState) => {
				this.state.pan.setValue({x: 0, y: 0});
			},
			//here's where you can check, constrain and store values
			onPanResponderMove: (evt, gestureState) => {
				// 300 is the width of the red container (will leave it to you to calculate this
				// dynamically) 100 is the width of the button (90) plus the 5px margin on
				// either side of it (10px total)
				var newXVal = (gestureState.dx < 300 - 100) ? gestureState.dx : 300 - 100;
				this.state.pan.x.setValue(newXVal);
				//set this state for display
				this.setState({panValue: newXVal});
			},

			onPanResponderRelease: (e, {vx, vy}) => {
				this.state.pan.flattenOffset();
				Animated.spring(this.state.pan, {
						toValue: 0,
						duration: 400,
						overshootClamping: true
					}).start();
				this.setState({panValue: 0});
			}
		});
	}

	componentWillUnMount() {
		this.state.pan.x.removeAllListeners();
	}

	render() {
		//decouple the value from the state object
		let {pan} = this.state;
		let [translateX, translateY] = [pan.x, pan.y];
		let translateStyle = {transform: [{translateX}, {translateY}]};
		return (
			<View>
				<Text style={styles.leftText}>Power Button Demo</Text>
				<View style={styles.buttonStyle}>
					<Animated.View
						style={[styles.sliderButtonStyle, translateStyle]}
						{...this._panResponder.panHandlers}>
						<Text>123</Text>

					</Animated.View>
				</View>
				<Text style={styles.rightText}>{this.state.panValue}: x value</Text>
			</View>
		);
	}
}

export default ClockInSwitch;
const styles = StyleSheet.create({
	sliderButtonStyle: {
		borderColor: '#FCFFF5',
		borderStyle: 'solid',
		borderWidth: .5,
		backgroundColor: '#FCFFF5',
		borderRadius: 45,
		height: 90,
		width: 90,
		justifyContent: 'center',
		textAlign: 'center',
		marginHorizontal: 5,
		shadowColor: '#333745',
		shadowOffset: {
			width: 2,
			height: 2
		},
		shadowOpacity: .6,
		shadowRadius: 5
	},
	buttonStyle: {
		borderColor: '#FCFFF500',
		backgroundColor: '#DAEDE255',
		borderStyle: 'solid',
		borderWidth: 1,
		height: 100,
		width: 300,
		justifyContent: 'center',
		borderRadius: 50,
		margin: 5,
		flexDirection: 'column'
	},
	rightText: {
		justifyContent: 'center',
		textAlign: 'right',
		fontWeight: '100',
		marginHorizontal:15,
		fontSize: 20,
		color: '#FCFFF5',
		marginVertical:25,
		flexDirection: 'column'
	},
	leftText: {
		justifyContent: 'center',
		textAlign: 'left',
		fontWeight: '100',
		marginHorizontal:15,
		fontSize: 24,
		color: '#FCFFF5',
		marginVertical:25,
		flexDirection: 'column'
	}
});