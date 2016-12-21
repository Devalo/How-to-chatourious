import {Socket, Presence} from "phoenix"

let socket = new Socket("/socket", {
  params: {token: window.userToken}})

socket.connect()
let channel = socket.channel("room", {})
let message = $('#message-input')
let chatMessages = document.getElementById("chat-messages")
let presences = {}
let onlineUsers = document.getElementById("online-users")

let listUsers = (user) => {
  return {
    user: user
  }
}
let renderUsers = (presences) => {
  onlineUsers.innerHTML = Presence.list(presences, listUsers)
  .map(presence => `
    <li>${presence.user}</li>`).join("")
}

message.focus();

message.on('keypress', event => {
  if(event.keyCode == 13) {
    channel.push('message:new', {message: message.val()})
    message.val("")
  }
});

channel.on('message:new', payload => {
  let template = document.createElement("div");
  template.innerHTML = `<b>${payload.user}</b>: ${payload.message}<br>`

  chatMessages.appendChild(template);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

channel.on('presence_state', state => {
  presences = Presence.syncState(presences, state)
  renderUsers(presences)
});

channel.on('presence_diff', diff => {
  presences = Presence.syncDiff(presences, diff)
  renderUsers(presences)
});

channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) })

export default socket
