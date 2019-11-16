import React, { Component } from "react";
import ReactDOM from "react-dom";
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.submitVote = this.submitVote.bind(this);
  }

  submitVote = () => {
    alert(1);
  }

  render() {
    return (
      <div className="App">
        <header>Waterloo Idol Final 2019 Voting Page</header>
        {/* <body> */}
          <div className="row">
            <button onClick={this.submitVote} className="vote_button">Vote: 1</button>
          </div>
        {/* </body> */}
      </div>
    );
  }
}

export default App;
