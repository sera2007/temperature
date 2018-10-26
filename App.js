'use strict';

import React, {Component} from 'react';
import {
	View,
	StyleSheet,
	PanResponder,
	Text,
	ImageBackground,
	TouchableOpacity,
	Image,
} from 'react-native';

type CircleStyles = {
	left?: number,
	top?: number,
};

const CIRCLE_WIDTH = 92;
const CIRCLE_HEIGHT = 113;
const CIRCLE_WRAPPER_WIDTH = 434;
const CIRCLE_WRAPPER_HEIGHT = 434;

type Props = $ReadOnly<{||}>;

export default class App extends Component<Props> {
	constructor(props) {
		super(props);
		this.state = {
			cx: CIRCLE_WRAPPER_WIDTH / 2,
			cy: CIRCLE_WRAPPER_WIDTH / 2,
			prev_cx: CIRCLE_WRAPPER_WIDTH / 2,
			prev_cy: CIRCLE_WRAPPER_WIDTH / 2,
			r: (CIRCLE_WRAPPER_WIDTH / 2),
			temperature_value_angle: '0deg',
			prev_temperature_value_angle: '0deg',
			temperature_value: 25,
			temperature_value_color: 'rgb(0,0,0)'
		}
	}

	_handleStartShouldSetPanResponder = (): boolean => {
		return true;
	};
	_handleMoveShouldSetPanResponder = (): boolean => {
		return true;
	};

	_handlePanResponderMove = (event: PressEvent, gestureState: GestureState) => {

		this._circleStyles.style.left = this._previousLeft + gestureState.dx;
		this._circleStyles.style.top = this._previousTop + gestureState.dy;

		this._realLeft = this._previousLeft + gestureState.dx;
		this._realTop = this._previousTop + gestureState.dy;

		const {x, y} = this.cartesianToPolar(this._realLeft, this._realTop);

		this._circleStyles.style.left = (x - CIRCLE_WIDTH / 2);
		this._circleStyles.style.top = (y - CIRCLE_WIDTH / 2) + 10;

		this._updateNativeStyles();
	};

	_handlePanResponderEnd = (event: PressEvent, gestureState: GestureState) => {
		this._previousLeft += gestureState.dx;
		this._previousTop += gestureState.dy;
	};

	_panResponder: PanResponderInstance = PanResponder.create({
		onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
		onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
		onPanResponderGrant: this._handlePanResponderGrant,
		onPanResponderMove: this._handlePanResponderMove,
		onPanResponderRelease: this._handlePanResponderEnd,
		onPanResponderTerminate: this._handlePanResponderEnd,
	});

	_previousLeft: number = 0;
	_previousTop: number = 0;
	_realLeft: number = 0;
	_realTop: number = 0;
	_circleStyles: {| style: CircleStyles |} = {style: {}};
	circle: ?React.ElementRef<typeof Image> = null;

	polarToCartesian(angle) {
		let {cx, cy, r} = this.state
			, a = (angle - 270) * Math.PI / 180.0
			, x = cx + (r * Math.cos(a))
			, y = cy + (r * Math.sin(a))
			, temperature_angle = (angle - 180) + 'deg';
		if (angle > 45 && angle < 315) {
			let cof = 5.3;
			let temperature_value_color = 'rgb(' + (angle * 0.701) + ',0,' + (255 - angle * 0.701) + ')';

			let temperature_value = ((angle - 180) / cof) + 25;
			if (temperature_value < 0) temperature_value = 0;
			if (temperature_value > 50) temperature_value = 50;
			this.setState({
				prev_cx: x,
				prev_cy: y,
				prev_temperature_value_angle: temperature_angle,
				temperature_value_angle: temperature_angle,
				temperature_value: Math.round(temperature_value),
				temperature_value_color: temperature_value_color
			});
		} else {
			x = this.state.prev_cx;
			y = this.state.prev_cy;
			this.setState({
				temperature_value_angle: this.state.prev_temperature_value_angle
			});
		}

		return {angle, temperature_angle, x, y}
	}

	cartesianToPolar(x, y) {
		const {cx, cy} = this.state;
		let angle = Math.round((Math.atan((y - cy) / (x - cx))) / (Math.PI / 180) + ((x > cx) ? 270 : 90));

		return (this.polarToCartesian(angle));
	}

	UNSAFE_componentWillMount() {
		this._previousLeft = (CIRCLE_WRAPPER_WIDTH / 2) - (CIRCLE_WIDTH / 2);
		this._previousTop = -30;
		this._circleStyles = {
			style: {
				left: this._previousLeft,
				top: this._previousTop,
			},
		};
	}

	componentDidMount() {
		this._updateNativeStyles();
	}

	_updateNativeStyles() {
		this.circle && this.circle.setNativeProps(this._circleStyles);
	}

	render() {
		return (
			<View style={styles.container}>
				<ImageBackground
					source={require('./assets/header-bg.png')}
					style={styles.bgHeader}
				/>
				<View style={styles.navigationWrapper}>
					<View style={styles.navigationLeft}>
						<Text style={styles.navigationTime}>08:05 AM</Text>
						<Text style={styles.navigationDate}>/ Dec 21, 2018</Text>
					</View>
					<TouchableOpacity>
						<ImageBackground
							source={require('./assets/icon-basket.png')}
							style={styles.bgBasket}
						/>
						<Text style={styles.basketCount}>2</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.content}>
					<View style={styles.contentNavigationWrapper}>
						<View style={styles.breadcrumbs}>
							<TouchableOpacity>
								<Image
									style={styles.breadcrumbHome}
									source={require('./assets/icon-home.png')}
								/>
							</TouchableOpacity>
							<Text style={styles.breadcrumbItem}>Home</Text>
						</View>
						<View style={styles.contentMenu}>
							<TouchableOpacity>
								<Image
									style={styles.contentMenuIcon}
									source={require('./assets/icon-menu.png')}
								/>
							</TouchableOpacity>
						</View>
					</View>

						<View style={styles.temperatureWrapper}>
							<ImageBackground
								source={require('./assets/temperature_bg.png')}
								style={styles.bgTemperature}
							>
								<View
									ref={circle => {
										this.circle = circle;
									}}
									style={styles.temperatureDragWrapper}
									{...this._panResponder.panHandlers}
								>
									<Image
										style={[styles.temperatureDrag, {transform: [{rotate: this.state.temperature_value_angle}]}]}
										source={require('./assets/temperature-drag.png')}
									/>
								</View>

							</ImageBackground>
							<Text style={[styles.temperatureValue, {color: this.state.temperature_value_color}]}>{this.state.temperature_value}°</Text>
							<Text style={styles.temperatureType}>Kitchen</Text>
						</View>
				</View>
				<TouchableOpacity style={styles.buttonPlus}>
					<Image
						style={styles.buttonPlusIcon}
						source={require('./assets/icon-plus.png')}
					/>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f7f7f7',
	},
	content: {
		flex: 1,
		marginBottom: 28,
		marginHorizontal: 28,
		backgroundColor: '#fff',
		borderRadius: 8,
		paddingHorizontal: 36,
		paddingVertical: 40,
		shadowColor: 'rgba(0, 0, 0, 0.04)',
		shadowOffset: {width: 0, height: 0},
		shadowRadius: 30,
	},
	navigationWrapper: {
		marginTop: 35,
		paddingHorizontal: 45,
		marginBottom: 20,
		height: 35,
		alignItems: 'baseline',
		justifyContent: 'space-between',
		flexDirection: 'row'
	},
	navigationLeft: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	navigationTime: {
		color: '#ffffff',
		fontFamily: 'Roboto Light',
		fontSize: 30,
		fontWeight: '300',
	},
	navigationDate: {
		color: '#ffffff',
		fontFamily: 'Roboto Light',
		fontSize: 18,
		fontWeight: '300',
		marginLeft: 8
	},
	bgHeader: {
		height: 180,
		position: 'absolute',
		width: '100%',
	},
	bgBasket: {
		width: 20,
		height: 20,
	},
	basketCount: {
		width: 14,
		height: 14,
		backgroundColor: '#e6573c',
		color: '#ffffff',
		fontFamily: 'Roboto',
		fontSize: 9,
		fontWeight: '400',
		borderRadius: 14,
		textAlign: 'center',
		position: 'absolute',
		right: -5,
		top: -5
	},
	contentNavigationWrapper: {
		width: '100%',
		alignItems: 'baseline',
		justifyContent: 'space-between',
		flexDirection: 'row'
	},
	breadcrumbs: {
		alignItems: 'center',
		flexDirection: 'row',
		marginBottom: 80
	},
	breadcrumbHome: {
		width: 42,
		height: 38
	},
	breadcrumbItem: {
		color: '#333333',
		fontFamily: 'Roboto',
		fontSize: 18,
		fontWeight: '400',
		marginLeft: 19
	},
	contentMenuIcon: {
		width: 9,
		height: 35,
	},
	buttonPlus: {
		width: 56,
		height: 56,
		shadowColor: 'rgba(0, 0, 0, 0.12)',
		shadowOffset: {width: 4, height: 0},
		shadowRadius: 10,
		backgroundColor: '#5fb8c1',
		borderRadius: 56,
		position: 'absolute',
		bottom: 16,
		right: 16,
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonPlusIcon: {
		width: 14,
		height: 14,
	},
	temperatureWrapper: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	bgTemperature: {
		width: 434,
		height: 434,
		position: 'relative',
		alignItems: 'center',
		justifyContent: 'flex-start',
		//paddingTop: 30
	},
	temperatureValue: {
		fontFamily: 'Roboto',
		fontSize: 48,
		fontWeight: '400',
		position: 'absolute',
		top: '50%'
	},
	temperatureType: {
		color: '#888888',
		fontFamily: 'Roboto',
		fontSize: 14,
		fontWeight: '400',
		position: 'absolute',
		bottom: '25%'
	},
	temperatureDrag: {
		width: 92,
		height: 113,
	},
	temperatureDragWrapper: {
		width: 92,
		height: 113,
		position: 'absolute',
		left: 0,
		top: 0,
	},

});

module.exports = App;