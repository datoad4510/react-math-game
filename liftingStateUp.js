//literally take all child component state and give it to the parent. then pass it down to children as props.
//also pass down any functions they might need as props. in my opinion this defeats the purpose of moularity:
//we cannot reuse the child components outside of App now. they are completely dependent on the props that the
//parent passes down to it. also makes code much less readable: hard to know which state belongs to which child

//TODO add high scores
class App extends React.Component {
	operations = ["+", "-", "*", "/"];
	getRandomOperation = () => {
		return this.operations[Math.floor(this.operations.length * Math.random())];
	};

	constructor(props) {
		super(props);
		this.state = {
			seconds: 20,
			intervalID: -1,
			num1: Math.ceil(Math.random() * 10),
			num2: Math.ceil(Math.random() * 10),
			operation: "+",
			score: 0,
			response: "",
			correctAnswer: 0,
		};
	}

	getTwoRandomNumbers(operation) {
		if (operation == "/") {
			let temp = Math.ceil(Math.random() * 10);
			return [temp * Math.ceil(Math.random() * 10), temp];
		} else {
			return [Math.ceil(Math.random() * 10), Math.ceil(Math.random() * 10)];
		}
	}

	calculateCorrectAnswer = (callback) => {
		let correct_answer;
		switch (this.state.operation) {
			case "+":
				correct_answer = this.state.num1 + this.state.num2;
				break;
			case "-":
				correct_answer = this.state.num1 - this.state.num2;
				break;
			case "*":
				correct_answer = this.state.num1 * this.state.num2;
				break;
			case "/":
				correct_answer = this.state.num1 / this.state.num2;
				break;
			default:
				break;
		}
		this.setState({ correctAnswer: correct_answer }, callback);
	};

	inputKeyPress = (event) => {
		if (event.key === "Enter") {
			this.calculateCorrectAnswer(() => {
				const answer = parseInt(this.state.response);
				if (answer === this.state.correctAnswer) {
					let new_operation = this.getRandomOperation();
					let new_nums = this.getTwoRandomNumbers(new_operation);
					this.setState((state) => ({
						score: state.score + 1,
						num1: new_nums[0],
						num2: new_nums[1],
						response: "",
						operation: new_operation,
					}));
				} else {
					this.setState((state) => ({
						score: state.score - 1,
						response: "",
					}));
				}
			});
		}
	};

	updateResponse = (event) => {
		this.setState({ response: event.target.value });
	};

	componentDidMount() {
		this.startCountdown();
	}

	componentDidUpdate() {
		if (this.state.seconds <= 0) {
			clearInterval(this.state.intervalID);
		}
	}

	decrementSecond = () => {
		this.setState((state) => ({
			seconds: state.seconds - 1,
		}));
	};

	startCountdown() {
		let new_intervalID = setInterval(this.decrementSecond, 1000);
		this.setState({ intervalID: new_intervalID });
	}

	render() {
		if (this.state.seconds > 0) {
			return (
				<React.Fragment>
					<Game
						num1={this.state.num1}
						operation={this.state.operation}
						num2={this.state.num2}
						inputKeyPress={this.inputKeyPress}
						updateResponse={this.updateResponse}
						value={this.state.response}
						score={this.state.score}
					/>
					<Countdown seconds={this.state.seconds} />
				</React.Fragment>
			);
		} else {
			return (
				<React.Fragment>
					<h1 className="center-align">Your score is {this.state.score}</h1>
				</React.Fragment>
			);
		}
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			//doesn't work without chrome react devtools extension
			//fragment doesn't add dom elements
			<React.Fragment>
				<div id="wrapper">
					<h1>
						{this.props.num1}
						{this.props.operation}
						{this.props.num2}
					</h1>
					<input
						onKeyPress={this.props.inputKeyPress}
						onChange={this.props.updateResponse}
						value={this.props.value}
					/>
					<h1>Current score: {this.props.score}</h1>
				</div>
			</React.Fragment>
		);
	}
}

class Countdown extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<React.Fragment>
				<span className="timer">Time: {this.props.seconds}</span>
			</React.Fragment>
		);
	}
}

ReactDOM.render(<App />, document.querySelector("#app"));
