import React from 'react'
import ReactDOM from 'react-dom'
import io from 'socket.io-client'
import createPlotlyComponent from 'react-plotlyjs';
import Plotly from 'plotly.js/dist/plotly-cartesian';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tem: 0,
      hum: 0,
			time: 0
    };
		this.temR = [];
		this.humR = [];
		this.soundR = [];
		this.lightR = [];
  }

	componentDidMount() {
		this.connect()
		.then(socket => {
			console.log('the socket is connected');
			socket.on('tem', (tem) => this.setState({tem: tem}));
			socket.on('hum', (hum) => this.setState({hum: hum}));
		});
	}

	componentWillUnmount() {
		if(this.timer) 
			clearInterval(this.timer);
		
	}

	startPlot = () => {
		this.timer = setInterval(
      () => this.tick(),
      1000
    );	
	}

	//ticktest = () => {
		//let time = this.state.time + 1;
		//console.log('time', time);
    //this.setState({time: time});
    //const p = new Promise( () => {
      //this.setState({hum: this.state.hum + 1})
      //resolve(5);
    //});
    //p.then( hum => {
      //console.log('hao' + hum);
      //this.temR = [...this.temR, this.state.tem];
      //this.humR = [...this.humR, this.state.hum];
    //});
	//}

	tick = () => {
		let time = this.state.time + 1;
		console.log('time', time);
    this.setState({time: time});
    this.setState({hum: this.state.hum + 1})
    this.temR = [...this.temR, this.state.tem];
    this.humR = [...this.humR, this.state.hum];
	}

	connect = () => {
		const socket = io('http://localhost:8080');
		return new Promise(resolve => {
			socket.on('connect', () => {
				resolve(socket);
			});
		});
	}

	createXY = (arr) => {
		let a = [0, 0, 0, 0, 0];
		let count = 5;
		for(let i = arr.length-1; i > 0 && count > 0; i--) {
			count --;
			a[count] = arr[i];
		}
		return a;
	}

  plot = (arr, name) => {
    const PlotlyComponent = createPlotlyComponent(Plotly);
    let data = [
      {
        type: 'scatter',  
        x: [0, 1, 2, 3, 4],     
        y: this.createXY(arr),     
        marker: {         
          color: 'rgb(16, 32, 77)' 
        },
				name: name 
      }
    ];
    let layout = {                     
      title: name + ' time slot',  
      xaxis: {                  
        title: 'time'         
      },
			yaxis: {
				title: name 
			}
    };
    let config = {
      showLink: false,
      displayModeBar: false
    };
    return (
      <PlotlyComponent className="" data={data} layout={layout} config={config}/>
    );
  }

  render() {
    return (
      <div>
        <p>temperature: {this.state.tem} </p>
        <p>humidity: {this.state.hum} </p>
				<button onClick={this.startPlot}>start plot</button>
				{this.plot(this.humR, 'humid')}
				{this.plot(this.temR, 'temperature')}
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
