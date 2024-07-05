import { socket } from "../socket"

// socket.on("message", text => {
//     console.log(text)
// })

const WS = () => {


   


    const handleMessage = () => {
        socket.emit("message", "hello from client!");
    }

    return (
        <div>
            <button onClick={handleMessage}>
                send msg
            </button>
        </div>
    );
}

export default WS;