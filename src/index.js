import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import io from "socket.io-client";

const backendUrl = "https://e94dc841.ngrok.io";

export const getQrCode = (socketName, query) => {
    const socket = io(`${backendUrl}/${socketName}/`, {
        forceNew: true,
        query
    });
    return new Promise(resolve =>
        socket.on("qrCode", ({ qrCode, identifier }) => resolve({ qrCode, socket, identifier }))
    );
};

const f = async() => {
    const { qrCode: ssoQrCode, socket, identifier } = await getQrCode("authenticate");
    ReactDOM.render(<App />, document.getElementById("root"));
}

f();



