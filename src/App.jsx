import { SIPProvider } from "react-sipjs";
import "./App.css";
import { CallCenter } from "./CallCenter";

// const _RTCPeerConnection = window.RTCPeerConnection;
// window.RTCPeerConnection = function (...args) {
//   console.log("Custom RTCPeerConnection called with args:", args);
//   const params = args[0];
//   params.rtcpMuxPolicy = "negotiate";
//   // return new _RTCPeerConnection(...args);
//   return new _RTCPeerConnection(params);
// };

function App() {
  return (
    <>
      <div className='p-5'>
        <SIPProvider
          options={{
            // Lab Docker
            webSocketServer: "ws://10.134.1.166:8088/ws",
            domain: "10.134.1.166",

            // RPI Docker
            // webSocketServer: "ws://192.168.100.26:8088/ws",
            // domain: "192.168.100.26",

            // AsteriskNOW
            // webSocketServer: "ws://192.168.8.168:8088/ws",
            // domain: "192.168.8.168",

            media: {
              constraints: { audio: true, video: false },
              iceServers: [{ urls: "stun1.l.google.com:19302" }],
            },
          }}
        >
          <div>
            <CallCenter />
          </div>
        </SIPProvider>
      </div>
    </>
  );
}

export default App;
