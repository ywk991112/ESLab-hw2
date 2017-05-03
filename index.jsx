import React from 'react'
import ReactDOM from 'react-dom'
import io from 'socket.io-client'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tem: 0,
      hum: 0,
      sound: 0,
      light: 0
    }
  }

	componentDidMount() {
		this.connect()
		.then(socket => {
			console.log('the socket is connected');
			socket.on('tem', (tem) => this.setState({tem: tem}));
			socket.on('hum', (hum) => this.setState({hum: hum}));
			socket.on('sound', (sound) => this.setState({sound: sound}));
			socket.on('light', (light) => this.setState({light: light}));
		});
	}

	connect = () => {
		const socket = io('http://localhost:8080');
		return new Promise(resolve => {
			socket.on('connect', () => {
				resolve(socket);
			});
		});
	}

  render() {
    return (
      <div>
        <p>temperature: {this.state.tem} </p>
        <p>humidity: {this.state.hum} </p>
        <p>sound: {this.state.sound} </p>
        <p>light: {this.state.light} </p>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
