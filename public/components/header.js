import React from 'react';
// import Modal from '../js/modal';

let Header = React.createClass({

    modalOpen: function() {
        this.refs.modal.style.display = "block";
        this.refs.projectName.value = '';
        this.refs.projectName.focus();
    },

    // When the user clicks on <span> (x), close the modal
    modalClose: function() {
        this.refs.modal.style.display = "none";
    },

    // When the user clicks anywhere outside of the modal, close it
    modalCloseOutside: function(event) {
        if (event.target == this.refs.modal) {
            this.refs.modal.style.display = "none";
        }
    },

    createAndClose: function(event) {
        this.createProject();
        this.modalClose();
    },

    createProject: function() {
        let self = this;
        let projectName = JSON.stringify({projectName: this.refs.projectName.value});
        fetch('/app/createProject', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: projectName,
            credentials: 'include'
        }).then(function(res) {
            // return res.json();
            self.props.getProjectsInfo();
        }).catch(function(err) {
            console.log(`>>err: ${err}`);
        });
    },

    render: function() {
        if (this.props.user.isManager) {
            return (
                <div className="header">
                    <div className="wrapper">

                        <span>{this.props.user.firstName}&ensp;{this.props.user.lastName}</span>

                        <div className="header-buttons">

                            {/* <!-- Trigger/Open The Modal --> */}
                            <button ref="btn" onClick={this.modalOpen} className="short-btn button">Add Project</button>

                            {/* <!-- The Modal --> */}
                            <div ref="modal" onClick={this.modalCloseOutside} className="modal">

                                {/* <!-- Modal content --> */}
                                <div className="modal-content form">
                                    <div className="modal-header">
                                        <h4>Add new project</h4>
                                        {/* <span ref="span" onClick={this.modalClose} className="close">&times;</span> */}
                                    </div>
                                    <div className="modal-body">
                                        <input className="modal-input" ref="projectName" type="text" placeholder="Project Name" autoFocus/>
                                        <button className="button modal-button" onClick={this.createAndClose}>Add</button>
                                    </div>
                                    {/* <div className="modal-footer">
                            </div> */}
                                </div>

                            </div>

                            <form action="/logout" method="post" className="logout-form">
                                <button type="submit" className="short-btn button">Logout</button>
                            </form>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="header">
                    <h3>Hello, {this.props.user.firstName}
                        {this.props.user.lastName}</h3>
                    <form action="/logout" method="post" className="logout-form">
                        <button type="submit" className="logout-btn button">Logout</button>
                    </form>
                </div>
            );
        }
    }
});

export default Header;
