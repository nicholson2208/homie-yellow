import React, { Component } from "react";
import "./index.scss";
export default class UserSelectList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            payerUID: ""
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        console.log(e.target.value);
        this.setState({
            payerUID: e.target.value,
        })
        this.props.handlePayerSelection(e.target.value);
    }
    render() {
        let editAssignedField = this.props.personsInGroup.map(person => {
            if(person.uid !== this.props.user.uid) {
                return (
                <option value={person.uid}>
                    {person.name}
                </option>
                );
            }
          });
      return (
        <div>
          <label>
            Who needs to pay:
            <select value={this.state.payerUID} onChange={this.handleChange}>
                <option value=""> Click to select </option>
              {editAssignedField}
            </select>
          </label>
        </div>
      );
    }
  }
/*export default class UserSelectList extends Component {      
    render() {

        let editAssignedField = this.props.personsInGroup.map(person => {
            return (
              <span key={person.uid}>
                {person.name}
              </span>
            );
          });
        
        return (
            <div> {editAssignedField} </div>
                
        );
    }
}*/


