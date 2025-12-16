import { SIPProvider } from "react-sipjs";
import "./App.css";
import { CallCenter } from "./CallCenter";
import WebRTCCallApp from "./WebRTCCallApp";

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
    // <>
    //   <div className='p-5'>
    //     <SIPProvider
    //       options={{
    //         // Lab Docker (Secure)
    //         webSocketServer: "wss://10.134.1.166:8089/ws",
    //         domain: "10.134.1.166",

    //         // Lab Docker
    //         // webSocketServer: "ws://10.134.1.166:8088/ws",
    //         // domain: "10.134.1.166",

    //         // Windows VirtualBox (Secure)
    //         // webSocketServer: "wss://192.168.100.2:8089/ws",
    //         // domain: "192.168.100.2",

    //         // Windows VirtualBox
    //         // webSocketServer: "ws://192.168.100.2:8088/ws",
    //         // domain: "192.168.100.2",

    //         // Windows Docker (Secure)
    //         // webSocketServer: "wss://192.168.100.8:8089/ws",
    //         // domain: "192.168.100.8",

    //         // Windows Docker
    //         // webSocketServer: "ws://192.168.100.8:8088/ws",
    //         // domain: "192.168.100.8",

    //         // RPI Docker
    //         // webSocketServer: "ws://192.168.100.191:8088/ws",
    //         // domain: "192.168.100.191",

    //         // AsteriskNOW
    //         // webSocketServer: "ws://192.168.8.168:8088/ws",
    //         // domain: "192.168.8.168",

    //         media: {
    //           constraints: { audio: true, video: false },
    //           // constraints: {
    //           //   audio: {
    //           //     deviceId: {
    //           //       exact: "communications",
    //           //     }, // 'exact' forces this specific device
    //           //   },
    //           //   video: false,
    //           // },
    //           iceServers: [{ urls: "stun1.l.google.com:19302" }],
    //         },
    //       }}
    //     >
    //       <div>
    //         <CallCenter />
    //       </div>
    //     </SIPProvider>
    //   </div>
    // </>
    <>
      <WebRTCCallApp />
    </>
  );
}

export default App;
