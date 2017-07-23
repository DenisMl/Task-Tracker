import React from 'react';
import Task from '../components/task';

let Project = React.createClass({

    modalOpen: function(event) {
        event.stopPropagation();
        this.refs.modal.style.display = "block";
        this.refs.taskName.value = '';
        this.refs.taskName.focus();
    },

    modalClose: function() {
        this.refs.modal.style.display = "none";
    },

    modalCloseOutside: function(event) {
        event.stopPropagation();
        if (event.target == this.refs.modal) {
            this.refs.modal.style.display = "none";
        }
    },

    createAndClose: function(event) {
        this.createTask();
        this.modalClose();
    },

    createTask: function() {
        let self = this;
        let task = JSON.stringify({taskName: this.refs.taskName.value, projectId: this.props.project._id});
        fetch('/app/createTask', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: task,
            credentials: 'include'
        }).then(function(res) {
            self.props.getProjectsInfo();
            // console.log(res.json());
        }).catch(function(err) {
            console.log(`>>err: ${err}`);
        });
    },

    deleteProject: function() {
        let self = this;
        let projectId = JSON.stringify({projectId: this.props.project._id});
        fetch('/app/deleteProject', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: projectId,
            credentials: 'include'
        }).then(function(res) {
            self.props.getProjectsInfo();
        }).catch(function(err) {
            console.log(`>>err: ${err}`);
        });
    },

    hideTasks: function() {
        this.refs.tasksBox.style.display = "none";
        this.setState({tasksShown: false});

    },

    showTasks: function() {
        if (this.props.project.tasks.length) {
            if (this.state.tasksShown) {
                this.refs.tasksBox.style.display = "none";
                this.setState({tasksShown: false});

            } else {
                this.props.closeAllTasks();
                this.refs.tasksBox.style.display = "flex";
                this.setState({tasksShown: true});
            }
        }
    },


    getInitialState: function() {
        return {
            tasksShown: false,
            // pojectChosen: false
        };
    },

    renderTask: function(task, i) {
        return (
            <Task key={i} task={task} parentProject={this.props.project} getProjectsInfo={this.props.getProjectsInfo} />
        );
    },

    render: function() {
        return (
            <div>
                <div ref="project" className={"project " + (this.state.tasksShown ? 'project-chosen' : 'project-unchosen')} onClick={this.showTasks}>
                    <span>{this.props.project.projectName}:&ensp;
                        <span>{this.props.project.tasks.length}&ensp;tasks</span>
                    </span>
                    <span ref="span" onClick={this.deleteProject} className="sign close">&times;</span>

                    {/* <!-- Trigger/Open The Modal --> */}
                    <span ref="span" onClick={this.modalOpen} className="sign plus">+</span>

                    {/* <!-- The Modal --> */}
                    <div ref="modal" onClick={this.modalCloseOutside} className="modal">

                        {/* <!-- Modal content --> */}
                        <div className="modal-content form">
                            <div className="modal-header">
                                <h4>Add new Task</h4>
                            </div>
                            <div className="modal-body">
                                <input className="modal-input" ref="taskName" type="text" placeholder="Task Name" autoFocus/>
                                <button className="button modal-button" onClick={this.createAndClose}>Add</button>
                            </div>
                        </div>

                    </div>

                </div>
                <div ref="tasksBox" className="tasks-box">
                    <div className="tasks-wrapper">
                        {this.props.project.tasks.map(this.renderTask)}

                    </div>
                </div>
            </div>
        );
    }
});

export default Project;
