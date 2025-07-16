import React, { useState } from 'react';

const App = () => {
  const [events, setEvents] = useState([]);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Date utility functions
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (date) => {
    const today = new Date();
    return formatDate(date) === formatDate(today);
  };

  const isPast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isFuture = (date) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date > today;
  };

  const isSameDay = (date1, date2) => {
    return formatDate(date1) === formatDate(date2);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getMonthName = (date) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[date.getMonth()];
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const handleDateClick = (date) => {
    if (!date) return;
    
    const existingEvent = events.find(event => 
      isSameDay(new Date(event.date), date)
    );

    if (existingEvent) {
      setSelectedEvent(existingEvent);
      setEventTitle(existingEvent.title);
      setEventLocation(existingEvent.location);
      setShowEditPopup(true);
    } else {
      setSelectedDate(date);
      setEventTitle('');
      setEventLocation('');
      setShowCreatePopup(true);
    }
  };

  const handleEventClick = (event, e) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setEventTitle(event.title);
    setEventLocation(event.location);
    setShowEditPopup(true);
  };

  const handleCreateEvent = () => {
    if (eventTitle.trim()) {
      const newEvent = {
        id: Date.now(),
        title: eventTitle,
        location: eventLocation,
        date: selectedDate.toISOString().split('T')[0]
      };
      setEvents([...events, newEvent]);
      setShowCreatePopup(false);
      setEventTitle('');
      setEventLocation('');
    }
  };

  const handleUpdateEvent = () => {
    if (eventTitle.trim()) {
      const updatedEvents = events.map(event =>
        event.id === selectedEvent.id
          ? { ...event, title: eventTitle, location: eventLocation }
          : event
      );
      setEvents(updatedEvents);
      setShowEditPopup(false);
      setEventTitle('');
      setEventLocation('');
    }
  };

  const handleDeleteEvent = () => {
    const updatedEvents = events.filter(event => event.id !== selectedEvent.id);
    setEvents(updatedEvents);
    setShowEditPopup(false);
    setEventTitle('');
    setEventLocation('');
  };

  const getFilteredEvents = () => {
    const now = new Date();
    
    switch (filter) {
      case 'past':
        return events.filter(event => isPast(new Date(event.date)));
      case 'upcoming':
        return events.filter(event => isFuture(new Date(event.date)));
      default:
        return events;
    }
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    return getFilteredEvents().filter(event => 
      isSameDay(new Date(event.date), date)
    );
  };

  const CreateEventPopup = () => (
    <div className="popup-overlay">
      <div className="mm-popup__box">
        <div className="mm-popup__box__header">
          <h3>Create Event</h3>
        </div>
        <div className="mm-popup__box__body">
          <input
            type="text"
            placeholder="Event Title"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            className="event-input"
          />
          <input
            type="text"
            placeholder="Event Location"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
            className="event-input"
          />
        </div>
        <div className="mm-popup__box__footer">
          <div className="mm-popup__box__footer__right-space">
            <button
              className="mm-popup__btn"
              onClick={handleCreateEvent}
            >
              Save
            </button>
            <button
              className="mm-popup__btn"
              onClick={() => setShowCreatePopup(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const EditEventPopup = () => (
    <div className="popup-overlay">
      <div className="mm-popup__box">
        <div className="mm-popup__box__header">
          <h3>Edit Event</h3>
        </div>
        <div className="mm-popup__box__body">
          <input
            type="text"
            placeholder="Event Title"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            className="event-input"
          />
          <input
            type="text"
            placeholder="Event Location"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
            className="event-input"
          />
        </div>
        <div className="mm-popup__box__footer">
          <div className="mm-popup__box__footer__right-space">
            <button
              className="mm-popup__btn mm-popup__btn--info"
              onClick={handleUpdateEvent}
            >
              Save
            </button>
            <button
              className="mm-popup__btn mm-popup__btn--danger"
              onClick={handleDeleteEvent}
            >
              Delete
            </button>
            <button
              className="mm-popup__btn"
              onClick={() => setShowEditPopup(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <style>{`
        .event-tracker-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .header h1 {
          color: #333;
          font-size: 2.5rem;
          margin-bottom: 10px;
        }
        
        .filter-buttons {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
          font-weight: bold;
          transition: all 0.3s ease;
        }
        
        .btn:hover {
          opacity: 0.8;
        }
        
        .btn.active {
          background-color: #007bff;
          color: white;
        }
        
        .btn:not(.active) {
          background-color: #f8f9fa;
          color: #333;
          border: 1px solid #dee2e6;
        }
        
        .calendar-container {
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          padding: 20px;
        }
        
        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .calendar-header h2 {
          margin: 0;
          color: #333;
          font-size: 1.5rem;
        }
        
        .nav-button {
          padding: 8px 16px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .nav-button:hover {
          background: #f8f9fa;
        }
        
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 1px;
          border: 1px solid #ddd;
          border-radius: 5px;
          overflow: hidden;
        }
        
        .weekday-header {
          background: #f8f9fa;
          padding: 10px;
          text-align: center;
          font-weight: bold;
          color: #666;
          border-bottom: 1px solid #ddd;
        }
        
        .calendar-day {
          min-height: 100px;
          padding: 8px;
          background: white;
          border-bottom: 1px solid #eee;
          cursor: pointer;
          position: relative;
        }
        
        .calendar-day:hover {
          background-color: #f8f9fa;
        }
        
        .calendar-day.empty {
          background-color: #f9f9f9;
          cursor: default;
        }
        
        .calendar-day.today {
          background-color: #fff3cd;
        }
        
        .day-number {
          font-weight: bold;
          color: #333;
          margin-bottom: 5px;
        }
        
        .event-item {
          background-color: rgb(140, 189, 76);
          color: white;
          padding: 2px 6px;
          margin: 2px 0;
          border-radius: 3px;
          font-size: 12px;
          cursor: pointer;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .event-item.past {
          background-color: rgb(222, 105, 135);
        }
        
        .event-item.rbc-event {
          background-color: rgb(140, 189, 76);
        }
        
        .event-item.past.rbc-event {
          background-color: rgb(222, 105, 135);
        }
        
        .event-item:hover {
          opacity: 0.8;
        }
        
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.5);
          z-index: 999;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .mm-popup__box {
          background: white;
          border-radius: 10px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          z-index: 1000;
          min-width: 400px;
          max-width: 90vw;
        }
        
        .mm-popup__box__header {
          padding: 20px;
          border-bottom: 1px solid #eee;
        }
        
        .mm-popup__box__header h3 {
          margin: 0;
          color: #333;
          font-size: 1.5rem;
        }
        
        .mm-popup__box__body {
          padding: 20px;
        }
        
        .event-input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 14px;
          margin-bottom: 15px;
          box-sizing: border-box;
        }
        
        .event-input:focus {
          outline: none;
          border-color: #007bff;
        }
        
        .mm-popup__box__footer {
          padding: 20px;
          border-top: 1px solid #eee;
        }
        
        .mm-popup__box__footer__right-space {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        
        .mm-popup__btn {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
          font-weight: bold;
          transition: all 0.3s ease;
        }
        
        .mm-popup__btn:hover {
          opacity: 0.8;
        }
        
        .mm-popup__btn--info {
          background-color: #17a2b8;
          color: white;
        }
        
        .mm-popup__btn--danger {
          background-color: #dc3545;
          color: white;
        }
        
        .mm-popup__btn:not(.mm-popup__btn--info):not(.mm-popup__btn--danger) {
          background-color: #007bff;
          color: white;
        }
        
        .mm-popup__btn:last-child {
          background-color: #6c757d;
          color: white;
        }
      `}</style>
      
      <div className="header">
        <h1>Event Tracker Calendar</h1>
        <div className="filter-buttons">
          <button 
            className={`btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`btn ${filter === 'past' ? 'active' : ''}`}
            onClick={() => setFilter('past')}
          >
            Past
          </button>
          <button 
            className={`btn ${filter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </button>
        </div>
      </div>
      
      <div className="calendar-container">
        <div className="calendar-header">
          <button 
            className="nav-button"
            onClick={() => navigateMonth(-1)}
          >
            ← Previous
          </button>
          <h2>{getMonthName(currentMonth)} {currentMonth.getFullYear()}</h2>
          <button 
            className="nav-button"
            onClick={() => navigateMonth(1)}
          >
            Next →
          </button>
        </div>
        
        <div className="calendar-grid">
          {weekDays.map(day => (
            <div key={day} className="weekday-header">
              {day}
            </div>
          ))}
          
          {days.map((date, index) => (
            <div
              key={index}
              className={`calendar-day ${
                !date ? 'empty' : ''
              } ${date && isToday(date) ? 'today' : ''}`}
              onClick={() => handleDateClick(date)}
            >
              {date && (
                <>
                  <div className="day-number">{date.getDate()}</div>
                  {getEventsForDate(date).map((event) => (
                    <div
                      key={event.id}
                      className={`event-item rbc-event ${
                        isPast(new Date(event.date)) ? 'past' : ''
                      }`}
                      onClick={(e) => handleEventClick(event, e)}
                      title={`${event.title} - ${event.location}`}
                    >
                      {event.title}
                    </div>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {showCreatePopup && <CreateEventPopup />}
      {showEditPopup && <EditEventPopup />}
    </div>
  );
};

export default App;