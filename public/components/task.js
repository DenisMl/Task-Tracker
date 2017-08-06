import React from 'react';

let Task = React.createClass({

    //devModal

    devsModalOpen: function(event) {
        event.stopPropagation();
        this.refs.devsModal.style.display = "block";
        this.selectedDevelopers = {};
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
        this.addDevToTask();
        this.devsModalClose();
    },

    showTaskDescription: function(event) {
        event.stopPropagation();
        if (event.target.classList.contains('chooseLabel')) {
            if (event.currentTarget.classList.contains('task-chosen')) {
                event.currentTarget.classList.remove('task-chosen')
            } else {
                this.props.closeAllDescriptions();
                event.currentTarget.classList.add('task-chosen')
            }
        }
    },

    deleteTask: function() {
        let self = this;
        let taskId = JSON.stringify({taskId: this.props.task._id, projectId: this.props.parentProject._id});
        fetch('/app/deleteTask', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: taskId,
            credentials: 'include'
        }).then(function(res) {
            self.props.getProjectsInfo();
        }).catch(function(err) {
            console.error(`>>err: ${err}`);
        });
    },

    addDevToTask: function() {
        let self = this;
        let devsId = Object.keys(this.selectedDevelopers);
        if (devsId.length) {
            let dev = JSON.stringify({taskId: this.props.task._id, devsId: devsId, projectId: this.props.parentProject._id});
            fetch('/app/addDevToTask', {
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
                self.getTaskDevelopers(res);
            }).catch(function(err) {
                console.error(`>>err: ${err}`);
            });
        }
    },

    getTaskDevelopers: function(taskDevelopers) {
        let self = this;
        let taskDevelopersIDs = JSON.stringify({taskDevelopers: taskDevelopers});
        fetch('/app/getTaskDevelopers', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: taskDevelopersIDs,
            credentials: 'include'
        }).then(function(res) {
            return res.json();
        }).then(function(res) {
            self.setState({taskDevelopers: res});
            return res;
        }).catch(function(err) {
            console.error(`>>err: ${err}`);
        });
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

    changeTaskStatus: function(event) {
        let self = this;
        let body = JSON.stringify({taskId: this.props.task._id, projectId: this.props.parentProject._id, status: event.target.value});
        fetch('/app/changeTaskStatus', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: body,
            credentials: 'include'
        }).then(function(res) {
            self.props.getProjectsInfo();
        }).catch(function(err) {
            console.error(`>>err: ${err}`);
        });
    },

    addComment: function() {
        let self = this;
        let body = JSON.stringify({taskId: this.props.task._id, projectId: this.props.parentProject._id, commentText: this.refs.commentText.value});
        fetch('/app/addComment', {
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
            let authorsIDs = Array.from(new Set(res));
            self.getCommentsAuthors(authorsIDs);
            self.refs.commentText.value = '';
        }).catch(function(err) {
            console.error(`>>err: ${err}`);
        });
    },

    getCommentsAuthors: function(authorsIDs) {
        let self = this;
        let body = JSON.stringify({authorsIDs: authorsIDs});
        fetch('/app/getCommentsAuthors', {
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
            let commentsAuthorsObj = {};
            res.map(function(author) {
                commentsAuthorsObj[author._id] = {
                    'firstName': author.firstName,
                    'lastName': author.lastName,
                    'isManager': author.isManager
                }
            });
            self.setState({commentsAuthors: commentsAuthorsObj});
            return res;
        }).then(function(res) {
            self.props.getProjectsInfo();
        }).catch(function(err) {
            console.error(`>>err: ${err}`);
        });
    },

    scrollCommentsToBottom: function() {
        let elements = document.querySelectorAll(".task-chosen .comments-box");
        if (elements.length) {
            elements[0].scrollTop = elements[0].scrollHeight;
        }
    },


    renderTaskDevelopers: function() {
        if (this.state.taskDevelopers.length) {
            return this.state.taskDevelopers.map(this.renderTaskDeveloper);
        } else {
            return (
                <div className="task-developer">
                    No one has been appointed yet...
                </div>
            );
        }
    },

    renderTaskDeveloper: function(dev, i) {
        return (
            <div className="task-developer" key={i}>
                {dev.firstName}&ensp;{dev.lastName}
            </div>
        );
    },

    renderDevsList: function(dev, i) {
        return (
            <div key={i} data-devId={dev._id} className="modal-dev" onClick={this.changeDevSelection}>
                {dev.firstName}&ensp;{dev.lastName}
            </div>
        );
    },

    renderStatus: function() {
        let status = this.props.task.status;
        switch (status) {
            case 'Waiting':
                return (
                    <span className="task-status task-status-box-waiting chooseLabel">
                        <span className="task-status-box-text chooseLabel">Waiting</span>
                    </span>
                );
                break;
            case 'Implementation':
                return (
                    <span className="task-status task-status-box-implementation chooseLabel">
                        <span className="task-status-box-text chooseLabel">Implement.</span>
                    </span>
                );
                break;
            case 'Verifying':
                return (
                    <span className="task-status task-status-box-verifying chooseLabel">
                        <span className="task-status-box-text chooseLabel">Verifying</span>
                    </span>
                );
                break;
            case 'Releasing':
                return (
                    <span className="task-status task-status-box-releasing chooseLabel">
                        <span className="task-status-box-text chooseLabel">Releasing</span>
                    </span>
                );
                break;
        }
    },

    renderComments: function() {
        if (this.props.task.comments.length) {
            return this.props.task.comments.map(this.renderComment);
        } else {
            return(
                <div className="no-comments-label">No comments yet...</div>
            );
        }
    },

    renderComment: function(comment, i) {
        if (Object.keys(this.state.commentsAuthors).length) {
            let date = new Date(comment.created);
            let isManager = this.state.commentsAuthors[comment.author].isManager;
            return (
                <div className="comment" key={i}>
                    <div className="comment-header">
                        <div className="comment-author">{this.state.commentsAuthors[comment.author].firstName}
                            &ensp; {this.state.commentsAuthors[comment.author].lastName}
                        </div>
                        <div className="comment-date">{date.getHours() + ':' + date.getMinutes() + '  ' + date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear()}</div>
                        {this.renderIsManager(isManager)}
                    </div>
                    <div className="comment-text">{comment.text}</div>
                </div>

            );
        }
    },

    renderIsManager: function(isManager) {
        if (isManager) {
            return(<div className="comment-ismanager">(Man.)</div>);
        } else {
            return(<div className="comment-isnotmanager">(Dev.)</div>);
        }
    },

    renderSignsBox: function() {
        if (this.props.user.isManager) {
            return (
                <div className="signs-box">
                    <span ref="span" onClick={this.deleteTask} className="sign close">&times;</span>
                    <span ref="addDevToTask" onClick={this.devsModalOpen} className="sign addDev">
                        <i className="fa fa-user-plus add-dev" aria-hidden="true" onClick={this.devsModalOpen}></i>
                    </span>
                </div>
            );
        } else {
            return (
                <div className="signs-box">
                    <span ref="span" onClick={this.deleteTask} className="sign close">&times;</span>
                </div>
            );
        }
    },

    selectedDevelopers: {},

    getInitialState: function() {
        return {descriptionShown: false, devsList: this.props.devsList, taskDevelopers: [], commentsAuthors: {}};
    },


    render: function() {
        return (
            <div className="task-wrapper task-unchosen" onClick={this.showTaskDescription}>
                <div className="task chooseLabel">
                    <span className="chooseLabel task-name">{this.props.task.taskName}</span>
                    <span className="task-status-box chooseLabel">
                        {this.renderStatus()}
                    </span>
                </div>

                <div ref="taskDescriptionBox" className="task-description-box">

                    <div className="top-box">


                        <div className="task-description-box-header">
                            <div className="heading">
                                <div className="heading-text">
                                    <h4 className="label">Task:&ensp;</h4>
                                    <h3>"{this.props.task.taskName}"</h3>
                                </div>
                                {this.renderSignsBox()}

                            </div>
                        </div>

                        <div className="devs-box">
                            <p>Assigned developers</p>
                            <div className="task-devs-box">
                                {this.renderTaskDevelopers()}
                            </div>

                        </div>
                        <p className="label">Task status:</p>
                        <select className="change-task-status" onChange={this.changeTaskStatus} name="task-status" defaultValue={this.props.task.status}>
                            <option value="Waiting">Waiting</option>
                            <option value="Implementation">Implementation</option>
                            <option value="Verifying">Verifying</option>
                            <option value="Releasing">Releasing</option>
                        </select>

                    </div>

                    <div className="main-box">

                        {/* //COMMENTS */}

                        <div className="comments-box-wrapper">
                            <p className="">Comments:</p>
                            <div className="comments-box">
                                {this.renderComments()}
                            </div>

                            <div className="comment-add">
                                <textarea className="add-comment-textarea" ref="commentText" placeholder="Write a comment..."></textarea>
                                <button className="add-comment-button" type="button" name="add-comment-button" onClick={this.addComment}>Send</button>
                            </div>

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
                                {this.props.devsList.map(this.renderDevsList)}
                            </div>
                            <button className="button modal-button" onClick={this.devsModalAddAndClose}>Add</button>

                        </div>
                    </div>
                </div>
                {this.scrollCommentsToBottom()}

            </div>

        );
    },

    componentDidMount: function() {
        this.getTaskDevelopers(this.props.task.developers);
        let authorsIDs = this.props.task.comments.map(function(comment) {
            return comment.author;
        });
        authorsIDs = Array.from(new Set(authorsIDs));
        this.getCommentsAuthors(authorsIDs);
    }

});


export default Task;
