/**
 * Guest Demo Mode — local data utilities
 *
 * All guest data lives in localStorage under prefixed keys.
 * It is cleared when the guest explicitly logs out.
 */

const KEYS = {
  tasks: 'synora_guest_tasks',
  notes: 'synora_guest_notes',
};

// ─── Helpers ────────────────────────────────────────────────────────────────

const days = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
};

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ─── Seed Data ───────────────────────────────────────────────────────────────

export const SEED_TASKS = [
  {
    _id: 'gt1',
    subject: 'Mathematics',
    topic: 'Chapter 7 — Differential Equations',
    deadline: days(2),
    difficulty: 'hard',
    importance: 5,
    estimatedTime: 90,
    completed: false,
    priorityScore: 94,
    createdAt: days(-3),
  },
  {
    _id: 'gt2',
    subject: 'Physics',
    topic: 'Wave Optics — Interference & Diffraction',
    deadline: days(4),
    difficulty: 'hard',
    importance: 4,
    estimatedTime: 60,
    completed: false,
    priorityScore: 81,
    createdAt: days(-5),
  },
  {
    _id: 'gt3',
    subject: 'Computer Science',
    topic: 'Graph Algorithms — BFS & DFS',
    deadline: days(1),
    difficulty: 'medium',
    importance: 5,
    estimatedTime: 45,
    completed: false,
    priorityScore: 88,
    createdAt: days(-2),
  },
  {
    _id: 'gt4',
    subject: 'Chemistry',
    topic: 'Organic Reactions — Nucleophilic Substitution',
    deadline: days(6),
    difficulty: 'medium',
    importance: 3,
    estimatedTime: 50,
    completed: false,
    priorityScore: 63,
    createdAt: days(-4),
  },
  {
    _id: 'gt5',
    subject: 'Mathematics',
    topic: 'Chapter 6 — Integrals (Practice Sheet)',
    deadline: days(-1),
    difficulty: 'medium',
    importance: 4,
    estimatedTime: 60,
    completed: true,
    priorityScore: 75,
    createdAt: days(-8),
  },
  {
    _id: 'gt6',
    subject: 'Computer Science',
    topic: 'Dynamic Programming — Knapsack Problem',
    deadline: days(8),
    difficulty: 'hard',
    importance: 4,
    estimatedTime: 75,
    completed: false,
    priorityScore: 72,
    createdAt: days(-1),
  },
  {
    _id: 'gt7',
    subject: 'Physics',
    topic: 'Electrostatics — Gauss\'s Law',
    deadline: days(3),
    difficulty: 'medium',
    importance: 3,
    estimatedTime: 40,
    completed: true,
    priorityScore: 60,
    createdAt: days(-6),
  },
  {
    _id: 'gt8',
    subject: 'English',
    topic: 'Essay — Climate Change & Its Impact',
    deadline: days(10),
    difficulty: 'easy',
    importance: 2,
    estimatedTime: 30,
    completed: false,
    priorityScore: 38,
    createdAt: days(-1),
  },
];

export const SEED_NOTES = [
  {
    _id: 'gn1',
    title: 'Differential Equations Cheatsheet',
    content:
      'Order & Degree:\n- Order: highest derivative\n- Degree: power of highest derivative\n\nSeparable: dy/dx = f(x)g(y)\n→ ∫dy/g(y) = ∫f(x)dx\n\nLinear 1st order: dy/dx + P(x)y = Q(x)\n→ Integrating factor: e^∫P(x)dx',
    createdAt: days(-3),
  },
  {
    _id: 'gn2',
    title: 'Graph Algorithms — Key Points',
    content:
      'BFS: Queue-based, shortest path in unweighted graphs, O(V+E)\nDFS: Stack/recursion, cycle detection, topological sort, O(V+E)\n\nDijkstra: weighted shortest path, O((V+E) log V)\nBellman-Ford: handles negative weights, O(VE)',
    createdAt: days(-5),
  },
  {
    _id: 'gn3',
    title: 'Study Plan — This Week',
    content:
      'Mon: Math Integrals revision ✅\nTue: Physics Wave Optics (2hrs)\nWed: CS Graph Algorithms + coding practice\nThu: Chemistry organic reactions\nFri: Math Differential Equations\nSat: Mock test + review\nSun: Rest 🧘',
    createdAt: days(-1),
  },
];

export const GUEST_ANALYTICS = {
  totalTasks: 8,
  completedTasks: 2,
  completionRate: 25,
  streak: 3,
  totalFocusTime: 95,
  insights: [
    'You tend to delay Physics tasks — try scheduling them earlier in the day when focus is highest.',
    'Your CS tasks have the highest completion rate. Leverage this strength!',
    'Starting Math tasks at least 3 days before the deadline improves completion by 40%.',
  ],
  trend: [
    { name: 'Mon', completed: 0 },
    { name: 'Tue', completed: 1 },
    { name: 'Wed', completed: 0 },
    { name: 'Thu', completed: 1 },
    { name: 'Fri', completed: 0 },
    { name: 'Sat', completed: 0 },
    { name: 'Sun', completed: 0 },
  ],
};

export const GUEST_RECOMMENDATIONS = {
  message:
    'You have 2 high-urgency tasks due within the next 48 hours. Prioritize Graph Algorithms and Differential Equations today.',
  recommendations: [
    SEED_TASKS[2], // CS Graph Algorithms — due tomorrow
    SEED_TASKS[0], // Math Diff Eq — due in 2 days
    SEED_TASKS[1], // Physics Wave Optics — due in 4 days
  ],
};

// ─── localStorage helpers ─────────────────────────────────────────────────────

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full — silently ignore in demo mode
  }
}

// ─── Tasks ───────────────────────────────────────────────────────────────────

export function getGuestTasks() {
  return load(KEYS.tasks, SEED_TASKS);
}

export function saveGuestTasks(tasks) {
  save(KEYS.tasks, tasks);
}

export function addGuestTask(task) {
  const tasks = getGuestTasks();
  const now = new Date().toISOString();
  const deadline = new Date(task.deadline).toISOString();
  const daysUntil = Math.max(
    1,
    Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24))
  );
  const diffScore = task.difficulty === 'hard' ? 30 : task.difficulty === 'medium' ? 20 : 10;
  const priorityScore = Math.min(
    99,
    Math.round((task.importance * 10) + diffScore + (100 / daysUntil))
  );
  const newTask = {
    _id: `gt_${Date.now()}`,
    ...task,
    completed: false,
    priorityScore,
    createdAt: now,
    deadline: deadline,
  };
  const updated = [newTask, ...tasks].sort((a, b) => b.priorityScore - a.priorityScore);
  saveGuestTasks(updated);
  return updated;
}

export function toggleGuestTask(id) {
  const tasks = getGuestTasks();
  const updated = tasks.map((t) =>
    t._id === id ? { ...t, completed: !t.completed } : t
  );
  saveGuestTasks(updated);
  return updated;
}

export function deleteGuestTask(id) {
  const tasks = getGuestTasks().filter((t) => t._id !== id);
  saveGuestTasks(tasks);
  return tasks;
}

// ─── Notes ───────────────────────────────────────────────────────────────────

export function getGuestNotes() {
  return load(KEYS.notes, SEED_NOTES);
}

export function saveGuestNotes(notes) {
  save(KEYS.notes, notes);
}

export function addGuestNote(note) {
  const notes = getGuestNotes();
  const newNote = {
    _id: `gn_${Date.now()}`,
    ...note,
    createdAt: new Date().toISOString(),
  };
  const updated = [newNote, ...notes];
  saveGuestNotes(updated);
  return updated;
}

export function deleteGuestNote(id) {
  const notes = getGuestNotes().filter((n) => n._id !== id);
  saveGuestNotes(notes);
  return notes;
}

// ─── Cleanup ─────────────────────────────────────────────────────────────────

export function clearGuestData() {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  localStorage.removeItem('guest_mode');
}
