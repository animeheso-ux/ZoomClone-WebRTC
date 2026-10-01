
import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"



function CallPage() {
    const navigate = useNavigate()
    const websocketWF = useRef(null)
    const PEERWF = useRef(null)

    const [websocketLoaded, setwebsocketloaded] = useState(false)
    const [peerloaded, setpeerloaded] = useState(false)

    const [username, setusername] = useState("")
    const [user_id, setid] = useState("")
    const { meeting_id } = useParams()

    const [CurrentMemberList,SetCurrentMemberList] = useState([])

    const LocalVideoWF = useRef(null)
    const RemoteVideoWF = useRef(null)

    const [LocalVideo, setLocal] = useState(null)
    const [RemoteVideo, setRemote] = useState(null)

    async function GetToken() {
        const Token = localStorage.getItem("Token")

        const response = await fetch("/GetToken", {
            headers: {
                "authorization": `Bearer ${Token}`,
                "Content-Type": "application/json"
            }
        })

        const data = await response.json()

        if (data.status != "success") {
            alert("invalid session.")
            navigate("/")
            return
        }

        setusername(data.Token["username"])



        return data.Token
    }

    async function IsHost() {
        if (!sessionStorage.getItem("MeetingCode")) { return }
        const Token = await GetToken()
        console.log("route hit!")
        websocketWF.current.send(JSON.stringify({ type: "CreateMeeting", username: Token["username"], id: Token["id"], code: sessionStorage.getItem("MeetingCode") }))
    }


    async function CallUsers() {

        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        })

        stream.getTracks().forEach(track => {
            PEERWF.current.addTrack(track, stream)
        });


        LocalVideoWF.current.srcObject = stream

        console.log("Has local track")
        console.log(stream.getVideoTracks()[0].readyState)


        const offer = await PEERWF.current.createOffer()
        await PEERWF.current.setLocalDescription(offer)



        websocketWF.current.send(JSON.stringify({ type: "sendOffer", offer: offer, meeting_id: meeting_id, name: username }))
    }

    async function GetUserList(params) {

            const response = await fetch(`GetUserList/${meeting_id}/${username}`)

            const data = await response.json()
            console.log("MEMBERS IN LIST",data.members)

            SetCurrentMemberList(data.members)
    }


    //PEERCONNECTION
    useEffect(() => {



        const configuration = {  iceServers: [
                {
                    urls: "stun:stun4.l.google.com:19302"
                },
                   {
            urls: import.meta.env.VITE_TURN_URL,
            username: import.meta.env.VITE_TURN_USERNAME,
            credential: import.meta.env.VITE_TURN_PASSWORD
            }
            ]}

        const Peer = new RTCPeerConnection(configuration)


        const dataChannel = Peer.createDataChannel("channel")

        PEERWF.current = Peer

        setpeerloaded(true)

        dataChannel.onopen = () => {
            console.log("data channel open!")
        }

        dataChannel.onmessage = (e) => {
            console.log(e.data)
        }

        Peer.onicecandidate = (e) => {
            console.log("ICE CANDIDTATE FOUND:", Peer.localDescription)

            websocketWF.current.send(JSON.stringify({ type: "addCandidate", Candidate: e.candidate, name: username, meeting_id: meeting_id }))
        }

        Peer.ontrack = (e) => {
            console.log("REMOTE TRACK:", e.track.kind)
            console.log("TRACK STATE:", e.track.readyState)


            if (e.track.kind == "video") {
                console.log("SETTING REMOTE VIDEO")


                RemoteVideoWF.current.srcObject = e.streams[0]

                RemoteVideoWF.current.onloadedmetadata = () => {
                    console.log("VIDEO WIDTH:", RemoteVideoWF.current.videoWidth)
                    console.log("VIDEO HEIGHT:", RemoteVideoWF.current.videoHeight)

                    RemoteVideoWF.current.play()
                }


            }
        }


    }, [])

    //websockets
    useEffect(() => {
            const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:"
        const websocket = new WebSocket(`${wsProtocol}//${window.location.host}`)
        websocketWF.current = websocket


        websocket.addEventListener("open", async () => {
            console.log("client socket open!")
                    IsHost()
                    setwebsocketloaded(true)
            const Token = await GetToken()

            websocket.send(JSON.stringify({ type: "addConnection", name: Token["username"], id: Token["id"], code: meeting_id }))

        })

        websocket.addEventListener("message", async (e) => {
            const Data = JSON.parse(e.data)

            if (Data.type == "receiveOffer") {

                // 1. Accept caller's offer
                await PEERWF.current.setRemoteDescription(Data.offer)

                // 2. Get receiver's camera/mic
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                })

                // 3. Show receiver's own camera
                LocalVideoWF.current.srcObject = stream
                console.log(stream.getVideoTracks()[0].readyState)

                // 4. Add receiver's camera/mic to WebRTC
                stream.getTracks().forEach(track => {
                    console.log("ADDING RECEIVER TRACK:", track.kind)
                    PEERWF.current.addTrack(track, stream)
                })

                // 5. Create answer containing receiver's media
                const answer = await PEERWF.current.createAnswer()
                await PEERWF.current.setLocalDescription(answer)

                websocketWF.current.send(JSON.stringify({
                    type: "sendAnswer",
                    answer: answer,
                    meeting_id: meeting_id,
                    name: username
                }))


            }

            if (Data.type == "receiveAnswer") {
                console.log("ANSWER RECEIVED")

                await PEERWF.current.setRemoteDescription(Data.answer)




                console.log("ANSWER APPLIED")
            }

            if (Data.type == "receiveCandidate") {
                console.log("receive candidate")
                await PEERWF.current.addIceCandidate(Data.Candidate)
            }

            if (Data.type == "onUserJoin") {
                GetUserList()
            }

        })
    }, [])



    return (
        <div>
            {(websocketLoaded == true && peerloaded == true && sessionStorage.getItem("MeetingCode")) ? (<button onClick={CallUsers}>Join</button>) : (<h1>Loading..</h1>)}


            <div className="Video-Div">
                <video ref={LocalVideoWF} autoPlay playsInline muted />
                <video ref={RemoteVideoWF} autoPlay playsInline />
            </div>

        </div>
    )
}



export default CallPage