document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const calendarDays = document.getElementById('calendar-days');
    const currentMonthElement = document.getElementById('current-month');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const saveHabitsBtn = document.getElementById('save-habits');
    const selectedDateElement = document.getElementById('selected-date');
    const selectedDateFullElement = document.getElementById('selected-date-full');
    const dailyEventsElement = document.getElementById('daily-events');
    const saveEventBtn = document.getElementById('save-event');
    const eventForm = document.getElementById('event-form');

    // Data storage
    let currentDate = new Date();
    let selectedDate = new Date();
    let habitsData = JSON.parse(localStorage.getItem('habitsData')) || {};
    let eventsData = JSON.parse(localStorage.getItem('eventsData')) || {};

    // Initialize calendar
    renderCalendar();
    updateSelectedDateInfo();
    updateStats();

    // Event Listeners
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    saveHabitsBtn.addEventListener('click', saveHabits);
    saveEventBtn.addEventListener('click', saveEvent);

    // Quick action buttons
    document.querySelectorAll('[data-event-type]').forEach(button => {
        button.addEventListener('click', function() {
            const eventType = this.getAttribute('data-event-type');
            const eventModal = new bootstrap.Modal(document.getElementById('eventModal'));
            document.getElementById('event-type').value = eventType;
            document.getElementById('event-date').value = formatDateForInput(selectedDate);
            eventModal.show();
        });
    });

    // Calendar rendering
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        currentMonthElement.textContent = currentDate.toLocaleDateString('id-ID', { 
            month: 'long', 
            year: 'numeric' 
        });
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        
        calendarDays.innerHTML = '';
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDay; i++) {
            const emptyCell = createCalendarDay('', true);
            calendarDays.appendChild(emptyCell);
        }
        
        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const cellDate = new Date(year, month, day);
            const dayCell = createCalendarDay(day, false, cellDate);
            calendarDays.appendChild(dayCell);
        }
    }

    function createCalendarDay(dayNumber, isOtherMonth, date = null) {
        const dayCell = document.createElement('div');
        dayCell.className = `col calendar-day position-relative ${isOtherMonth ? 'other-month' : 'current-month'}`;
        
        if (date) {
            const dateString = formatDate(date);
            const today = new Date();
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const hasEvents = eventsData[dateString] && eventsData[dateString].length > 0;
            
            if (isToday) dayCell.classList.add('today');
            if (isSelected) dayCell.style.backgroundColor = '#e3f2fd';
            if (hasEvents) dayCell.classList.add('has-events');
            
            dayCell.innerHTML = `
                <div class="day-number">${dayNumber}</div>
                ${hasEvents ? getEventBadges(eventsData[dateString]) : ''}
            `;
            
            dayCell.addEventListener('click', () => {
                selectedDate = date;
                updateSelectedDateInfo();
                renderCalendar(); // Re-render to update selection
            });
        } else {
            dayCell.innerHTML = `<div class="day-number">${dayNumber}</div>`;
        }
        
        return dayCell;
    }

    function getEventBadges(events) {
        // Show only first 2 events as badges
        const displayEvents = events.slice(0, 2);
        return displayEvents.map(event => 
            `<span class="event-badge event-${event.type}" title="${event.title}">
                <span class="event-dot" style="background: ${getEventColor(event.type)}"></span>
                ${event.title}
            </span>`
        ).join('');
    }

    function getEventColor(type) {
        const colors = {
            exercise: '#2e7d32',
            nutrition: '#ef6c00',
            mental: '#7b1fa2',
            sleep: '#1565c0',
            other: '#666'
        };
        return colors[type] || '#666';
    }

    function updateSelectedDateInfo() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        selectedDateElement.textContent = selectedDate.toLocaleDateString('id-ID', { weekday: 'long' });
        selectedDateFullElement.textContent = selectedDate.toLocaleDateString('id-ID', options);
        
        // Update habits for selected date
        updateHabitsForDate();
        
        // Update daily events
        updateDailyEvents();
    }

    function updateHabitsForDate() {
        const dateString = formatDate(selectedDate);
        const habits = habitsData[dateString] || {
            habit1: false, habit2: false, habit3: false, habit4: false, habit5: false
        };
        
        // Update checkboxes
        for (let i = 1; i <= 5; i++) {
            const checkbox = document.getElementById(`habit${i}`);
            const progressBar = checkbox.closest('.habit-item').querySelector('.progress-bar');
            
            if (checkbox) {
                checkbox.checked = habits[`habit${i}`] || false;
                progressBar.style.width = checkbox.checked ? '100%' : '0%';
            }
        }
    }

    function updateDailyEvents() {
        const dateString = formatDate(selectedDate);
        const events = eventsData[dateString] || [];
        
        if (events.length === 0) {
            dailyEventsElement.innerHTML = `
                <div class="text-center text-muted py-3">
                    <i class="fas fa-calendar-plus fa-2x mb-2"></i>
                    <p>Tidak ada jadwal untuk hari ini</p>
                </div>
            `;
        } else {
            dailyEventsElement.innerHTML = events.map(event => `
                <div class="alert alert-${getEventAlertType(event.type)} mb-2">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <strong>${event.title}</strong>
                            ${event.time ? `<br><small>${event.time}</small>` : ''}
                        </div>
                        <button class="btn btn-sm btn-outline-danger delete-event" data-event-id="${event.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    ${event.notes ? `<small class="text-muted">${event.notes}</small>` : ''}
                </div>
            `).join('');
            
            // Add event listeners for delete buttons
            dailyEventsElement.querySelectorAll('.delete-event').forEach(button => {
                button.addEventListener('click', function() {
                    const eventId = this.getAttribute('data-event-id');
                    deleteEvent(eventId);
                });
            });
        }
    }

    function getEventAlertType(type) {
        const types = {
            exercise: 'success',
            nutrition: 'warning',
            mental: 'info',
            sleep: 'primary',
            other: 'secondary'
        };
        return types[type] || 'secondary';
    }

    function saveHabits() {
        const dateString = formatDate(selectedDate);
        const habits = {};
        
        for (let i = 1; i <= 5; i++) {
            const checkbox = document.getElementById(`habit${i}`);
            habits[`habit${i}`] = checkbox.checked;
        }
        
        habitsData[dateString] = habits;
        localStorage.setItem('habitsData', JSON.stringify(habitsData));
        
        updateStats();
        showNotification('Progress kebiasaan sehat berhasil disimpan!');
    }

    function saveEvent() {
        const title = document.getElementById('event-title').value;
        const type = document.getElementById('event-type').value;
        const date = document.getElementById('event-date').value;
        const time = document.getElementById('event-time').value;
        const notes = document.getElementById('event-notes').value;
        
        if (!title) {
            alert('Judul aktivitas harus diisi!');
            return;
        }
        
        const event = {
            id: Date.now().toString(),
            title,
            type,
            date,
            time,
            notes
        };
        
        if (!eventsData[date]) {
            eventsData[date] = [];
        }
        
        eventsData[date].push(event);
        localStorage.setItem('eventsData', JSON.stringify(eventsData));
        
        // Close modal and reset form
        bootstrap.Modal.getInstance(document.getElementById('eventModal')).hide();
        eventForm.reset();
        
        // Update display
        renderCalendar();
        updateDailyEvents();
        updateStats();
        
        showNotification('Jadwal sehat berhasil ditambahkan!');
    }

    function deleteEvent(eventId) {
        for (const date in eventsData) {
            eventsData[date] = eventsData[date].filter(event => event.id !== eventId);
        }
        
        localStorage.setItem('eventsData', JSON.stringify(eventsData));
        updateDailyEvents();
        renderCalendar();
        updateStats();
        
        showNotification('Jadwal berhasil dihapus!');
    }

    function updateStats() {
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        let healthyDays = 0;
        let totalHabits = 0;
        let completedHabits = 0;
        let totalEvents = 0;
        
        // Calculate stats for current month
        for (const dateString in habitsData) {
            const date = new Date(dateString);
            if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
                const habits = habitsData[dateString];
                const completed = Object.values(habits).filter(Boolean).length;
                
                if (completed >= 3) { // Consider healthy if at least 3 habits completed
                    healthyDays++;
                }
                
                totalHabits += 5;
                completedHabits += completed;
            }
        }
        
        // Count events for current month
        for (const dateString in eventsData) {
            const date = new Date(dateString);
            if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
                totalEvents += eventsData[dateString].length;
            }
        }
        
        // Update UI
        document.getElementById('healthy-days').textContent = healthyDays;
        document.getElementById('completed-habits').textContent = totalHabits > 0 
            ? Math.round((completedHabits / totalHabits) * 100) + '%' 
            : '0%';
        document.getElementById('total-events').textContent = totalEvents;
        
        // Update progress bar (based on habit completion rate)
        const progressPercentage = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;
        document.getElementById('monthly-progress').style.width = progressPercentage + '%';
    }

    // Utility functions
    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    function formatDateForInput(date) {
        return date.toISOString().split('T')[0];
    }

    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'alert alert-success alert-dismissible fade show position-fixed';
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
        notification.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    // Set current date in event form when modal opens
    document.getElementById('eventModal').addEventListener('show.bs.modal', function() {
        document.getElementById('event-date').value = formatDateForInput(selectedDate);
    });
});