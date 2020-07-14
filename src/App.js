import React, { Component } from "react";
import firebase from "./util/firebase";
import Message from "./components/message.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: [], newMessage: "" }; // <- set up react state

    this.deleteMessage = this.deleteMessage.bind(this);
    this.editMessage = this.editMessage.bind(this);
  }
  componentDidMount() {
    /* Create reference to messages in Firebase Database */
    let messagesRef = firebase
      .database()
      .ref("messages")
      .orderByKey()
      .limitToLast(100);

    messagesRef.on("value", (snapshot) => {
      // console.log(messagesRef);
      //   /* Update React state when message is added at Firebase Database */
      const unfilteredMessages = snapshot.val();

      console.log(unfilteredMessages);
      const messages = [];

      for (let id in unfilteredMessages) {
        messages.push({ id, ...unfilteredMessages[id] });
      }
      console.log(messages);
      this.setState({ messages: messages });
    });
  }

  addMessage(e) {
    e.preventDefault(); // <- prevent form submit from reloading the page
    /* Send the message to Firebase */
    const input = { text: this.state.newMessage };
    console.log(input);
    firebase.database().ref("messages").push(input);
    this.setState({ newMessage: "" }); // <- clear the input
    e.target.reset();
  }

  handleChange = (event) => {
    this.setState({ newMessage: event.target.value });
  };

  editMessage(message, collection) {
    console.log(message.text);

    const editRef = firebase.database().ref(collection).child(message.id);
    editRef.update({ text: message.text });
  }


  /*
  const rootRef = firebase.database().ref();

  const searchRef = rootRef.child("messages").orderByChild("text").startAt("D").endAt('D/uf8ff);
  searchRef= rootRef.child("messages").orderByChild("text").equalTo("Some text")

  searchRef= rootRef.child("messages").orderByChild("text_otherThing").equalTo("Some text_thing")

*/

  deleteMessage(message, collection) {
    //Delete the message off of Firebase
    const deleteRef = firebase.database().ref(collection).child(message.id);
    deleteRef.remove();

    //
    // const request = new Request(message.id, collection);
    // request.delete();
    // Removes the message from react state
    const changedMessages = this.state.messages;
    console.log(changedMessages);
    console.log("looking for", message);
    if (changedMessages.includes(message)) {
      console.log("found", message);
      const index = changedMessages.indexOf(message);
      changedMessages.splice(index, 1);
      this.setState({ messages: changedMessages });
    }
  }

  render() {
    return (
      <>
        <form onSubmit={this.addMessage.bind(this)}>
          <input type="text" name="text" onChange={this.handleChange} />
          <input type="submit" />
        </form>
        <ul>
          {
            /* Render the list of messages */
            this.state.messages.map((message) => {
              return (
                <Message
                  message={message}
                  key={message.id}
                  deleteMessage={this.deleteMessage}
                  editMessage={this.editMessage}
                />
              );
            })
          }
        </ul>
      </>
    );
  }
}

export default App;
