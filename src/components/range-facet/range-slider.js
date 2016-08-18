import React from "react";
import ReactDOM from "react-dom";

const MOUSE_DOWN = 0;
const MOUSE_UP = 1;

const styles = {
	slider: {
		"MozUserSelect": "none",
		"WebkitUserSelect": "none",
		"MsUserSelect": "none",
		"UserSelect": "none",
		"WebkitUserDrag": "none",
		"userDrag": "none",
		"cursor": "pointer",
		width: "100%",
		stroke: "#f1ebe6",
		fill: "#f1ebe6"
	}
};

class RangeSlider extends React.Component {
	constructor(props) {
		super(props);
		this.mouseState = MOUSE_UP;
		this.mouseUpListener = this.onMouseUp.bind(this);
		this.mouseMoveListener = this.onMouseMove.bind(this);
		this.touchMoveListener = this.onTouchMove.bind(this);

		this.state = {
			...this.propsToState(this.props),
			...{hoverState: null}
		};
	}

	componentDidMount() {
		window.addEventListener("mouseup", this.mouseUpListener);
		window.addEventListener("mousemove", this.mouseMoveListener);
		window.addEventListener("touchend", this.mouseUpListener);
		window.addEventListener("touchmove", this.touchMoveListener);
	}

	componentWillReceiveProps(nextProps) {
		this.setState(this.propsToState(nextProps));
	}

	componentWillUnmount() {
		window.removeEventListener("mouseup", this.mouseUpListener);
		window.removeEventListener("mousemove", this.mouseMoveListener);
		window.removeEventListener("touchend", this.mouseUpListener);
		window.removeEventListener("touchmove", this.touchMoveListener);
	}



	propsToState(props) {
		let lowerLimit = props.lowerLimit || 0;
		let upperLimit = props.upperLimit || 1;
		return {
			lowerLimit: lowerLimit,
			upperLimit: upperLimit
		};
	}

	getPositionForLimit(pageX) {
		let rect = ReactDOM.findDOMNode(this).getBoundingClientRect();
		if(rect.width > 0) {
			let percentage = (pageX - rect.left) / rect.width;
			if(percentage > 1) {
				percentage = 1;
			} else if(percentage < 0) {
				percentage = 0;
			}
			let center = (this.state.upperLimit + this.state.lowerLimit) / 2;

			if(this.state.hoverState === "bar") {
				let lowerLimit = percentage + this.state.lowerLimit - center;
				let upperLimit = percentage - (center - this.state.upperLimit);
				if(upperLimit >= 1) { upperLimit = 1; }
				if(lowerLimit <= 0) { lowerLimit = 0; }
				return {lowerLimit: lowerLimit, upperLimit: upperLimit};
			} else if(this.state.hoverState === "lowerLimit") {
				if(percentage >= this.state.upperLimit) { percentage = this.state.upperLimit; }
				return { lowerLimit: percentage };
			} else if(this.state.hoverState === "upperLimit") {
				if(percentage <= this.state.lowerLimit) { percentage = this.state.lowerLimit; }
				return { upperLimit: percentage};
			}
		}
		return null;
	}

	setRange(pageX) {
		let posForLim = this.getPositionForLimit(pageX);
		if(posForLim !== null) {
			this.setState(posForLim);
			this.props.onChange({...this.state, refresh: false});
		}
	}

	onMouseDown(target, ev) {
		this.mouseState = MOUSE_DOWN;
		this.setState({hoverState: target});
		return ev.preventDefault();
	}


	onMouseMove(ev) {
		if(this.mouseState === MOUSE_DOWN) {
			this.setRange(ev.pageX);
			return ev.preventDefault();
		}
	}

	onTouchMove(ev) {
		if(this.mouseState === MOUSE_DOWN) {
			this.setRange(ev.touches[0].pageX);
			return ev.preventDefault();
		}
	}


	onMouseUp() {
		if(this.mouseState === MOUSE_DOWN) {
			this.props.onChange({...this.state, refresh: true});
		}
		this.setState({ hoverState: null });
		this.mouseState = MOUSE_UP;
	}


	getRangePath() {
		return "M" + (8 + Math.floor(this.state.lowerLimit * 400)) + " 13 L " + (Math.ceil(this.state.upperLimit * 400) - 8) + " 13 Z";
	}

	getRangeCircle(key) {
		let percentage = this.state[key];
		return (
			<circle
				className={this.state.hoverState === key ? "hovering" : ""}
				cx={percentage * 400} cy="13"
				onMouseDown={this.onMouseDown.bind(this, key)}
				onTouchStart={this.onMouseDown.bind(this, key)}
				r="13" />
		);
	}

	render() {
		let keys = this.state.hoverState === "lowerLimit" ? ["upperLimit", "lowerLimit"] : ["lowerLimit", "upperLimit"];
		return (
			<svg className="facet-range-slider" viewBox="0 0 400 26">

				<path d="M0 0 L 0 26 Z" fill="transparent" />
				<path d="M400 0 L 400 26 Z" fill="transparent" />
				<path d="M0 13 L 400 13 Z" fill="transparent" />
				<g className="range-line">
					<path
						className={this.state.hoverState === "bar" ? "hovering" : ""}
						d={this.getRangePath()}
						onMouseDown={this.onMouseDown.bind(this, "bar")}
						onTouchStart={this.onMouseDown.bind(this, "bar")}
					/>
					{this.getRangeCircle(keys[0])}
					{this.getRangeCircle(keys[1])}
				</g>

			</svg>
		);
	}
}

RangeSlider.propTypes = {
	lowerLimit: React.PropTypes.number,
	onChange: React.PropTypes.func.isRequired,
	upperLimit: React.PropTypes.number
};


export default RangeSlider;