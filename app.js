// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    const notesList = document.getElementById('notes-list');
    const noteInput = document.getElementById('note-input');
    const addBtn = document.getElementById('add-btn');
    const offlineStatus = document.getElementById('offline-status');

    // Загрузка заметок
    let notes = JSON.parse(localStorage.getItem('notes') || '[]');
    renderNotes();

    // Обработчик добавления
    addBtn.addEventListener('click', () => {
        const text = noteInput.value.trim();
        if (text) {
            const newNote = {
                id: Date.now(),
                text: text,
                date: new Date().toLocaleString()
            };
            notes.unshift(newNote);
            saveNotes();
            renderNotes();
            noteInput.value = '';
        }
    });

    // Удаление заметки
    notesList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const id = parseInt(e.target.dataset.id);
            notes = notes.filter(note => note.id !== id);
            saveNotes();
            renderNotes();
        }
    });

    // Проверка соединения
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();

    function updateOnlineStatus() {
        offlineStatus.classList.toggle('active', !navigator.onLine);
    }

    function saveNotes() {
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    function renderNotes() {
        notesList.innerHTML = notes.map(note => `
            <div class="note-card">
                <div class="note-text">${note.text}</div>
                <div class="note-date">${note.date}</div>
                <button class="delete-btn" data-id="${note.id}">Удалить</button>
            </div>
        `).join('');
    }
});

// Регистрация Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => console.log('SW registered'))
            .catch(err => console.log('SW registration failed: ', err));
    });
}