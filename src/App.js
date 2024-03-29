import {Login} from './components/login'
import './App.css';
import { createContext, useState } from 'react';
import { CalendarPage } from './components/calendar';
import EventsSrv from './services/events';
import { Header } from './components/header';

export const pageContext = createContext({pageContent:{}, setPageContent: ()=>{}})
function App() {
  const [pageContent, setPageContent] = useState({user: {}, events: []})
  const [openLogin, setOpenLogin] = useState(!pageContent.user?.id)
  const loggingOut = () => {
    setPageContent({user: {}, events: []})
    setOpenLogin(true)
  }
  const handleLoginRequest = () => {
    setOpenLogin(true)
  }
  return (
    <div className="App">
      <pageContext.Provider value={{pageContent,setPageContent}}>
        <Header onLogout={loggingOut} onLogin={handleLoginRequest} />
        {!pageContent.user?.id && <Login open={true} onClose={(event)=>{
          EventsSrv.init(event.id);
          const storedEvents = EventsSrv.getEvents()
          setPageContent({...pageContent, user: event, events:storedEvents})
        }} /> }
        {!!pageContent.user?.id && 
          <CalendarPage />
        }
      </pageContext.Provider>
    </div>
  );
}

export default App;
