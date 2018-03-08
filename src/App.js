import React, {Component} from 'react';
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
            results: [],
            suggestions: [],
            infoText: 'Please select a flight ...',
            currentPage: 1,
            numberOfPages: 0,
            flightsPerPage: 5,
            currentPageResults: [],
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getFlights = this.getFlights.bind(this);
        this.getSuggestions = this.getSuggestions.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    getFlights(from, to, date) {
        const url = 'https://api.skypicker.com/flights';
        const results = [];

        axios.get(url, {
            params: {
                flyFrom: from,
                to: to,
                dateFrom: date,
                dateTo: date
            }
        })
            .then((response) => {
                if (response.data.data.length < 1) {
                    this.setState({
                        infoText: 'No flights found, please try again.'
                    });
                }
                response.data.data.forEach((data) => {
                    let dateObj = new Date(data.dTime * 1000);

                    results.push([data.flyFrom, data.flyTo, dateObj.toString(), data.price]);
                });
                this.setState({
                    results: results
                }, () => {
                    this.setState({
                        currentPageResults: this.state.results.slice((this.state.currentPage * 5) - 5, this.state.currentPage * 5),
                        numberOfPages: Math.ceil(this.state.results.length / 5)
                    });
                });
            });
    }

    getSuggestions(userInput) {
        const url = 'https://api.skypicker.com/locations/?term=';
        axios.get(url + userInput + '&location_types=city').then((response) => {
            const names = response.data.locations.map((dataObject) => {
                return dataObject.name;
            });
            this.setState({
                suggestions: names
            });
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
        this.getSuggestions(value);
    }

    handlePageChange(event) {
        const value = event.target.innerHTML;

        this.setState({
            currentPage: value
        }, () => {
            this.setState({
                currentPageResults: this.state.results.slice((this.state.currentPage * 5) - 5, this.state.currentPage * 5)
            })
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
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to Flight checker</h1>
                </header>

                <div className="container top-margin">
                    <div className="row">
                        <div className="col-2"></div>
                        <div className="col-8">
                            <form className="form-inline" onSubmit={this.handleSubmit}>

                                <label className="sr-only" htmlFor="from">Name</label>
                                <input type="text" className="form-control mb-2 mr-sm-2" name="from"
                                       id="from" placeholder="Vienna" value={this.state.from}
                                       onChange={this.handleInputChange} list="fromSuggestions"
                                ></input>
                                {this.state.suggestions.length > 0 &&
                                    <datalist id="fromSuggestions">{this.state.suggestions.map((suggestion) => {
                                        return <option key={suggestion.toString()} value={suggestion}> {suggestion} </option>
                                    })}</datalist>
                                }

                                <label className="sr-only" htmlFor="to">Name</label>
                                <input type="text" className="form-control mb-2 mr-sm-2" name="to" id="to"
                                       placeholder="Barcelona"
                                       value={this.state.to} onChange={this.handleInputChange}
                                       list="toSuggestions"></input>
                                {this.state.suggestions.length > 0 &&
                                    <datalist id="toSuggestions">{this.state.suggestions.map((suggestion) => {
                                        return <option key={suggestion.toString()} value={suggestion}> {suggestion} </option>
                                    })}</datalist>
                                }

                                <label className="sr-only" htmlFor="date">Name</label>
                                <input type="date" className="form-control mb-2 mr-sm-2" name="date" id="date"
                                       value={this.state.date} onChange={this.handleInputChange}></input>

                                <button className="btn btn-primary mb-2 logo-color">Submit</button>
                            </form>
                        </div>
                        <div className="col-2"></div>
                    </div>

                    <div className="row">
                        <div className="col-2"></div>
                        <div className="col-8">
                            {this.state.results.length > 0 &&
                                <div>
                                    <table className="table">
                                        <thead>
                                        <tr>
                                            <th>From</th>
                                            <th>To</th>
                                            <th>Date&Time</th>
                                            <th>Price</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.currentPageResults.map((chunk, ind) => {
                                            return (<tr>
                                                {
                                                    chunk.map((obj, ind) => {

                                                        if (ind == 3) {
                                                            return <td>{obj} &euro;</td>
                                                        } else {
                                                            return <td>{obj}</td>
                                                        }
                                                    })
                                                }
                                            </tr>)
                                        })
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            }
                            {this.state.numberOfPages > 0 &&
                                <nav aria-label="Page navigation example">
                                    <ul className="pagination">
                                        {[...Array(this.state.numberOfPages).keys()]
                                            .map((pageNumber) => {
                                                return <li className="page-item">
                                                    <a className="page-link" pagenumber={pageNumber + 1} href="#"
                                                       onClick={this.handlePageChange}>{pageNumber + 1}</a>
                                                    </li>
                                            })}

                                    </ul>
                                </nav>
                            }
                            {this.state.results.length < 1 &&
                            <h4>{this.state.infoText}</h4>
                            }
                        </div>
                        <div className="col-2"></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
