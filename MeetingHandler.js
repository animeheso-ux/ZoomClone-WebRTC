import express from "express"
import { Meetings } from "./websocket.js"


const MeetingRouter = express.Router()


MeetingRouter.post("/JoinMeeting/:meeting_id",(req,res)=> {
    const {name,id} = req.body
    const meeting_id = req.params.meeting_id

    const ExistingMeeting = Meetings.find(meeting => meeting["code"] == meeting_id)

    if (ExistingMeeting) {

        const ExistingMember = ExistingMeeting["Users"].find(user => user["name"] == name)

        if (!ExistingMember && name !== ExistingMeeting["host"]) {
            ExistingMeeting["Users"].push({name : name,id : id,socket : null})
            console.log(ExistingMeeting["Users"])
            return res.status(300).json({status : "success"})
        }else {
            return res.status(409).json({status : "User already in meeting"})
        }
    }else {
        return res.status(404).json({status : "Meeting does not exist!"})
    }

})


MeetingRouter.get("/GetUserList/:meeting_id/:username",(req,res)=> {
    const meeting_id = req.params.meeting_id
    const username = req.params.username

    const TargetMeeting = Meetings.find(meeting => meeting["code"] == meeting_id)


    if (TargetMeeting) {
        const OtherMembers = TargetMeeting["Users"].filter(user => user["name"] !== username)


        res.status(200).json({members : OtherMembers})
    }
})









export default MeetingRouter