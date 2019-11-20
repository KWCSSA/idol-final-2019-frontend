import React, {Component} from 'react';
import axios from 'axios';
import cookie from 'react-cookies'
import './App.css';

const url = "http://localhost:9898";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      candidate: '',
      state: '',
      id: '',
      availableCandidate: [],
      matchID: '',
      mode: '',
      hidden: false,
      voteSuccess: true,
      msg: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.idSubmit = this.idSubmit.bind(this);
    this.idChange = this.idChange.bind(this);
  }

  componentDidMount() {
    var self = this;
    setInterval(getInfo, 500);
    function getInfo() {
      axios.get(url + "/currentMode")
        .then((res) => {
          self.setState({mode: res.data[0].value});
          return axios.get(url + "/currentStatus");
        }).then((res) => {
          self.setState({state: res.data.state});
          // console.log(res.data);
        });
    }
  }

  componentWillMount(){
    if (cookie.load('id') && cookie.load('id') !== "") this.setState({hidden: true})
  }

  handleChange(event) {
    var id = event.target.id;
    if (id === "1" || id === "2" || id === "3" || id === "4"){
      this.setState({voteCandidate: id});
    } else if (id === "vote"){
      axios({
        method: 'post',
        url: url + "/voteCandidate", // change here
        data: {
          id: cookie.load('id'),
          matchID: this.state.matchID,
          candidate: this.state.voteCandidate,
          time: Date.now()
        }
      }).then(res => {
        if (res.data.status === "success") {
          alert("投票成功！");
        } else {
          alert("投票失败" + res.data.status);
        }
      }); 
    }
  }

  idSubmit(e){
    e.preventDefault();
    axios({
      method: 'post',
      url: url + "/login", // change here
      data: {
        id: this.state.id
      }
    }).then(res => {
      console.log(res.data);
      if (res.data.status === "success"){
        cookie.save('id', this.state.id, { path: '/' });
        this.setState({hidden: true});
      } else if (res.data.status === "id not found"){
        alert("ID is not found");
      } else if (res.data.status === "already logged in"){
        alert("already logged in");
      }
    });
  }

  idChange(e){
    e.preventDefault();
    this.setState({id: e.target.value});
  }

  render(){
    return (
      <div>
        {/* <div id="textMessage" text={this.state.msg} /> */}
        <Login hidden={this.state.hidden} idSubmit={this.idSubmit} idChange={this.idChange} id={this.state.id}/>
        <Body hidden={!this.state.hidden} handleChange={this.handleChange} />
      </div>
    );
  }
}

class Body extends Component {
  constructor(props){
    super(props);
  }
  render(){
    return(
      <div className={this.props.hidden ? 'hidden' : 'App'}>
        <header id="title"><strong>Waterloo Idol Final 2019 Voting Page</strong></header>
        <div className="row">
        </div>
        <div className="row">
          <button className="voting-button" onClick={this.props.handleChange} id="1">1</button>
        </div>
        <div className="row">
          <button className="voting-button" onClick={this.props.handleChange} id="2">2</button>
        </div>
        <div className="row">
          <button className="voting-button" onClick={this.props.handleChange} id="3">3</button>
        </div>
        <div className="row">
          <button className="voting-button" onClick={this.props.handleChange} id="4">4</button>
        </div>
        <div className="row">
          <button className="voting-button" onClick={this.props.handleChange} id="vote">vote</button>
        </div>
      </div>
    )
  }
}

class Login extends Component {
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div className={this.props.hidden ? "hidden" : "login"}>
        <form onSubmit={this.props.idSubmit}>
          <div className="row" id="form-label">
            <label >Authentification</label>
          </div>
          <div className="row" id="form-input">
            <input type="text" value={this.props.id} onChange={this.props.idChange} />
          </div>
          <div className="row" id="form-button">
            <input type="submit" value="Submit" />
          </div>
        </form>
      </div>
    )
  }
}

export default App;
