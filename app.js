document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calendar");

  // Initialize FullCalendar
  window.calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    events: loadEventsFromStorage(),
    eventDidMount: function (info) {
      const dayCell = info.el.closest('.fc-daygrid-day');
      if (dayCell) {
        dayCell.classList.add('highlight-cell');
      }
    }
  });

  window.calendar.render();
  displayEvents();
});

// Format date as dd/mm/yyyy for display
function formatDateDisplay(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

// Load events from localStorage
function loadEventsFromStorage() {
  const events = JSON.parse(localStorage.getItem("events")) || [];
  return events.map((event, index) => ({
    title: event.title,
    start: event.date,
    allDay: true,
    id: index,
  }));
}

// Save new event to localStorage
function saveEvent(title, date) {
  const events = JSON.parse(localStorage.getItem("events")) || [];
  events.push({ title, date });
  localStorage.setItem("events", JSON.stringify(events));
}

// Display events in list and calendar
function displayEvents() {
  const eventList = document.getElementById("eventList");
  eventList.innerHTML = "";

  let events = JSON.parse(localStorage.getItem("events")) || [];
  events.sort((a, b) => new Date(a.date) - new Date(b.date));

  events.forEach((event, index) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = `${event.title} - ${formatDateDisplay(event.date)}`;
    li.appendChild(span);

    const btnGroup = document.createElement("div");
    btnGroup.className = "btn-group";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => editEvent(index);
    btnGroup.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => deleteEvent(index);
    btnGroup.appendChild(deleteBtn);

    li.appendChild(btnGroup);
    eventList.appendChild(li);
  });

  // 🧽 Remove all previous highlights
  document.querySelectorAll('.highlight-cell').forEach(cell => {
    cell.classList.remove('highlight-cell');
  });

  // 🔁 Refresh calendar
  window.calendar.removeAllEvents();
  window.calendar.addEventSource(loadEventsFromStorage());
  window.calendar.render();
}

// Handle form submission
document.getElementById("eventForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("eventTitle").value.trim();
  const date = document.getElementById("eventDate").value.trim();

  if (title && date) {
    saveEvent(title, date);
    displayEvents();
    e.target.reset();
  } else {
    alert("Please fill in both the event title and date.");
  }
});

// Edit event with validation
function editEvent(index) {
  const events = JSON.parse(localStorage.getItem("events")) || [];
  const currentEvent = events[index];

  const newTitle = prompt("Edit event title:", currentEvent.title);
  if (newTitle === null || newTitle.trim() === "") {
    alert("Title cannot be empty.");
    return;
  }

  const newDate = prompt("Edit event date (YYYY-MM-DD):", currentEvent.date);
  if (newDate === null || !/^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
    alert("Please enter a valid date in format YYYY-MM-DD.");
    return;
  }

  const parsedDate = new Date(newDate);
  if (isNaN(parsedDate.getTime())) {
    alert("Invalid date. Please enter a valid date.");
    return;
  }

  // Update event
  events[index] = {
    title: newTitle.trim(),
    date: newDate.trim()
  };

  localStorage.setItem("events", JSON.stringify(events));
  displayEvents();
}

// Delete event
function deleteEvent(index) {
  const events = JSON.parse(localStorage.getItem("events")) || [];
  events.splice(index, 1);
  localStorage.setItem("events", JSON.stringify(events));
  displayEvents();
}
