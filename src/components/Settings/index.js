import React, { Component } from 'react';
import {Grid, Row, Col, Button} from 'react-bootstrap';
import './index.css';


export default class Settings extends Component {
    constructor(props) {
      super(props);
      this.state = {
        copied: false,
        groupAdmin: 0,
        groupName: "None",
        role: "None"
      }
    }

    componentDidMount() {
    	let groupID = this.props.groupID;
    	let groups = this.props.database.ref().child("groups");
	    groups.on('value', data => {
	      let groupAdmin = 0;
	      let groupName = "None";
	      data.forEach(elem => {
	        if (elem.val().groupID === groupID) {
	          groupAdmin = elem.val().groupAdmin;
	          groupName = elem.val().groupName;
	        }
	      });
	      this.setState({
	        groupAdmin: groupAdmin,
	        groupName: groupName,
	      })
	    });
    }

    handleLeaveGroup() {
      let ref = this.props.database.ref().child('users/');
      let updates = {};
      updates[this.props.user.uid + '/groupID'] = {};
      ref.update(updates);
    }

    handleShareCodeButtonClicked() {
      const el = document.createElement('textarea');
      el.value = this.props.groupID;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      this.setState({ copied: true });
      return;
    }

    render() {
    	let groupID = this.props.groupID;
    	let personsInGroup = this.props.personsInGroup;
		  let groupName = this.state.groupName;

	    let groupMembers = []
    	personsInGroup.forEach(elem => {
    		groupMembers.push(elem.name);
    	});
    	let groupMembersList = groupMembers.join(", ");

    	if (!groupID) groupID = '000000';

    	let copiedText = this.state.copied ? 'copied!' : 'tap to copy';

        return(
          <div id="Settings">
              <Grid>
                  <Row>
                    <h1>Hello, {this.props.user.displayName.split(" ")[0]}!</h1>
                  </Row>
                  <Row>
                    <h2>Invitation code</h2>
                    <p>Share this code with anyone you want to join your household.</p>
                    <Col onClick={() => this.handleShareCodeButtonClicked()} id="group-join-code">
                      {groupID.substr(groupID.length - 6).toUpperCase()}
                    </Col>
                    <center id="faded">{copiedText}</center>
                  </Row>
                  <Row>
                  	<h2>Your Group</h2>
                    <h4>"{groupName}""</h4>
                    <p>Group Members: {groupMembersList}</p>
                  </Row>
                <Row>
                  <h2>Admin Buttons</h2>
                  <Col xs={6}>
                    <Button
                      size="xs"
                      onClick={() => this.handleLeaveGroup()}
                    >
                      Leave Group
                    </Button>
                  </Col>
                  <Col xs={6}>
                    <Button
                      size="xs"
                      className="pull-right"
                      onClick={() => this.props.handleLogOut()}
                    >
                      Log Out
                    </Button>
                  </Col>
                </Row>
              </Grid>
            </div>
          );
    }
}
