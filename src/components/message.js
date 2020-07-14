import React, { Component } from "react";

class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editText: "",
    };

    this.editMessage = this.editMessage.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
  }
  handleChange = (event) => {
    this.setState({ editText: event.target.value });
  };

  editMessage(e) {
    e.preventDefault();
    const newMessage = { id: this.props.message.id, text: this.state.editText };
    this.props.editMessage(newMessage, "messages");
    this.setState({ editText: "" });
    e.target.reset();
  }
  deleteMessage() {
    this.props.deleteMessage(this.props.message, "messages");
    console.log("I've been Clicked");
  }
  render() {
    return (
      <>
        <li key={this.props.message.id}>
          id:{this.props.message.id}
          <br></br>
          text: {this.props.message.text}
          <form onSubmit={this.editMessage}>
            <input type="text" name="text" onChange={this.handleChange} />
            <input type="submit" value="Edit" />
          </form>
          <button onClick={this.deleteMessage}> Delete</button>
        </li>
      </>
    );
  }
}
export default Message;
