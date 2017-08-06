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

    //devModal

    devsModalOpen: function(event) {
        event.stopPropagation();
        this.refs.devsModal.style.display = "block";
        // this.setState({devsList: []});
        this.selectedDevelopers = {};
        this.loadDevs();
    },

    devsModalClose: function() {
        this.refs.devsModal.style.display = "none";
        this.selectedDevelopers = {};

    },

    devsModalCloseOutside: function(event) {
        event.stopPropagation();
        if (event.target == this.refs.devsModal) {
            this.refs.devsModal.style.display = "none";
            this.selectedDevelopers = {};
        }
    },

    devsModalAddAndClose: function(event) {
        this.addDevToProject();
        this.devsModalClose();
    },

    getAllDevs: function(projectId) {
        let self = this;
        fetch('/app/getAllDevs', {
            method: 'get',
            dataType: 'json',
            credentials: 'include'
        }).then(function(res) {
            return res.json();
        }).then(function(res) {
            self.setState({devsList: res});
            return res;
        }).catch(function(err) {
            console.error(`>>err: ${err}`);
        });
    },

    addDevToProject: function() {
        let self = this;
        let devsId = Object.keys(this.selectedDevelopers);
        // console.log(devsId);
        let dev = JSON.stringify({devsId: devsId, projectId: this.props.project._id});
        fetch('/app/addDevToProject', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: dev,
            credentials: 'include'
        }).then(function(res) {
            return res.json();
        }).then(function(res) {
            // console.log(res);
            self.getProjectDevelopers(res);
            self.props.getProjectsInfo();
        }).catch(function(err) {
            console.error(`>>err: ${err}`);
        });
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
        }).catch(function(err) {
            console.error(`>>err: ${err}`);
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
            console.error(`>>err: ${err}`);
        });
    },

    getProjectDevelopers: function(projectDevelopers) {
        let self = this;
        let projectDevelopersIDs = JSON.stringify({projectDevelopers: projectDevelopers});
        fetch('/app/getProjectDevelopers', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: projectDevelopersIDs,
            credentials: 'include'
        }).then(function(res) {
            return res.json();
        }).then(function(res) {
            self.setState({projectDevelopers: res});

            return res;
        }).catch(function(err) {
            console.error(`>>err: ${err}`);
        });
    },

    hideTasks: function() {
        this.refs.tasksBox.style.display = "none";
        this.setState({tasksShown: false});

    },

    showTasks: function(event) {
        event.stopPropagation();
        if (this.state.tasksShown) {
            this.refs.tasksBox.style.display = "none";
            this.setState({tasksShown: false});

        } else {
            this.props.closeAllTasks();
            this.refs.tasksBox.style.display = "block";
            this.setState({tasksShown: true});
        }
    },

    changeDevSelection: function(event) {
        event.stopPropagation;
        let devId = event._targetInst._currentElement.props["data-devId"];
        if (this.selectedDevelopers[devId]) { //unselect
            delete this.selectedDevelopers[devId];
            event.target.classList.remove('selected');
        } else {
            this.selectedDevelopers[devId] = true;
            event.target.classList.add('selected');
        }
    },

    selectedDevelopers: {},

    renderDevsList: function(dev, i) {
        return (
            <div key={i} data-devId={dev._id} className="modal-dev" onClick={this.changeDevSelection}>
                {dev.firstName}&ensp;{dev.lastName}
            </div>
        );
    },

    renderTask: function(task, i) {
        return (<Task key={i} user={this.props.user} task={task} devsList={this.state.projectDevelopers} closeAllDescriptions={this.props.closeAllDescriptions} parentProject={this.props.project} getProjectsInfo={this.props.getProjectsInfo}/>);
    },

    renderProjectDevelopers: function() {
        if (this.state.projectDevelopers.length) {
            return this.state.projectDevelopers.map(this.renderProjectDeveloper);
        } else {
            return (
                <div className="project-developer">
                    No one has been appointed yet...
                </div>
            );
        }
    },

    renderProjectDeveloper: function(dev, i) {
        return (
            <div className="project-developer" key={i}>
                {dev.firstName}&ensp;{dev.lastName}
            </div>
        );
    },

    renderSignsBox: function() {
        if (this.props.user.isManager) {
            return (
            <div className="signs-box">
                <span ref="span" onClick={this.deleteProject} className="sign close">&times;</span>
                <span ref="span" onClick={this.modalOpen} className="sign plus">+</span>
                <span ref="addDevToProject" onClick={this.devsModalOpen} className="sign addDev">
                    <i className="fa fa-user-plus add-dev" aria-hidden="true" onClick={this.devsModalOpen}></i>
                </span>
            </div>
            );
        } else {
            return (
            <div className="signs-box">
                <span ref="span" onClick={this.modalOpen} className="sign plus">+</span>
            </div>
            );
        }
    },

    getInitialState: function() {
        return {tasksShown: false, devsList: [], projectDevelopers: []};
    },

    componentDidMount: function() {
        this.getProjectDevelopers(this.props.project.developers);
        let projectId = this.props.project._id;
        this.getAllDevs(projectId);
    },

    render: function() {
        return (
            <div>
                <div ref="project" className={"project " + (this.state.tasksShown
                    ? 'project-chosen'
                    : 'project-unchosen')} onClick={this.showTasks}>

                    <h4 className="project-name">{this.props.project.projectName}</h4>
                    <span className="project-tasks-amount">
                        <span className="project-tasks-amount-number">{this.props.project.tasks.length}</span>
                    </span>

                    <i className="fa fa-angle-right" aria-hidden="true"></i>

                </div>
                <div ref="tasksBox" className="tasks-box">
                    <div className="tasks-box-header">
                        <div className="heading">
                            <div className="heading-text">
                                <h4>Project:&ensp;</h4>
                                <h3>"{this.props.project.projectName}"</h3>
                            </div>
                            {this.renderSignsBox()}
                        </div>
                        <div className="devs-box">
                            <p>Assigned developers</p>
                            <div className="project-devs-box">
                                {this.renderProjectDevelopers()}

                            </div>
                        </div>

                    </div>

                    <div className="tasks-wrapper">
                        {this.props.project.tasks.map(this.renderTask)}

                    </div>
                </div>

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

                {/* <!-- The developers Modal --> */}
                <div ref="devsModal" onClick={this.devsModalCloseOutside} className="modal">
                    {/* <!-- Modal content --> */}
                    <div className="modal-content form">
                        <div className="modal-header">
                            <h4>Add Developer</h4>
                        </div>
                        <div className="modal-body">
                            <div ref="devsList" className="devs-list">
                                {this.state.devsList.map(this.renderDevsList)}
                            </div>
                            <button className="button modal-button" onClick={this.devsModalAddAndClose}>Add</button>

                        </div>
                    </div>
                </div>

            </div>
        );
    }
});

export default Project;
