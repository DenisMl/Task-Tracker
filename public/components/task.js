import React from 'react';


let Task = React.createClass({

    deleteTask: function() {
        console.log('deleteTask');
        console.log(this.props.task._id);
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
            console.log(`>>err: ${err}`);
        });
    },

    renderTask: function(task, i) {
        return (
            <Task key={i} task={task}></Task>
        );
    },

    render: function() {
        return (
            <div className="task">
                <span>{this.props.task.taskName}</span>
                <span ref="span" onClick={this.deleteTask} className="sign close">&times;</span>

            </div>
        );
    }
});

export default Task;
