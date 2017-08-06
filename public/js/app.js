import React from 'react';
import ReactDOM from "react-dom";

import Project from '../components/project';
import Header from '../components/header';

let App = React.createClass({

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
        }).then(function(res) {
            self.getProjectsInfo();
        }).catch(function(err) {
            console.log(`>>err: ${err}`);
        });
    },

    getProjectsInfo: function() {
        let self = this;
        let body = JSON.stringify({isManager: this.state.user.isManager});
        fetch('/app/getProjectsInfo', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: body,
            credentials: 'include'
        }).then(function(res) {
            return res.json();
        }).then(function(res) {
            self.setState({projects: res});
        }).catch(function(err) {
            console.log(`>>err: ${err}`);
        });
    },

    closeAllTasks: function() {
        for (let i = 0; i < this.state.projects.length; i++) {
            let projectRef = 'project' + i;
            this.refs[projectRef].hideTasks();
        }
    },

    closeAllDescriptions: function() {
        let taskChosen = document.getElementsByClassName("task-chosen");
        if (taskChosen.length) {
            taskChosen[0].classList.add('task-unchosen');
            taskChosen[0].classList.remove('task-chosen');
        }
    },

    renderProject: function(project, i) {
        let ref = 'project' + i;
        return (<Project ref={ref} key={i} index={i} user={this.state.user} project={project} closeAllDescriptions={this.closeAllDescriptions} getProjectsInfo={this.getProjectsInfo} closeAllTasks={this.closeAllTasks}/>);
    },

    getInitialState: function() {
        return {
            user: {
                email: '',
                firstName: '',
                lastName: '',
                isManager: ''
            },
            projects: []
        };
    },

    render: function() {
        return (
            <div>

                <Header user={this.state.user} getProjectsInfo={this.getProjectsInfo}/>

                <main>
                    <div className="project-box">
                        {this.state.projects.map(this.renderProject)}
                    </div>
                </main>

            </div>
        );
    },

    componentDidMount: function() {
        this.getUserInfo();
    }
});

ReactDOM.render(
    <App/>, document.getElementById('root'));
