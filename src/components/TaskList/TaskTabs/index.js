import React, { Component } from "react";
import { Tabs, Tab } from "react-bootstrap";
import TaskItem from "./TaskItem";
import TaskCreationForm from "./TaskCreationForm";
import "./index.scss";
/*import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';*/

export default class TaskTabs extends Component {
    constructor(props) {
      super(props)
      this.state = {
        group_tasks: [],
      };
    }

    componentDidMount(prevProps) {
      this.getGroupTasks();
    }

    componentDidUpdate(prevProps) {
      if (prevProps.groupID !== this.props.groupID) {
        this.getGroupTasks();
      }
    }

    getGroupTasks() {
      let ref = this.props.database.ref('taskList/');
      ref.orderByChild("groupID").equalTo(this.props.groupID).on("value", (data) => {
        let group_tasks = [];
        data.forEach((child) => {
            group_tasks.push(child.val());
        });
        group_tasks.sort((a,b) => { return a.taskDate - b.taskDate; });
        this.setState({
            group_tasks: group_tasks,
        })
      });
    }

    render() {
      let activeTab = this.props.activeTab;
      let tabNames = ["Active", "My Active", "Complete"];
      let render_tasks = [];
      let currUser = this.props.personsInGroup.find(person => {
        return person.uid === this.props.user.uid;
      });

      switch (activeTab) {
        case 0: // active
          render_tasks = this.state.group_tasks.filter(
            task => !task.isComplete && !task.isDeleted && task.taskType !== 'Event'
          );
          break;
        case 1: // assigned to me
          render_tasks = this.state.group_tasks.filter(task => {
            if (!task.assignedTo) return false;
            return (
              task.assignedTo.indexOf(currUser.uid) > -1 &&
              !task.isComplete &&
              !task.isDeleted &&
              task.taskType !== 'Event'
            );
          });
          break;
        case 2: // completed
          render_tasks = this.state.group_tasks.filter(
            task => task.isComplete && !task.isDeleted && task.taskType !== 'Event'
          );
          break;
        default:
          break;
      }

      let task_items = render_tasks.map(task => {
        return (
          <TaskItem
            key={task.taskID}
            task={task}
            user={this.props.user}
            handleTaskCompleted={() => this.props.handleTaskCompleted(task)}
            handleDeleteTask={t => this.props.handleDeleteTask(t)}
            groupID={this.props.groupID}
            personsInGroup={this.props.personsInGroup}
            handleTaskSubmission={t => this.props.handleTaskSubmission(t)}
            handleTaskCreationClose={() => this.props.handleTaskCreationClose()}
          />
        );
      });

      if (!task_items.length) task_items = <p>There are no tasks currently.</p>;

      let tabs = tabNames.map((name, i) => {
        return (
          <Tab title={name} key={name} eventKey={i} className="a-tab">
            {task_items}
          </Tab>
        );
      });

      let taskCreationForm = this.props.taskCreation ? (
        <TaskCreationForm
          taskID={null}
          groupID={this.props.groupID}
          task={null}
          user={this.props.user}
          personsInGroup={this.props.personsInGroup}
          type={this.props.taskCreation}
          database={this.props.database}
          handleTaskSubmission={task => this.props.handleTaskSubmission(task)}
          handleTaskCreationClose={() => this.props.handleTaskCreationClose()}
        />
      ) : (
        <div />
      );

      return (
        <div id="tabList">
          <Tabs
            id="TaskTabs"
            activeKey={activeTab}
            onSelect={t => this.props.handleTabPress(t)}
            animation={false}
          >
            {taskCreationForm}
            {tabs}
          </Tabs>
        </div>
      );
    }
}
