import React, {Component} from 'react';

class Button extends Component {
    constructor(props){
        super(props);
        this.state = {value: this.props.value};
        
    }
    render(){
        return(
            <button className="voting-button">{this.props.value}</button>
        )
    }
}

export default Button;