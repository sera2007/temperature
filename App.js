import React, {Component} from 'react';
import {
	StyleSheet,
	Text,
	View,
	ImageBackground,
	Image,
	TouchableOpacity,
	Animated,
	PanResponder
} from 'react-native';

type Props = {};
export default class App extends Component<Props> {
	constructor(props) {
		super(props);

		this.state = {
			pan: new Animated.ValueXY(),
			scale: new Animated.Value(1)
		};
	}

	componentWillMount() {

		this._panResponder = PanResponder.create({

			onMoveShouldSetResponderCapture: () => true,
			onMoveShouldSetPanResponderCapture: () => true,

			onPanResponderGrant: (e, gestureState) => {
				// Set the initial value to the current state

				this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
				this.state.pan.setValue({x: 0, y: 0});

				Animated.spring(
					this.state.scale,
					{ toValue: 1.1, friction: 3 }
				).start();
			},

			onPanResponderMove: (evt, gestureState) => {
				//this.setState({pan.x: 1});
				return Animated.event([null, {
					dx: this.state.pan.x,
					dy: this.state.pan.y,
				}])(evt, gestureState)
			},

			onPanResponderRelease: (e, {vx, vy}) => {
				// Flatten the offset to avoid erratic behavior
				this.state.pan.flattenOffset();
				Animated.spring(
					this.state.scale,
					{ toValue: 1, friction: 3 }
				).start();
			}
		});
	}


	render() {
		// Destructure the value of pan from the state
		let { pan, scale } = this.state;
		// Calculate the x and y transform from the pan value
		let [translateX, translateY] = [pan.x, pan.y];
		let rotate = '0deg';
		let CIRCLE_RADIUS = 210;
		// Calculate the transform property and set it as a value for our style which we add below to the Animated.View component
		let imageStyle = {transform: [{translateX}, {translateY}, {rotate}, {scale}]};

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
							<Animated.View style={imageStyle} {...this._panResponder.panHandlers}>
								<Image
									style={styles.temperatureDrag}
									source={require('./assets/temperature-drag.png')}
								/>
							</Animated.View>

						</ImageBackground>
						<Text style={styles.temperatureValue}>25°</Text>
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
		flex:1,
		marginBottom: 28,
		marginHorizontal: 28,
		backgroundColor: '#fff',
		borderRadius: 8,
		paddingHorizontal: 36,
		paddingVertical: 40,
		shadowColor: 'rgba(0, 0, 0, 0.04)',
		shadowOffset: { width: 0, height: 0 },
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
	navigationTime:{
		color: '#ffffff',
		fontFamily: 'Roboto Light',
		fontSize: 30,
		fontWeight: '300',
	},
	navigationDate:{
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
	breadcrumbs:{
		alignItems: 'center',
		flexDirection: 'row',
		marginBottom: 51
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
		shadowOffset: { width: 4, height: 0 },
		shadowRadius: 10,
		backgroundColor: '#5fb8c1',
		borderRadius: 56,
		position:'absolute',
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
		width: 613,
		height: 489,
		position: 'relative',
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingTop: 30
	},
	temperatureValue: {
		color: '#343434',
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
	slider1: {
		position: 'absolute',
		top: 0,
		left: 0
	},

});
