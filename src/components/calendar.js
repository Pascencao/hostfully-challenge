import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment'
import { useContext, useState } from 'react'
import { pageContext } from '../App'
import { Container } from '@mui/material'
import { EventModal } from './eventModal'
import EventsSrv from '../services/events';

const localizer = momentLocalizer(moment)

export const CalendarPage =()=>{
    const {pageContent, setPageContent} = useContext(pageContext)
    const [openModal, setOpenModal] = useState(false)
    const [modalData, setModalData] = useState(null);
    
    const handleNewEvent = (e)=>{
        setModalData({start: e.start, end:e.end, date: e.start})
        setOpenModal(true)
    }
    const handleUpdateEvent = (e)=>{
        setModalData(e)
        setOpenModal(true)

    }
    const handleEventUpdate = (data)=>{
        if(data){
            if(data.resourceId){
                EventsSrv.updateEvent(data);
                setPageContent({user: pageContent.user, 
                    events: pageContent.events.map(eventItem => {
                        if(eventItem.resourceId === data.resourceId){
                            return {...eventItem, ...data}
                        }
                        return eventItem;
                    })
                })

            } else {
                const newId =`${pageContent.user.id}-${moment(data.start).format('DDMMYYYY-hhmm')}`
                EventsSrv.setEvent({resourceId: newId,...data})
                setPageContent({user: pageContent.user, events: [...pageContent.events, {resourceId: newId,...data}] })
            }
        }
        setOpenModal(false)
        setModalData(null)
    }
    const handleDelete = (id )=>{
        EventsSrv.deleteEvent(id)
        setPageContent({user: pageContent.user, events: pageContent.events.filter(existing => existing.resourceId !== id) })
        setOpenModal(false)
        setModalData(null)
    }
    return (
        <Container style={{marginTop: '40px'}} maxWidth="md">
            <Calendar
                defaultView='day'
                localizer={localizer}
                events={pageContent.events}
                startAccessor="start"
                endAccessor="end"
                selectable={true}
                style={{height: '500px'}}
                onSelectSlot={handleNewEvent}
                onSelectEvent={handleUpdateEvent}
            ></Calendar>
            {openModal && <EventModal open={openModal} modalData={modalData} onClose={handleEventUpdate} onDelete={handleDelete}/>}
        </Container>
    )
}