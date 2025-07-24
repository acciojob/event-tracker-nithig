import React, { useState } from "react";
import BigCalendar from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Popup from "react-popup";

const localizer = BigCalendar.momentLocalizer(moment);

const App = () => {
  const [events, setEvents] = useState([]);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [filter, setFilter] = useState("all");

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo);
    setEventTitle("");
    setEventLocation("");
    setShowCreatePopup(true);
    
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setEventTitle(event.title);
    setEventLocation(event.location);
    setShowEditPopup(true);
  };

  const handleCreateEvent = () => {
    if (eventTitle.trim()) {
      setEvents([
        ...events,
        {
          id: Date.now(),
          title: eventTitle,
          location: eventLocation,
          start: selectedSlot.start,
          end: selectedSlot.end,
        },
      ]);
      setShowCreatePopup(false);
    }
  };

  const handleUpdateEvent = () => {
    setEvents(
      events.map((event) =>
        event.id === selectedEvent.id
          ? { ...event, title: eventTitle, location: eventLocation }
          : event
      )
    );
    setShowEditPopup(false);
  };

  const handleDeleteEvent = () => {
    setEvents(events.filter((event) => event.id !== selectedEvent.id));
    setShowEditPopup(false);
  };

  const now = new Date();
  const filteredEvents =
    filter === "all"
      ? events
      : filter === "past"
      ? events.filter((e) => new Date(e.end) < now)
      : events.filter((e) => new Date(e.start) >= now);

  return (
    <div style={{ padding: 20 }}>
      <div className="header">
        <h1>Event Tracker Calendar</h1>
        <div className="filter-buttons">
          <button
            className={`btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`btn ${filter === "past" ? "active" : ""}`}
            onClick={() => setFilter("past")}
          >
            Past
          </button>
          <button
            className={`btn ${filter === "upcoming" ? "active" : ""}`}
            onClick={() => setFilter("upcoming")}
          >
            Upcoming
          </button>
        </div>
      </div>
      <BigCalendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        selectable={true}
        style={{ height: 600 }}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        popup
        views={["month"]} // "month" is enough for slot selection
        components={{
          event: (props) => {
            const isPast = new Date(props.event.end) < now;
            return (
              <div
                className={`rbc-event${isPast ? " past" : ""}`}
                style={{
                  backgroundColor: isPast
                    ? "rgb(222, 105, 135)"
                    : "rgb(140, 189, 76)",
                  color: "white",
                }}
              >
                {props.title}
              </div>
            );
          },
        }}
      />
      {showCreatePopup && (
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
                  className="mm-popup__btn save-btn"
                  onClick={handleCreateEvent}
                >
                  Save
                </button>
                <button
                  className="mm-popup__btn cancel-btn"
                  onClick={() => setShowCreatePopup(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showEditPopup && (
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
      )}
    </div>
  );
};

export default App;