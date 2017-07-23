// import { Router, Route, hashHistory, RouteHandler } from 'react-router';

import React from 'react';
import ReactDOM from "react-dom";

import Project from '../components/project';
import Header from '../components/header';
// import UserList from '../containers/user-list';

let App = React.createClass({
    // self: this,

    getInitialState: function() {
        return {
            user: {
                email: '',
                firstName: '',
                lastName: '',
                isManager: ''
            },
            projects: []
            // project: {
            //     projectName: '',
            //     author: '',
            //     developers: '',
            //     tasks: {},
            //     created: ''
            // }
        };
    },

    getUserInfo: function() {
        let self = this;
        fetch('/app/getUserInfo', {
            method: 'get',
            dataType: 'json',
            credentials: 'include'
        }).then(function(res) {
            return res.json();
        }).then(function(res) {
            self.setState({user: res});
        }).catch(function(err) {
            console.log(`>>err: ${err}`);
        });
    },

    getProjectsInfo: function() {
        let self = this;
        fetch('/app/getProjectsInfo', {
            method: 'get',
            dataType: 'json',
            credentials: 'include'
        }).then(function(res) {
            return res.json();
        }).then(function(res) {
            self.setState({projects: res});
            // console.log(`getProjectsInfo:`);
            // console.log(self.state.projects);
        }).catch(function(err) {
            console.log(`>>err: ${err}`);
        });
    },


    componentDidMount: function() {
        // this.getProjectsInfo = this.getProjectsInfoVirt.bind(this);
        // this.getUserInfo = this.getUserInfoVirt.bind(this);

        this.getUserInfo();
        this.getProjectsInfo();
    },

    showTasks: function(event) {
        // if (this.props.project.tasks.length) {//TODO: event props and state is needed
        //OR: handle this method in Project but close all in App using method of Project
        // OR: FUCKING RERENDER ALL PROJECTS!!!
        //     if (this.state.tasksShown) {
        //         this.refs.tasksBox.style.display = "none";
        //         this.state.tasksShown = false;
        //     } else {
        //         this.refs.tasksBox.style.display = "flex";
        //         this.state.tasksShown = true;
        //         // this.refs.project.scrollIntoView();
        //     }
        // }
    },

    closeAllTasks: function() {
        // console.log(this.refs.project0);
        for (let i = 0; i < this.state.projects.length; i++) {
            let projectRef = 'project' + i;
            this.refs[projectRef].hideTasks();
        }
    },

    renderProject: function(project, i) {
        let ref = 'project' + i;
        return (
            <Project ref={ref} key={i} index={i} project={project} getProjectsInfo={this.getProjectsInfo} showTasks={this.showTasks} closeAllTasks={this.closeAllTasks}/>
        );
    },

    render: function() {
        return (
            <div>

                <Header user={this.state.user} getProjectsInfo={this.getProjectsInfo} />

                <main>
                    <div className="project-box">
                        {this.state.projects.map(this.renderProject)}
                    </div>
                </main>

            </div>
        );
    }
});

ReactDOM.render(
    <App/>, document.getElementById('root'));
