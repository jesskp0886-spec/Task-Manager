(function () {
    const STORAGE_KEY = 'ledger.tasks.v1';

    /* ---------- state ---------- */
    let tasks = [];
    let editingId = null;
    let activeFilter = 'all';
    let searchTerm = '';

    /* ---------- elements ---------- */
    const form = document.getElementById('taskForm');
    const titleInput = document.getElementById('title');
    const descInput = document.getElementById('description');
    const dueInput = document.getElementById('dueDate');
    const idInput = document.getElementById('taskId');
    const titleError = document.getElementById('titleError');
    const dueDateError = document.getElementById('dueDateError');
    const submitBtn = document.getElementById('submitBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const formHeading = document.getElementById('formHeading');
    const formSub = document.getElementById('formSub');
    const taskList = document.getElementById('taskList');
    const countLine = document.getElementById('countLine');
    const openCount = document.getElementById('openCount');
    const searchInput = document.getElementById('searchInput');
    const filterChips = document.getElementById('filterChips');
    const toast = document.getElementById('toast');

    /* ---------- storage ---------- */
    function loadTasks() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            tasks = raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error('Could not read saved tasks:', e);
            tasks = [];
        }
    }

    function saveTasks() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch (e) {
            console.error('Could not save tasks:', e);
            showToast('Could not save — storage unavailable');
        }
    }

    /* ---------- helpers ---------- */
    function uid() {
        return 't-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function formatDate(iso) {
        if (!iso) return '';
        const [y, m, d] = iso.split('-').map(Number);
        const dt = new Date(y, m - 1, d);
        return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function isOverdue(iso) {
        if (!iso) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [y, m, d] = iso.split('-').map(Number);
        return new Date(y, m - 1, d) < today;
    }

    function showToast(msg) {
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(showToast._t);
        showToast._t = setTimeout(() => toast.classList.remove('show'), 1800);
    }

    function clearErrors() {
        titleInput.classList.remove('err');
        dueInput.classList.remove('err');
        titleError.classList.remove('show');
        dueDateError.classList.remove('show');
    }

    function resetForm() {
        form.reset();
        idInput.value = '';
        editingId = null;
        document.getElementById('p-medium').checked = true;
        formHeading.textContent = 'New Task';
        formSub.textContent = 'Create a task and assign it a priority.';
        submitBtn.textContent = 'Add task';
        cancelEditBtn.style.display = 'none';
        clearErrors();
    }

    /* ---------- CRUD ---------- */
    function addTask(data) {
        const task = {
            id: uid(),
            title: data.title.trim(),
            description: data.description.trim(),
            dueDate: data.dueDate,
            priority: data.priority,
            createdAt: Date.now()
        };
        tasks.unshift(task);
        saveTasks();
        displayTasks();
        showToast('Task added');
    }

    function updateTask(id, data) {
        const task = tasks.find(t => t.id === id);
        if (!task) return;
        task.title = data.title.trim();
        task.description = data.description.trim();
        task.dueDate = data.dueDate;
        task.priority = data.priority;
        saveTasks();
        displayTasks();
        showToast('Task updated');
    }

    function deleteTask(id) {
        const task = tasks.find(t => t.id === id);
        if (task && !confirm('Delete "' + task.title + '"? This cannot be undone.')) return;
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        displayTasks();
        showToast('Task deleted');
        if (editingId === id) resetForm();
    }

    function editTask(id) {
        const task = tasks.find(t => t.id === id);
        if (!task) return;
        editingId = id;
        idInput.value = task.id;
        titleInput.value = task.title;
        descInput.value = task.description;
        dueInput.value = task.dueDate;
        document.getElementById('p-' + task.priority).checked = true;
        formHeading.textContent = 'Edit Task';
        formSub.textContent = 'Editing "' + task.title + '".';
        submitBtn.textContent = 'Update task';
        cancelEditBtn.style.display = 'block';
        clearErrors();
        titleInput.focus();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /* ---------- rendering ---------- */
    function getVisibleTasks() {
        return tasks.filter(t => {
            const matchesFilter = activeFilter === 'all' || t.priority === activeFilter;
            const term = searchTerm.trim().toLowerCase();
            const matchesSearch = !term ||
                t.title.toLowerCase().includes(term) ||
                t.description.toLowerCase().includes(term);
            return matchesFilter && matchesSearch;
        });
    }

    function displayTasks() {
        const visible = getVisibleTasks();

        openCount.textContent = tasks.length + (tasks.length === 1 ? ' task open' : ' tasks open');
        countLine.textContent = visible.length + (visible.length === 1 ? ' entry' : ' entries') +
            (activeFilter !== 'all' ? ' · ' + activeFilter : '') +
            (searchTerm ? ' · "' + searchTerm + '"' : '');

        if (visible.length === 0) {
            const msg = tasks.length === 0
                ? ['No tasks yet', 'Add your first task using the form on the left.']
                : ['No matching tasks', 'Try a different search term or filter.'];
            taskList.innerHTML =
                '<div class="empty-state">' +
                '<div class="glyph">✓</div>' +
                '<h3>' + msg[0] + '</h3>' +
                '<p>' + msg[1] + '</p>' +
                '</div>';
            return;
        }

        taskList.innerHTML = visible.map(t => {
            const overdue = isOverdue(t.dueDate);
            return (
                '<article class="task-card" data-id="' + t.id + '">' +
                '<div class="task-tab ' + t.priority + '"></div>' +
                '<div class="task-body">' +
                '<div class="task-top">' +
                '<h3 class="task-title">' + escapeHtml(t.title) + '</h3>' +
                '<div class="task-actions">' +
                '<button class="icon-btn edit-btn" title="Edit" aria-label="Edit task">✎</button>' +
                '<button class="icon-btn delete delete-btn" title="Delete" aria-label="Delete task">✕</button>' +
                '</div>' +
                '</div>' +
                (t.description ? '<p class="task-desc">' + escapeHtml(t.description) + '</p>' : '') +
                '<div class="task-meta">' +
                '<span class="badge ' + t.priority + '">' + t.priority + '</span>' +
                '<span class="badge due' + (overdue ? ' overdue' : '') + '">' +
                (overdue ? 'Overdue · ' : 'Due ') + formatDate(t.dueDate) +
                '</span>' +
                '</div>' +
                '</div>' +
                '</article>'
            );
        }).join('');
    }

    /* ---------- validation ---------- */
    function validate() {
        clearErrors();
        let valid = true;
        if (!titleInput.value.trim()) {
            titleInput.classList.add('err');
            titleError.classList.add('show');
            valid = false;
        }
        if (!dueInput.value) {
            dueInput.classList.add('err');
            dueDateError.classList.add('show');
            valid = false;
        }
        return valid;
    }

    /* ---------- events ---------- */
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validate()) return;

        const data = {
            title: titleInput.value,
            description: descInput.value,
            dueDate: dueInput.value,
            priority: form.priority.value
        };

        if (editingId) {
            updateTask(editingId, data);
        } else {
            addTask(data);
        }
        resetForm();
    });

    cancelEditBtn.addEventListener('click', resetForm);

    taskList.addEventListener('click', function (e) {
        const card = e.target.closest('.task-card');
        if (!card) return;
        const id = card.getAttribute('data-id');
        if (e.target.closest('.edit-btn')) editTask(id);
        if (e.target.closest('.delete-btn')) deleteTask(id);
    });

    filterChips.addEventListener('click', function (e) {
        const chip = e.target.closest('.chip');
        if (!chip) return;
        activeFilter = chip.getAttribute('data-filter');
        [...filterChips.children].forEach(c => c.classList.toggle('active', c === chip));
        displayTasks();
    });

    searchInput.addEventListener('input', function (e) {
        searchTerm = e.target.value;
        displayTasks();
    });

    /* ---------- init ---------- */
    document.getElementById('todayDate').textContent = new Date().toLocaleDateString(undefined, {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });

    loadTasks();
    displayTasks();
})();