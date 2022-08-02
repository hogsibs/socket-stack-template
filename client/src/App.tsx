import * as React from "react";
import { useCallback, useMemo, useReducer, useState } from "react";

export default () => {
  const [username, setUsername] = useState<string | undefined>();

  return (
    <>
      <h1>Welcome to a chat room!</h1>
      <p>Hard to get more minimal than this React app.</p>
      {username ? (
        <Console username={username} />
      ) : (
        <Login onSetUsername={(username) => setUsername(username)} />
      )}
    </>
  );
};

function Login({
  onSetUsername,
}: {
  onSetUsername: (username: string) => void;
}) {
  const [username, setUsername] = useState("");
  return (
    <>
      <p>Enter username:</p>
      <form
        onSubmit={(event) => {
          const trimmedUsername = username.trim();
          if (trimmedUsername.length > 0) {
            onSetUsername(trimmedUsername);
          }
          event.preventDefault();
        }}
      >
        <input
          onChange={(event) => setUsername(event.target.value)}
          type="text"
          value={username}
        />
        <input type="submit" />
      </form>
    </>
  );
}

function Console({ username }: { username: string }) {
  const [messages, pushMessage] = useReducer(
    (messages: Message[], message: Message) => [message].concat(...messages),
    []
  );

  const webSocketUrl = useMemo(() => {
    const url = new URL(window.location.href);
    const suffix = url.host.substring(0, url.host.indexOf("."));
    const webSocketSuffix = suffix.substring(0, suffix.length - 1) + "2";
    url.protocol = "wss";
    url.host = url.host.replace(/[^\.]*/, webSocketSuffix);
    return url.href;
  }, []);

  const webSocket = useMemo(() => new WebSocket(webSocketUrl), [webSocketUrl]);
  useMemo(() => {
    webSocket.addEventListener("open", () => {
      webSocket.send(JSON.stringify({ type: "connect", username }));
    });
    webSocket.addEventListener("message", async (event: MessageEvent<Blob>) => {
      pushMessage(JSON.parse(await event.data.text()));
    });
  }, [webSocket]);

  const [text, setText] = useState("");
  const sendChat = useCallback(() => {
    webSocket.send(JSON.stringify({ text, type: "chat", username }));
    setText("");
  }, [text]);

  return (
    <>
      <form
        onSubmit={(event) => {
          sendChat();
          event.preventDefault();
        }}
      >
        <input
          onChange={(event) => setText(event.target.value)}
          type="text"
          value={text}
        />
        <input type="submit" />
      </form>
      {messages.map((message, i) => (
        <p key={i}>
          {message.type === "connect" ? (
            <b>{message.username} connected.</b>
          ) : (
            <>
              <b>{message.username}:</b> {message.text}
            </>
          )}
        </p>
      ))}
    </>
  );
}

interface ConnectMessage {
  type: "connect";
  username: string;
}

interface ChatMessage {
  text: string;
  type: "chat";
  username: string;
}

type Message = ConnectMessage | ChatMessage;
