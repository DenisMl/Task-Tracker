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

    renderProject: function(project, i) {
        return (
            <Project key={i} project={project} getProjectsInfo={this.getProjectsInfo}></Project>
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
