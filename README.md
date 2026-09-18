# TaskFlow — Task Manager

A clean, single-page task manager built with vanilla HTML, CSS, and JavaScript. Create, edit, filter, search, and track tasks with priority levels and due dates — all stored locally in the browser.

🔗 **Live Demo:** 

https://drive.google.com/file/d/1NQSeoiJw_a1u-sAsmDvsuI35s15MoJRa/view?usp=sharing

## Screenshots

| Full Page |

| ![Task Manager/Full Page.png](https://github.com/jesskp0886-spec/JavaScript/blob/ca3fe0b7430b586a17a0bb8ded991db078ae8b79/Task%20Manager/Full%20Page.png) |

| Task Form | 

| ![Task Manager/Task From.png](https://github.com/jesskp0886-spec/JavaScript/blob/f145a31b568063222deed1ef1e3e766929a93ba5/Task%20Manager/Task%20From.png) |

| Task List |

| ![Task Manager/Task List.png](https://github.com/jesskp0886-spec/JavaScript/blob/f145a31b568063222deed1ef1e3e766929a93ba5/Task%20Manager/Task%20List.png) |

| Overdue Task | 

| ![Task Manager/Overdue Task.png](https://github.com/jesskp0886-spec/JavaScript/blob/f145a31b568063222deed1ef1e3e766929a93ba5/Task%20Manager/Overdue%20Task.png) | 

| Search & Filter |

| ![Task Manager/Filter.png](https://github.com/jesskp0886-spec/JavaScript/blob/f145a31b568063222deed1ef1e3e766929a93ba5/Task%20Manager/Filter.png) | 


## Features

- **Add / Edit / Delete tasks** — full CRUD with inline form editing
- **Priority levels** — Low, Medium, High, each with distinct color-coded badges
- **Due dates** — with automatic overdue detection and highlighting
- **Search** — filter tasks live by title or description
- **Filter chips** — quickly view tasks by priority (All / Low / Medium / High)
- **Persistent storage** — tasks are saved to `localStorage`, so they persist across page reloads
- **Form validation** — required fields (title, due date) are validated with inline error messages
- **Toast notifications** — lightweight feedback for add/update/delete actions
- **Responsive layout** — adapts to smaller screens (form stacks above the task list)

## File Structure

```
.
├── index.html          # Page markup and structure
├── style.css           # Styling, layout, and theme (CSS custom properties)
├── script.js           # App logic: state, CRUD operations, rendering, events
├── screenshots/        # Images used in README (app previews)
│   ├── task-form.png
│   ├── task-list.png
│   ├── overdue-task.png
│   └── search-filter.png
└── README.md           # Project documentation
```

## Getting Started

No build step or dependencies required.

1. Download or clone the three files (`index.html`, `style.css`, `script.js`) into the same folder.
2. Open `index.html` directly in a web browser.

That's it — the app runs entirely client-side.

## Usage

1. **Add a task** — fill in a title (required), optional description, due date (required), and pick a priority, then click **Add task**.
2. **Edit a task** — click the pencil (✎) icon on any task card; the form switches to edit mode. Click **Update task** to save, or **Cancel** to discard changes.
3. **Delete a task** — click the ✕ icon; you'll be asked to confirm before it's removed.
4. **Search** — type into the search box to filter tasks by title or description in real time.
5. **Filter by priority** — use the chip buttons (All, Low, Medium, High) above the task list.
6. **Overdue tasks** — any task with a due date in the past is automatically flagged with an "Overdue" badge.

## Tech Stack

- **HTML5** — semantic markup
- **CSS3** — custom properties (CSS variables) for theming, flexbox/grid layout, responsive breakpoints
- **Vanilla JavaScript (ES6+)** — no frameworks or build tools
- **Google Fonts** — [Inter](https://fonts.google.com/specimen/Inter)
- **Bootstrap Icons** — icon font (loaded via CDN)
- **Browser `localStorage`** — client-side data persistence


## Browser Support

Works in any modern browser that supports `localStorage`, ES6 JavaScript, and CSS custom properties (Chrome, Firefox, Safari, Edge — recent versions).

## Notes / Limitations

- Data is stored **locally per browser** — it will not sync across devices and will be lost if browser storage is cleared.
- There is no backend, authentication, or multi-user support; this is a self-contained front-end demo/tool.
