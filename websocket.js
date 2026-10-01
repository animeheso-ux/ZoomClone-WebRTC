import { WebSocketServer } from "ws";
export let Meetings = []
export let Connections = []


export default function websocketSetup(server) {
    const websocketServer = new WebSocketServer({ server })

    websocketServer.on("connection", (ws) => {
        console.log("server connection on!")

        ws.on("close", () => {
            console.log("client left")
        })


        ws.on("message", (rawData) => {
            const Data = JSON.parse(rawData)

            if (Data.type == "CreateMeeting") {
                const Exists = Meetings.find(meeting => meeting["host"] == Data.username)

                

                if (!Exists) {
                    console.log("Creating meeting....")
                    Meetings.push({ host: Data.username, host_id: Data.id, host_socket: ws, Users: [{name : Data.username,id : Data.id,socket : ws} ], code: Data.code })
                }



            }

            if (Data.type == "addConnection") {
                const Exists = Meetings.find(meeting => meeting["code"] == Data.code)


                if (Exists) {
                    const ExistingUser = Exists["Users"].find(user => user["name"] == Data.name)

                    if (ExistingUser) {
                        ExistingUser["socket"] = ws
                        console.log(ExistingUser)


                        Exists["Users"].forEach((user)=> {
                            user["socket"].send({type : "onUserJoin"})
                        })
                    }
                }


            }

            if (Data.type == "sendOffer") {
                const TargetMeeting = Meetings.find(meeting => meeting["code"] == Data.meeting_id)

                if (TargetMeeting) {

                    const IsNotHost = TargetMeeting["Users"].find(user => user["name"] !== Data.name)

                    if (IsNotHost) {
                        console.log(Data.name, "sending offer to....", IsNotHost["name"])
                        IsNotHost["socket"].send(JSON.stringify({ type: "receiveOffer", offer: Data.offer }))
                    }



                }
            }

            if (Data.type == "sendAnswer") {
                const TargetMeeting = Meetings.find(meeting => meeting["code"] == Data.meeting_id)

                if (TargetMeeting) {
                    console.log(Data.name, "sending answer to host....", TargetMeeting["host"])
                    TargetMeeting["host_socket"].send(JSON.stringify({ type: "receiveAnswer", answer: Data.answer }))


                }
            }
            
            if (Data.type == "addCandidate") {

                     const TargetMeeting = Meetings.find(meeting => meeting["code"] == Data.meeting_id)

                     if (TargetMeeting) {


                        
                 const OtherUsers = TargetMeeting["Users"].filter(user => user["name"] !== Data.name)

                    if (OtherUsers) {
                        OtherUsers.forEach(users => {
                            users["socket"].send(JSON.stringify({type : "receiveCandidate",Candidate : Data.Candidate}))
                        });
                    }


                     }



            }

        })
    })
}


