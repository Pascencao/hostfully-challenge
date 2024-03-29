import moment from "moment";

class EventsSrv{
    events = [];
    user = null;
    constructor(){}
    init(userId){
        this.user = userId;
        const storedEvents = this.eventFromStore()
        this.events = storedEvents.filter((e) => e.user === userId).map(e =>{
            return {
                title: e.title,
                start: moment(e.start).toDate(),
                end: moment(e.end).toDate(),
                date: moment(e.date).toDate(),
                resourceId: e.resourceId
            }
        });
    }
    eventFromStore(){
        return JSON.parse(localStorage.getItem('events') || '[]');
    }
    getEvents(){
        return this.events;
    }
    setEvent(eventToSave){
        const stored = this.eventFromStore()
        stored.push({user: this.user, ...eventToSave})
        localStorage.setItem('events', JSON.stringify(stored));
    }
    deleteEvent(id){
        const stored = this.eventFromStore()
        const newList = stored.filter(existing => existing.resourceId !== id)
        localStorage.setItem('events', JSON.stringify(newList));
    }
    updateEvent(eventToUpdate){
        const stored = this.eventFromStore()
        const editedList = stored.map(eventItem => {
            if(eventItem.resourceId === eventToUpdate.resourceId){
                return {...eventItem, ...eventToUpdate}
            }
            return eventItem;
        })
        localStorage.setItem('events', JSON.stringify(editedList));
    }
}

export default new EventsSrv()