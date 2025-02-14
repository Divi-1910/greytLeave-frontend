import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getApprovedLeaveRequests, getHolidays } from "../api/api";
import enUS from "date-fns/locale/en-US";

const locales = {
  "en-US": enUS
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

const Calendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const holidaysResponse = await getHolidays();
        //    console.log("holidays response - ", holidaysResponse);
        const holidays = holidaysResponse.data.map((holiday) => ({
          title: `Holiday: ${holiday.name}`,
          start: new Date(holiday.date),
          end: new Date(holiday.date),
          allDay: true,
          resource: {
            type: "holiday",
            isOptional: holiday.isOptional
          }
        }));

        const leavesResponse = await getApprovedLeaveRequests();
        //    console.log("leave response - ", leavesResponse);
        const leaves = leavesResponse.data.map((leave) => {
          const startDate = new Date(leave.startDate);
          const endDate = new Date(leave.endDate);

          const isHalfDay = leave.requestedNumberOfDays % 1 !== 0;
          const title = `${leave.leavePolicy.leaveType.name}: ${leave.reason})`;
          return {
            title,
            start: startDate,
            end: endDate,
            allDay: !isHalfDay,
            resource: {
              type: "leave",
              leavePeriod: leave.leavePeriod,
              duration: leave.requestedNumberOfDays
            }
          };
        });

        setEvents([...holidays, ...leaves]);
      } catch (error) {
        console.error("Error fetching calendar data:", error);
      }
    };

    fetchData();
  }, []);

  const eventStyleGetter = (event) => {
    let style = {
      borderRadius: "5px",
      opacity: 0.8,
      color: "white",
      border: "0px",
      display: "block"
    };

    if (event.resource.type === "holiday") {
      style.backgroundColor = event.resource.isOptional ? "#f39c12" : "#e74c3c";
    } else if (event.resource.type === "leave") {
      //  console.log("event resource leavePeriod  - ", event.resource.leavePeriod);
      switch (event.resource.leavePeriod) {
        case "FullDay":
          style.backgroundColor = "#2ecc71";
          break;
        case "HalfDay":
          style.backgroundColor = "#3498db";
          break;
        case "SECOND_HALF":
          style.backgroundColor = "#9b59b6";
          break;
        default:
          style.backgroundColor = "#2ecc71";
      }

      if (event.resource.duration % 1 !== 0) {
        style.backgroundImage =
          "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.1) 5px, rgba(255,255,255,0.1) 10px)";
      }
    }

    return { style };
  };

  const CustomToolbar = (toolbar) => {
    const goToToday = () => {
      toolbar.onNavigate("TODAY");
    };

    return (
      <div className="rbc-toolbar">
        <span className="rbc-btn-group">
          <button type="button" onClick={() => toolbar.onNavigate("PREV")}>
            Back
          </button>
          <button type="button" onClick={goToToday}>
            Today
          </button>
          <button type="button" onClick={() => toolbar.onNavigate("NEXT")}>
            Next
          </button>
        </span>
        <span className="rbc-toolbar-label">{toolbar.label}</span>
        <span className="rbc-btn-group">
          {["month"].map((view) => (
            <button
              key={view}
              type="button"
              className={toolbar.view === view ? "rbc-active" : ""}
              onClick={() => toolbar.onView(view)}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </span>
      </div>
    );
  };

  return (
    <div style={{ height: "700px", padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h3>Legend:</h3>
        <div style={{ display: "flex", gap: "20px" }}>
          <div>
            <span
              style={{
                backgroundColor: "#e74c3c",
                padding: "5px 10px",
                borderRadius: "3px",
                color: "white"
              }}
            >
              Public Holiday
            </span>
          </div>
          <div>
            <span
              style={{
                backgroundColor: "#f39c12",
                padding: "5px 10px",
                borderRadius: "3px",
                color: "white"
              }}
            >
              Optional Holiday
            </span>
          </div>
          <div>
            <span
              style={{
                backgroundColor: "#2ecc71",
                padding: "5px 10px",
                borderRadius: "3px",
                color: "white"
              }}
            >
              Full Day Leave
            </span>
          </div>
          <div>
            <span
              style={{
                backgroundColor: "#3498db",
                padding: "5px 10px",
                borderRadius: "3px",
                color: "white"
              }}
            >
              Half Leave
            </span>
          </div>
          <div></div>
        </div>
      </div>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        eventPropGetter={eventStyleGetter}
        components={{
          toolbar: CustomToolbar
        }}
        views={["month"]}
      />
    </div>
  );
};

export default Calendar;
