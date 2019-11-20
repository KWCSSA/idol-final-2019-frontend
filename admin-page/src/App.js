import React, { Component } from "react";
import Select from "react-select";
import Switch from "react-switch";
import "./App.css";

import axios from "axios";

const url = "http://localhost:9898";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [
        { value: "1/2", label: "二选一" },
        { value: "1/3", label: "三选一" },
        { value: "1/4", label: "四选一" }
      ],
      actions: [
        { value: "add", label: "加票" },
        { value: "replace", label: "改票" }
      ],
      people: [
        { value: "A", label: "A" },
        { value: "B", label: "B" },
        { value: "C", label: "C" },
        { value: "D", label: "D" }
      ],
      selected_option: { value: "1/4", label: "四选一" },
      selected_action: null,
      selected_people: null,
      modify_number: 0,
      starting: false,
      votes_A: 0,
      votes_B: 0,
      votes_C: 0,
      votes_D: 0
    };
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleActionChange = this.handleActionChange.bind(this);
    this.handleActionChange = this.handleActionChange.bind(this);
    this.handleModifyChange = this.handleModifyChange.bind(this);
    this.updateOption = this.updateOption.bind(this);
    this.updateModify = this.updateModify.bind(this);
    this.clearVotes = this.clearVotes.bind(this);
  }

  componentDidMount() {
    this.getCurrentStatus();
  }
  //change handlers

  handleModifyChange(event) {
    this.setState({ modify_number: event.target.value });
  }
  handleActionChange = selected_action => {
    this.setState({ selected_action }, () =>
      console.log(`Action selected:`, this.state.selected_action)
    );
  };
  handlePeopleChange = selected_people => {
    this.setState({ selected_people }, () =>
      console.log(`People selected:`, this.state.selected_people)
    );
  };
  handleOptionChange = selected_option => {
    this.setState({ selected_option }, () =>
      console.log(`Option selected:`, this.state.selected_option)
    );
  };
  handleStateChange(starting) {
    this.setState({ starting: starting }, () => {
      console.log(`Vote State:`, this.state.starting);
      this.putState();
      var interval = setInterval(() => {
        if (this.state.starting) {
          this.getCurrentVote();
        } else {
          clearInterval(interval);
        }
      }, 500);
    });
  }

  //api calls

  async getCurrentStatus() {
    console.log("Get current Status");
    await axios.get(url + "/currentStatus").then(res => {
      console.log(res);
      if (res.data.currentMatch === "") {
        console.log("init new");
        this.initNewRound();
        this.initMode();
      } else {
        console.log("loading back");
        this.getCurrentMode();
        this.getCurrentVote();
        this.setState({ starting: res.data.state });
      }
    });
  }

  async initNewRound() {
    await axios.post(url + "/initVotes").then(res => {
      if (res.status === "success") {
        console.log("current match: " + res.currentMatch);
      }
    });
  }

  async initMode() {
    await axios.post(url + "/initMode").then(res => {
      if (res.status === "success") {
        console.log("success");
        this.setState({ selected_option: this.state.options[2] });
      }
    });
  }

  async getCurrentVote() {
    await axios.get(url + "/currentVotes").then(res => {
      console.log(res);
      this.setState({
        votes_A: res.data.current_vote[0].A_vote,
        votes_B: res.data.current_vote[0].B_vote,
        votes_C: res.data.current_vote[0].C_vote,
        votes_D: res.data.current_vote[0].D_vote
      });
    });
  }

  async getCurrentMode() {
    console.log("get current mode");
    await axios.get(url + "/currentMode").then(res => {
      console.log(res);
      if (res.data[0].value === "1/2") {
        this.setState({ selected_option: this.state.options[0] });
      } else if (res.data[0].value === "1/3") {
        this.setState({ selected_option: this.state.options[1] });
      } else if (res.data[0].value === "1/4") {
        this.setState({ selected_option: this.state.options[2] });
      } else {
        this.setState({ selected_option: this.state.options[2] });
        console.log("ERROR: get invalid current Mode");
        console.log(res);
      }
    });
  }

  putVote(votes) {
    console.log("voteput");
    console.log(votes);
    axios.put(url + "/modifyVotes", votes).then(res => {
      console.log(res);
      console.log("votes updated");
    });
  }

  async putVotingMode(mode) {
    await axios
      .put(url + "/changeMode", mode)
      .then(res => {
        console.log(res);
        console.log("voting mode updated");
      })
      .catch(function(error) {
        console.log("Error on Authentication");
      });
  }

  async putState() {
    await axios
      .put(url + "/changeState", { state: this.state.starting })
      .then(res => {
        if (res.status === "success") {
          console.log("state changed to " + this.state.starting);
        }
      });
  }

  //button changes
  updateOption() {
    console.log("Option Updated: ");
    console.log(this.state.selected_option);
    this.putVotingMode(this.state.selected_option);
  }

  async updateModify() {
    let modify = await (() => {
      console.log("Votes Modified");
      console.log(this.state.selected_action);
      console.log(this.state.selected_people);
      console.log(this.state.modify_number);
      if (this.state.selected_action.value === "add") {
        console.log("ad");
        switch (this.state.selected_people.value) {
          case "A":
            this.setState({
              votes_A:
                parseInt(this.state.votes_A) +
                parseInt(this.state.modify_number)
            });
            break;
          case "B":
            this.setState({
              votes_B:
                parseInt(this.state.votes_B) +
                parseInt(this.state.modify_number)
            });
            break;
          case "C":
            this.setState({
              votes_C:
                parseInt(this.state.votes_C) +
                parseInt(this.state.modify_number)
            });
            break;
          case "D":
            this.setState({
              votes_D:
                parseInt(this.state.votes_D) +
                parseInt(this.state.modify_number)
            });
            break;
          default:
            console.log("select people");
            break;
        }
      } else if (this.state.selected_action.value === "replace") {
        console.log("r");
        switch (this.state.selected_people.value) {
          case "A":
            this.setState({ votes_A: parseInt(this.state.modify_number) });
            break;
          case "B":
            this.setState({ votes_B: parseInt(this.state.modify_number) });
            break;
          case "C":
            this.setState({ votes_C: parseInt(this.state.modify_number) });
            break;
          case "D":
            this.setState({ votes_D: parseInt(this.state.modify_number) });
            break;
          default:
            console.log("select people");
            break;
        }
      } else {
        console.log("select action");
      }
    });
    let clr = await (() => {
      this.setState({
        selected_action: null,
        selected_people: null,
        modify_number: 0
      });
    });
    modify();
    await this.putVote({
      votes_A: this.state.votes_A,
      votes_B: this.state.votes_B,
      votes_C: this.state.votes_C,
      votes_D: this.state.votes_D
    });
    clr();
  }
  clearVotes() {
    console.log("Votes Cleared");
    this.setState({
      votes_A: 0,
      votes_B: 0,
      votes_C: 0,
      votes_D: 0
    });
    this.initNewRound();
  }
  render() {
    return (
      <div className="App">
        <header>
          <h3>Waterloo Idol Final 2019 Admin Control Panel</h3>
        </header>

        <div className="voting-mode">
          <header>
            <h3>当前投票模式:</h3>
          </header>

          <div className="select-container">
            <Select
              value={this.state.selected_option}
              options={this.state.options}
              className="selections"
              onChange={this.handleOptionChange}
            />
          </div>
          <button onClick={this.updateOption}>更新模式</button>
        </div>

        <div className="modify-votes">
          <header>
            <h3>更改票数</h3>
          </header>
          <div className="select-container">
            <Select
              value={this.state.selected_action}
              options={this.state.actions}
              className="selections"
              onChange={this.handleActionChange}
            />
            <Select
              value={this.state.selected_people}
              options={this.state.people}
              className="selections"
              onChange={this.handlePeopleChange}
            />
            <input
              type="number"
              value={this.state.modify_number || 0}
              onChange={this.handleModifyChange}
            />
            <button onClick={this.updateModify}>更新票数</button>
          </div>
        </div>

        <div className="voting-state">
          <header>
            <h3>投票状态</h3>
          </header>
          <label>
            <span>开始投票</span>
            <Switch
              onChange={this.handleStateChange}
              checked={this.state.starting}
            />
          </label>
          <button onClick={this.clearVotes}>清空票数</button>
        </div>

        <div className="votign-state">
          <header>
            <h3>当前票数</h3>
          </header>
          <ul>A {this.state.votes_A}</ul>
          <ul>B {this.state.votes_B}</ul>
          <ul>C {this.state.votes_C}</ul>
          <ul>D {this.state.votes_D}</ul>
        </div>
      </div>
    );
  }
}

export default App;
