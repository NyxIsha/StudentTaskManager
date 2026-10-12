import React, { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'daylight-tasks-v1';
const encouragements = [
  'Small steps still move you forward.',
  'One task at a time, okay?',
  'Progress, not perfection.',
  'Future you will appreciate this.',
  "Take a breath. You've got this.",
];
const tips = [
  'Try a 25-minute focus session, then take a little stretch break.',
  'Make your first step tiny. Starting is the hardest part.',
  'Put your phone in another room for one focus sprint.',
  'A quick water break counts as taking care of your future self.',
  'Pick one thing to finish before you open another tab.',
];
const categories = ['Study', 'Personal', 'Reading', 'Project'];

function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDailyEncouragement() {
  const dayNumber = Number(getToday().replaceAll('-', ''));
  return encouragements[dayNumber % encouragements.length];
}

function readTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) throw new Error('Saved task data is not a list.');
    return parsed.filter((task) =>
      task && typeof task.id === 'string' && typeof task.title === 'string',
    );
  } catch (error) {
    console.error('Unable to load saved tasks.', error);
    return [];
  }
}

function Icon({ name, size = 18 }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };
  const paths = {
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.2 4.2" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    chevron: <><path d="m9 18 6-6-6-6" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    edit: <><path d="m15 5 4 4M4 20l4.5-1 10-10a2.12 2.12 0 0 0-3-3l-10 10L4 20Z" /></>,
    trash: <><path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v7m6-7v7" /></>,
    sort: <><path d="M4 7h16M7 12h10m-7 5h4" /></>,
    sparkle: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z" /><path d="m19 14 1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z" /></>,
    heart: <><path d="M20.8 8.7c0 5.4-8.8 10.3-8.8 10.3S3.2 14.1 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z" /></>,
    moon: <><path d="M20.8 13A8.5 8.5 0 0 1 11 3.2 8.5 8.5 0 1 0 20.8 13Z" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    closeCircle: <><circle cx="12" cy="12" r="9" /><path d="m9 9 6 6m0-6-6 6" /></>,
  };
  return <svg {...common}>{paths[name] || paths.sparkle}</svg>;
}

function PetIllustration({ mood = 'happy', sleeping = false }) {
  return (
    <svg className={`mochi-art mood-${mood}${sleeping ? ' is-sleeping' : ''}`} viewBox="0 0 150 150" role="img" aria-label={`Mochi the ${mood} cream cat`}>
      <ellipse cx="76" cy="132" rx="43" ry="8" fill="#e8e4d9" opacity=".55" />
      <path className="mochi-tail" d="M112 104c20 3 24 18 15 27-6 6-16 3-15-4 1-5 8-5 10-1" fill="none" stroke="#e7cfae" strokeWidth="10" strokeLinecap="round" />
      <path d="M48 99c-9 8-9 20 0 25 8 5 17-2 16-10m22-15c10 8 10 20 1 25-8 5-17-2-16-10" fill="#f6e8d5" stroke="#dfc8a8" strokeWidth="2" />
      <ellipse cx="75" cy="97" rx="39" ry="31" fill="#fbf1e3" stroke="#dfc8a8" strokeWidth="2.5" />
      <path d="M40 54 37 23c-.4-4 4-6 7-3l19 17m40 17 3-31c.4-4-4-6-7-3L80 38" fill="#fbf1e3" stroke="#dfc8a8" strokeWidth="3" strokeLinejoin="round" />
      <path d="m45 31 14 12-17 1Zm56 0L87 43l17 1Z" fill="#e8bdb3" />
      <ellipse cx="75" cy="66" rx="42" ry="36" fill="#fff7eb" stroke="#dfc8a8" strokeWidth="2.5" />
      <path d="M55 43c4-5 12-6 17-2m7 0c5-4 13-3 17 2" fill="none" stroke="#b9c6a8" strokeWidth="5" strokeLinecap="round" />
      <path className="eye eye-left" d={sleeping ? 'M54 65q7 6 14 0' : 'M57 61a3.5 4.5 0 1 0 0 .1'} fill={sleeping ? 'none' : '#50473f'} stroke="#50473f" strokeWidth={sleeping ? 2 : 1} />
      <path className="eye eye-right" d={sleeping ? 'M79 65q7 6 14 0' : 'M81 61a3.5 4.5 0 1 0 0 .1'} fill={sleeping ? 'none' : '#50473f'} stroke="#50473f" strokeWidth={sleeping ? 2 : 1} />
      <ellipse cx="49" cy="73" rx="7" ry="4" fill="#efbdb5" opacity=".75" />
      <ellipse cx="101" cy="73" rx="7" ry="4" fill="#efbdb5" opacity=".75" />
      <path className="mochi-mouth" d="M72 70q3 4 6 0m-3 0v4q-4 5-8 0m8 0q4 5 8 0" fill="none" stroke="#806258" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M43 92c11 8 52 8 64 0" fill="none" stroke="#b4c3a4" strokeWidth="7" strokeLinecap="round" />
      <path d="m74 90 5 0-2.5 4Z" fill="#f0c9bc" />
      {mood === 'concerned' && <><path d="M54 53q7-5 13 0m14 0q7-5 13 0" fill="none" stroke="#8d7668" strokeWidth="2" strokeLinecap="round" /></>}
      {mood === 'thinking' && <><path d="M112 42q7-10 11-3" fill="none" stroke="#b8c5aa" strokeWidth="2.5" strokeLinecap="round" /><circle cx="121" cy="31" r="2" fill="#b8c5aa" /></>}
      {sleeping && <><text x="110" y="44" className="sleep-z">z</text><text x="122" y="31" className="sleep-z sleep-z-small">z</text></>}
    </svg>
  );
}

function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const overdue = !task.completed && task.dueDate && task.dueDate < getToday();
  const dueToday = task.dueDate === getToday();
  const dateLabel = task.dueDate
    ? dueToday
      ? 'Today'
      : new Date(`${task.dueDate}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'No due date';
  return (
    <article className={`task-row${task.completed ? ' task-done' : ''}`}>
      <button className={`task-check${task.completed ? ' checked' : ''}`} onClick={() => onToggle(task.id)} aria-label={task.completed ? `Mark ${task.title} as incomplete` : `Complete ${task.title}`}>
        {task.completed && <Icon name="check" size={15} />}
      </button>
      <div className="task-copy">
        <div className="task-title-line"><h3>{task.title}</h3>{task.priority === 'High' && <span className="priority-dot" title="High priority" />}</div>
        {task.notes && <p className="task-notes">{task.notes}</p>}
        <div className="task-meta">
          <span className={`category-chip category-${task.category.toLowerCase()}`}>{task.category}</span>
          <span className={`due-date${overdue ? ' overdue' : ''}`}><Icon name="calendar" size={13} />{overdue ? 'Overdue · ' : ''}{dateLabel}</span>
        </div>
      </div>
      <div className="task-actions">
        <button className="icon-button" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`}><Icon name="edit" size={16} /></button>
        <button className="icon-button delete-action" onClick={() => onDelete(task.id)} aria-label={`Delete ${task.title}`}><Icon name="trash" size={16} /></button>
      </div>
    </article>
  );
}

function TaskForm({ task, onSave, onCancel }) {
  const [title, setTitle] = useState(task?.title || '');
  const [category, setCategory] = useState(task?.category || 'Study');
  const [priority, setPriority] = useState(task?.priority || 'Medium');
  const [dueDate, setDueDate] = useState(task?.dueDate || '');
  const [notes, setNotes] = useState(task?.notes || '');

  function submit(event) {
    event.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), category, priority, dueDate, notes: notes.trim() });
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
      <form className="task-form" onSubmit={submit}>
        <div className="form-heading"><div><span className="eyebrow">{task ? 'MAKE A LITTLE PROGRESS' : 'A FRESH LITTLE START'}</span><h2>{task ? 'Edit your task' : 'Add a task'}</h2></div><button type="button" className="icon-button" onClick={onCancel} aria-label="Close form"><Icon name="close" /></button></div>
        <label className="field-label">What would you like to do?<input autoFocus required maxLength={100} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Review biology notes" /></label>
        <label className="field-label">A little more detail <span className="optional">(optional)</span><textarea rows={2} maxLength={240} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Add a note to your future self..." /></label>
        <div className="form-grid">
          <label className="field-label">Category<select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="field-label">Priority<select value={priority} onChange={(event) => setPriority(event.target.value)}><option>Low</option><option>Medium</option><option>High</option></select></label>
        </div>
        <label className="field-label">Due date <span className="optional">(optional)</span><input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></label>
        <div className="form-buttons"><button type="button" className="button button-quiet" onClick={onCancel}>Cancel</button><button type="submit" className="button button-primary"><Icon name="plus" size={17} />{task ? 'Save changes' : 'Add to my list'}</button></div>
      </form>
    </div>
  );
}

function StudyPet({ pendingCount, overdueCount, reaction, onClearReaction }) {
  const [collapsed, setCollapsed] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [muted, setMuted] = useState(false);
  const [tipIndex, setTipIndex] = useState(-1);
  const manyTasks = pendingCount >= 6;
  const sleeping = pendingCount === 0 && !reaction;
  const mood = reaction === 'complete' || reaction === 'add'
    ? 'happy'
    : overdueCount > 0
      ? 'concerned'
      : manyTasks
        ? 'thinking'
        : sleeping
          ? 'sleepy'
          : 'happy';
  const message = reaction === 'add'
    ? 'One step closer! ✨'
    : reaction === 'complete'
      ? 'Yay! You did it!'
      : pendingCount === 0
        ? "All done! You've earned a little rest."
        : overdueCount > 0
          ? "Let's tackle this one next."
          : manyTasks
            ? 'Lots on your plate? Start with one high-priority task.'
            : `Hey, ready for a fresh start? You have ${pendingCount} ${pendingCount === 1 ? 'task' : 'tasks'} to take at your own pace.`;
  useEffect(() => {
    if (!reaction) return undefined;
    const timeout = window.setTimeout(onClearReaction, 3400);
    return () => window.clearTimeout(timeout);
  }, [reaction, onClearReaction]);
  if (dismissed) return null;
  if (collapsed) {
    return <button className={`pet-orb${muted ? ' motion-muted' : ''}`} onClick={() => setCollapsed(false)} aria-label="Open Mochi, your study buddy"><PetIllustration mood={mood} sleeping={sleeping} /><span className="orb-sparkle">✦</span></button>;
  }
  return (
    <aside className={`study-pet${muted ? ' motion-muted' : ''}`} aria-label="Mochi, your study buddy">
      <div className="pet-toolbar"><span className="pet-status"><span /> HERE FOR YOU</span><div className="pet-tools"><button onClick={() => setMuted((value) => !value)} className="pet-tool" aria-label={muted ? 'Enable animations' : 'Reduce animations'} title={muted ? 'Enable animations' : 'Reduce animations'}><Icon name={muted ? 'sparkle' : 'moon'} size={15} /></button><button onClick={() => setCollapsed(true)} className="pet-tool" aria-label="Minimize Mochi"><span className="minimize-mark" /></button><button onClick={() => setDismissed(true)} className="pet-tool" aria-label="Dismiss Mochi"><Icon name="close" size={16} /></button></div></div>
      <div className={`pet-body${reaction ? ' pet-celebrate' : ''}`}>
        <div className="pet-art-wrap"><PetIllustration mood={mood} sleeping={sleeping} />{reaction === 'complete' && <span className="celebration-sparkle sparkle-one">✦</span>}{reaction === 'complete' && <span className="celebration-sparkle sparkle-two">♡</span>}</div>
        <div className="pet-copy"><span className="pet-name">Mochi <span>· your study buddy</span></span><p className="pet-message" aria-live="polite">{message}</p></div>
      </div>
      <div className="pet-footer"><p><Icon name="heart" size={14} /><span>{tipIndex < 0 ? getDailyEncouragement() : tips[tipIndex]}</span></p><button onClick={() => setTipIndex((index) => (index + 1) % tips.length)} className="tip-button"><Icon name="sparkle" size={14} /> Need a tip?</button></div>
    </aside>
  );
}

function App() {
  const [tasks, setTasks] = useState(readTasks);
  const [filter, setFilter] = useState('All tasks');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('priority');
  const [formTask, setFormTask] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [petReaction, setPetReaction] = useState('');
  const [toast, setToast] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Unable to save tasks to local storage.', error);
      setToast('Your browser could not save changes locally.');
    }
  }, [tasks]);

  const pending = tasks.filter((task) => !task.completed);
  const completed = tasks.filter((task) => task.completed);
  const overdueCount = pending.filter((task) => task.dueDate && task.dueDate < getToday()).length;
  const todayCount = pending.filter((task) => task.dueDate === getToday()).length;
  const filteredTasks = useMemo(() => {
    let result = tasks.filter((task) => {
      const matchesFilter = filter === 'All tasks' ||
        (filter === 'To do' && !task.completed) ||
        (filter === 'Completed' && task.completed) ||
        (filter === 'Today' && task.dueDate === getToday() && !task.completed);
      const matchesSearch = `${task.title} ${task.category} ${task.notes || ''}`.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
    result = [...result].sort((a, b) => {
      if (sortBy === 'priority') {
        const rank = { High: 0, Medium: 1, Low: 2 };
        return Number(a.completed) - Number(b.completed) || rank[a.priority] - rank[b.priority] || (a.dueDate || '9999').localeCompare(b.dueDate || '9999');
      }
      if (sortBy === 'dueDate') return (a.dueDate || '9999').localeCompare(b.dueDate || '9999');
      if (sortBy === 'created') return b.createdAt - a.createdAt;
      return a.title.localeCompare(b.title);
    });
    return result;
  }, [tasks, filter, search, sortBy]);

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2800);
  }

  function saveTask(values) {
    if (formTask?.id) {
      setTasks((current) => current.map((task) => task.id === formTask.id ? { ...task, ...values } : task));
      notify('Your task has been updated.');
    } else {
      setTasks((current) => [{ ...values, id: crypto.randomUUID(), completed: false, createdAt: Date.now() }, ...current]);
      setPetReaction('add');
    }
    setFormOpen(false);
    setFormTask(null);
  }

  function toggleTask(id) {
    const task = tasks.find((item) => item.id === id);
    if (task && !task.completed) {
      setPetReaction('complete');
      setTimeout(() => setPetReaction(''), 3400);
    }
    setTasks((current) => current.map((item) => item.id === id ? { ...item, completed: !item.completed } : item));
  }

  function deleteTask(id) {
    setTasks((current) => current.filter((task) => task.id !== id));
    notify('Task removed from your list.');
  }

  const formattedDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="app-shell">
      <aside className={`sidebar${mobileNavOpen ? ' nav-open' : ''}`}>
        <a className="brand" href="#" aria-label="DAYLIGHT home"><span className="brand-mark"><Icon name="sun" size={21} /></span><span>daylight<span className="brand-dot">.</span><small>A LITTLE MORE DOABLE</small></span></a>
        <div className="nav-label">YOUR SPACE</div>
        <nav className="main-nav" aria-label="Task filters">
          {[['All tasks', 'sun', tasks.length], ['Today', 'calendar', todayCount], ['To do', 'sparkle', pending.length], ['Completed', 'check', completed.length]].map(([name, icon, count]) => (
            <button className={`nav-item${filter === name ? ' active' : ''}`} key={name} onClick={() => { setFilter(name); setMobileNavOpen(false); }}><Icon name={icon} size={18} /><span>{name}</span><span className="nav-count">{count}</span></button>
          ))}
        </nav>
        <div className="sidebar-divider" />
        <div className="sidebar-note"><div className="note-icon"><Icon name="heart" size={16} /></div><p>Make space for<br />one thing at a time.</p><span>You’re doing just fine.</span></div>
        <div className="sidebar-bottom"><div className="avatar">Y</div><div className="profile-copy"><strong>Your study space</strong><span>One day at a time</span></div><button className="icon-button profile-more" aria-label="Your profile"><Icon name="menu" size={18} /></button></div>
      </aside>
      {mobileNavOpen && <button className="mobile-scrim" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation" />}
      <main className="main-content">
        <header className="topbar"><button className="mobile-menu icon-button" onClick={() => setMobileNavOpen((open) => !open)} aria-label="Toggle navigation"><Icon name="menu" /></button><div className="breadcrumb">MY SPACE <Icon name="chevron" size={13} /><span>{filter.toUpperCase()}</span></div><div className="topbar-date"><Icon name="sun" size={16} /> {formattedDate}</div></header>
        <section className="welcome-section"><div><span className="eyebrow">A NEW DAY, AT YOUR OWN PACE</span><h1>Let’s make today<br className="mobile-break" /> <em>a little lighter.</em></h1><p>Small steps count. What feels doable today?</p></div><div className="welcome-sun" aria-hidden="true"><span>☼</span></div></section>
        <section className="overview-grid" aria-label="Your task overview">
          <div className="overview-card overview-primary"><span className="overview-icon"><Icon name="sparkle" size={18} /></span><div><span className="overview-label">ON YOUR MIND</span><strong>{pending.length.toString().padStart(2, '0')}<small> tasks</small></strong></div><span className="card-decoration">✳</span></div>
          <div className="overview-card"><span className="overview-icon icon-peach"><Icon name="calendar" size={18} /></span><div><span className="overview-label">DUE TODAY</span><strong>{todayCount.toString().padStart(2, '0')}<small> tasks</small></strong></div></div>
          <div className="overview-card"><span className="overview-icon icon-lavender"><Icon name="check" size={18} /></span><div><span className="overview-label">LITTLE WINS</span><strong>{completed.length.toString().padStart(2, '0')}<small> done</small></strong></div></div>
        </section>
        <section className="quote-strip"><span className="quote-mark">“</span><p>{getDailyEncouragement()}</p><span className="quote-credit">A LITTLE NOTE FROM MOCHI</span><span className="quote-flower">✿</span></section>
        <section className="tasks-section">
          <div className="tasks-heading"><div><span className="eyebrow">YOUR GENTLE TO-DO LIST</span><h2>{filter === 'All tasks' ? 'The little things' : filter}</h2></div><button className="button button-primary add-task-button" onClick={() => { setFormTask(null); setFormOpen(true); }}><Icon name="plus" size={18} /><span>New task</span></button></div>
          <div className="task-controls"><label className="search-box"><Icon name="search" size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a task..." aria-label="Search tasks" />{search && <button onClick={() => setSearch('')} className="clear-search" aria-label="Clear search"><Icon name="close" size={15} /></button>}</label><label className="sort-select"><Icon name="sort" size={17} /><select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort tasks"><option value="priority">Priority</option><option value="dueDate">Due date</option><option value="created">Recently added</option><option value="title">Name</option></select></label></div>
          {filteredTasks.length > 0 ? <div className="task-list">{filteredTasks.map((task) => <TaskItem key={task.id} task={task} onToggle={toggleTask} onEdit={(item) => { setFormTask(item); setFormOpen(true); }} onDelete={deleteTask} />)}</div> : <div className="empty-state"><div className="empty-illustration"><PetIllustration mood="sleepy" sleeping /></div><h3>{search ? 'No little things found' : filter === 'Completed' ? 'Your wins will live here' : filter === 'Today' ? 'Nothing due today' : pending.length === 0 ? 'A little breathing room' : 'A clear little corner'}</h3><p>{search ? 'Try another word, or clear your search.' : filter === 'Completed' ? 'Complete a task and give yourself credit.' : pending.length === 0 ? 'Add a task whenever you feel ready. No rush.' : 'Nothing on this list just yet. Add a task when you’re ready.'}</p>{filter !== 'Completed' && <button onClick={() => { setFormTask(null); setFormOpen(true); }} className="text-button"><Icon name="plus" size={15} /> Add your first task</button>}</div>}
          {overdueCount > 0 && <p className="gentle-reminder"><span>☁</span> You have {overdueCount} overdue {overdueCount === 1 ? 'task' : 'tasks'}. No pressure — take one small step when you’re ready.</p>}
        </section>
        <footer className="page-footer"><span>Made for softer, steadier days</span><span>DAYLIGHT <span className="brand-dot">✳</span></span></footer>
      </main>
      <StudyPet pendingCount={pending.length} overdueCount={overdueCount} reaction={petReaction} onClearReaction={() => setPetReaction('')} />
      {formOpen && <TaskForm task={formTask} onSave={saveTask} onCancel={() => { setFormOpen(false); setFormTask(null); }} />}
      {toast && <div className="toast" role="status"><Icon name="check" size={16} />{toast}</div>}
    </div>
  );
}

export default App;
