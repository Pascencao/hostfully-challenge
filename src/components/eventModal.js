import { Box, Button, FormControl, Input, InputLabel, Modal, Snackbar, Typography } from "@mui/material"
import { useContext, useEffect, useState } from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimeField } from "@mui/x-date-pickers";
import moment from "moment";
import { pageContext } from "../App";
import dayjs from "dayjs";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
const checkAvaiability = (current, stored) => {
    let result = true;
    const sameDayEvents = stored.filter(savedEvent => {
        return moment(savedEvent.date).isSame(moment(current.date), 'day')
    })
    if(sameDayEvents && sameDayEvents.length){
        for(let dayEvent of sameDayEvents){
            if(current.resourceId !== dayEvent.resourceId){
                if(moment(current.start).isBetween(moment(dayEvent.start), moment(dayEvent.end)) ||
                moment(current.end).isBetween(moment(dayEvent.start), moment(dayEvent.end))) {
                    result = false;
                    break
                } else if (
                    moment(current.start).isSameOrBefore(moment(dayEvent.start)) &&
                    moment(current.end).isSameOrAfter(dayEvent.end)
                ){
                    result = false;
                }
            }

        }
    }
    return result
}
export const EventModal = ({open, modalData, onClose, onDelete})=>{
    
    const {pageContent} = useContext(pageContext)
    const [eventError, setEventError] = useState('')
    const [isOpen, setIsOpen] = useState(open)
    const [eventForm, setEventForm] = useState({
        title: '', ...modalData
    })
    useEffect(()=>{
        setIsOpen(open)
    },[open])
    const handleClose = ()=> onClose()
    const deleteEvent = ()=>{
        onDelete(eventForm.resourceId)
    }
    const handleEventSubmit = (e) => {
        e.preventDefault()
        if(eventForm.title && eventForm.date && eventForm.start && eventForm.start !== "Invalid Date" && eventForm.end && eventForm.end !== "Invalid Date"){
            if(checkAvaiability(eventForm, pageContent.events)){
                onClose(eventForm)
                setIsOpen(false)
            } else {
                setEventError('The event timeframe overlaps an existing one')
            }
        } else {
            setEventError('All fields are required')
        }
    }
    return (<>
        <Modal
        open={isOpen}
        onClose={handleClose}>
            <Box sx={style}>
                <form onSubmit={handleEventSubmit}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">New Event</Typography>
                    <FormControl style={{width: '100%', marginTop: '30px'}}>
                        <InputLabel htmlFor="my-input">Title</InputLabel>
                        <Input value={eventForm.title} onChange={(e)=>setEventForm({...eventForm, title: e.target.value})}
                            id="Title" aria-describedby="Title" />
                    </FormControl>
                    <FormControl style={{width: '100%', marginTop: '30px'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker defaultValue={dayjs(eventForm.date)} label="Date" onChange={(e)=>setEventForm({...eventForm, date: e.toDate()})}/>
                        </LocalizationProvider>
                    </FormControl>

                    <FormControl style={{width: '47%', marginTop: '30px', marginRight: '3%'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            
                            <TimeField value={dayjs(eventForm.start)} ampm={false} label="Start" onChange={(e)=>setEventForm({...eventForm, start: e.toDate()})}/>
                        </LocalizationProvider>
                    </FormControl>

                    <FormControl style={{width: '47%', marginTop: '30px', marginLeft: '3%'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimeField defaultValue={dayjs(eventForm.end)} ampm={false} label="End" onChange={(event)=>setEventForm({...eventForm, end: event.toDate()})}/>
                        </LocalizationProvider>
                    </FormControl>
                    <Button type="submit">Submit</Button>
                    <Button type="button" onClick={() => handleClose()}>Cancel</Button>
                    {eventForm.resourceId && <Button type="button" onClick={deleteEvent}>Delete</Button>}
                </form>

            </Box>
        </Modal>
        <Snackbar
            open={!!eventError}
            autoHideDuration={3000}
            message={eventError}
        /></>
    )
}