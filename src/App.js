import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      from: '',
      to: '',
      date: '',
      results: []
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getFlights = this.getFlights.bind(this);
  }

  getFlights(from, to, date) {
    const url = 'https://api.skypicker.com/flights';
    const results = [];
    axios.get(url, {params: {
        flyFrom: from,
        to: to,
        dateFrom: date,
        dateTo: date
    }})
    .then((response) => {

        response.data.data.forEach((data) =>{
            let dateObj =  new Date(data.dTime*1000);

            results.push([data.flyFrom, data.flyTo, dateObj.toString(), data.price]);
        })
       this.setState({
            results: results
        });

    console.log(this.state.results);

    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
      // YYYY-MM-DD to dd-mm-yyyy
      const dateArr = this.state.date.split('-');
      const convertedDate = dateArr[2] + '/' + dateArr[1] + '/' + dateArr[0];

      this.getFlights(this.state.from, this.state.to, convertedDate);
      event.preventDefault();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Flight checker</h1>
        </header>

        <div class="container top-margin">
            <div class="row">
                <div class="col-2"></div>
                <div class="col-8">
                    <form class="form-inline" onSubmit={this.handleSubmit}>
                        <label class="sr-only" for="from">Name</label>
                        <input type="text" class="form-control mb-2 mr-sm-2" name="from" id="from" placeholder="Vienna"                        value={this.state.from} onChange={this.handleInputChange}></input>

                        <label class="sr-only" for="to">Name</label>
                        <input type="text" class="form-control mb-2 mr-sm-2" name="to" id="to" placeholder="Barcelona"
                        value={this.state.to} onChange={this.handleInputChange}></input>

                        <label class="sr-only" for="date">Name</label>
                        <input type="date" class="form-control mb-2 mr-sm-2" name="date" id="date"
                        value={this.state.date} onChange={this.handleInputChange}></input>
                        <button class="btn btn-primary mb-2 logo-color">Submit</button>
                    </form>
                </div>
                <div class="col-2"></div>
            </div>
            <div class="row">
                <div class="col-2"></div>
                <div class="col-8">
                    {this.state.results.length > 0 &&
                    <table class="table">
                        <thead>
                            <tr>
                                <th>From</th>
                                <th>To</th>
                                <th>Date&Time</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.results.map((chunk, ind) => {
                                  return (<tr>
                                     {
                                          chunk.map((obj, ind) => {
                                              return <td>{obj}</td>
                                          })
                                     }
                                     </tr>)
                                  })
                            }
                        </tbody>
                    </table>
                    }
                </div>
                <div class="col-2"></div>
            </div>
        </div>
      </div>
    );
  }
}

export default App;
