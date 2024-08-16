// Initialize data store from localStorage
let dataStore = JSON.parse(localStorage.getItem('zenxData')) || {};

// Format date to YYYY-MM-DD
function formatDate(date) {
    let [year, month, day] = date.split('-');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

// Get the correct date format from date input
function parseDateInput(inputDate) {
    let [year, month, day] = inputDate.split('-');
    return `${year}-${month}-${day}`;
}

// Get current date in YYYY-MM-DD format
function getCurrentDate() {
    let today = new Date();
    let yyyy = today.getFullYear();
    let mm = (today.getMonth() + 1).toString().padStart(2, '0');
    let dd = today.getDate().toString().padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

// Toggle Dark Mode
function toggleDarkMode() {
    let darkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', darkMode);
}

// Update UI
function updateUI() {
    updateSidebar();
    document.getElementById('journalInput').value = "";
    document.getElementById('taskInput').value = "";
}

// Add Task
function addTask() {
    let taskInput = document.getElementById('taskInput');
    if (taskInput.value.trim() !== "") {
        let date = getCurrentDate();
        if (!dataStore[date]) dataStore[date] = { tasks: [], journals: [], exercises: {} };
        dataStore[date].tasks.push(taskInput.value);
        localStorage.setItem('zenxData', JSON.stringify(dataStore));
        updateUI();
    }
}

// Toggle Task Completion
function toggleTask(checkbox) {
    checkbox.parentElement.style.textDecoration = checkbox.checked ? "line-through" : "none";
}

// Save Journal Entry
function saveJournal() {
    let journalInput = document.getElementById('journalInput');
    if (journalInput.value.trim() !== "") {
        let date = getCurrentDate();
        if (!dataStore[date]) dataStore[date] = { tasks: [], journals: [], exercises: {} };
        dataStore[date].journals.push(journalInput.value);
        localStorage.setItem('zenxData', JSON.stringify(dataStore));
        updateUI();
    }
}

// Set Exercise Count
function setExerciseCount(exerciseId, value) {
    let date = getCurrentDate();
    if (!dataStore[date]) dataStore[date] = { tasks: [], journals: [], exercises: {} };
    dataStore[date].exercises[exerciseId] = value || 0;
    localStorage.setItem('zenxData', JSON.stringify(dataStore));
    updateSidebar();
}

// Search Entries by Date
function searchByDate() {
    let searchInput = document.getElementById('searchDateInput').value;
    let searchResults = document.getElementById('searchResults');
    let standardizedDate = parseDateInput(searchInput);

    searchResults.innerHTML = ""; // Clear previous results

    if (standardizedDate && dataStore[standardizedDate]) {
        let result = dataStore[standardizedDate];
        searchResults.innerHTML = `
            <h3>Results for ${standardizedDate}</h3>
            <ul>
                <li><strong>Tasks:</strong> ${result.tasks.length ? result.tasks.map(task => `<p>${task}</p>`).join('') : 'No tasks'}</li>
                <li><strong>Journals:</strong> ${result.journals.length ? result.journals.map(journal => `<p>${journal}</p>`).join('') : 'No journal entries'}</li>
                <li><strong>Exercises:</strong> ${Object.entries(result.exercises).length ? Object.entries(result.exercises).map(([exercise, count]) => `<p>${exercise}: ${count}</p>`).join('') : 'No exercises tracked'}</li>
            </ul>
        `;
    } else {
        searchResults.innerHTML = `<p>No entries found for ${standardizedDate}</p>`;
    }
}

// Update Sidebar with Dates and Entries
function updateSidebar() {
    let dateList = document.getElementById('dateList');
    dateList.innerHTML = "";

    for (let date in dataStore) {
        let dateItem = document.createElement('li');
        dateItem.textContent = date;

        let taskList = dataStore[date].tasks.map(task => `<li>${task}</li>`).join('');
        let journalList = dataStore[date].journals.map(journal => `<li>${journal}</li>`).join('');
        let exerciseList = Object.entries(dataStore[date].exercises)
            .map(([exercise, count]) => `<li>${exercise}: ${count}</li>`).join('');
        let imageSection = dataStore[date].image ? `<img src="${dataStore[date].image}" alt="Daily Picture" style="max-width: 100%; height: auto;">` : '';

        let dateDetails = `
            <ul>
                <strong>Tasks:</strong> ${taskList}
                <strong>Journals:</strong> ${journalList}
                <strong>Exercises:</strong> ${exerciseList}
                ${imageSection}
            </ul>
        `;
        dateItem.innerHTML += dateDetails;
        dateList.appendChild(dateItem);
    }
}

// Initialize Sidebar and Dark Mode on Page Load
document.addEventListener('DOMContentLoaded', function () {
    updateSidebar();
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
});

// Toggle Sidebar Visibility
function toggleSidebar() {
    let sidebar = document.getElementById('sidebar');
    let mainContent = document.querySelector('main');
    let body = document.body;

    sidebar.classList.toggle('show');
    mainContent.classList.toggle('shift');

    // Toggle body scroll
    if (sidebar.classList.contains('show')) {
        body.classList.add('no-scroll');
        sidebar.focus(); // Focus on the sidebar
    } else {
        body.classList.remove('no-scroll');
    }
}


document.getElementById('sidebar').addEventListener('scroll', function(event) {
    event.stopPropagation();
});

// Ensure Sidebar Visibility on Resize
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        document.getElementById('sidebar').classList.add('show');
        document.querySelector('main').classList.add('shift');
    } else {
        document.getElementById('sidebar').classList.remove('show');
        document.querySelector('main').classList.remove('shift');
    }
});

// Clear Local Storage
function clearLocalStorage() {
    localStorage.removeItem('zenxData');
    localStorage.removeItem('darkMode');
    dataStore = {}; // Clear dataStore
    updateSidebar(); // Update sidebar after clearing
}

