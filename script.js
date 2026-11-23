(function () {
  'use strict';

  const STORAGE_KEY = 'voluntrack_state_v1';

  const DEFAULT_DATA = {
    users: [
      { id: 'u1', name: 'Chaitanya', email: 'admin@voluntrack.org', password: 'password123', role: 'admin', phone: '555-0101', skills: ['Operations', 'Compliance'], status: 'Active' },
      { id: 'u2', name: 'Santosh', email: 'coordinator@voluntrack.org', password: 'password123', role: 'coordinator', phone: '555-0102', skills: ['Event Planning', 'First Aid'], status: 'Active' },
      { id: 'u3', name: 'Mohan Krishna', email: 'volunteer@voluntrack.org', password: 'password123', role: 'volunteer', phone: '555-0103', skills: ['Teaching', 'Logistics'], status: 'Active' }
    ],
    volunteers: [
      { id: 'v1', name: 'Mohan Krishna', email: 'volunteer@voluntrack.org', phone: '555-0103', skills: ['Teaching', 'Logistics'], availability: 'Weekends', status: 'Active', hoursLogged: 42, joinedDate: '2026-08-12' },
      { id: 'v2', name: 'Liam O\'Connor', email: 'liam.o@example.org', phone: '555-0118', skills: ['First Aid', 'Driving'], availability: 'Weekdays', status: 'Active', hoursLogged: 68, joinedDate: '2026-06-04' },
      { id: 'v3', name: 'Sofia Morales', email: 'sofia.m@example.org', phone: '555-0124', skills: ['Photography', 'Social Media'], availability: 'Flexible', status: 'Active', hoursLogged: 31, joinedDate: '2026-09-19' },
      { id: 'v4', name: 'David Kim', email: 'david.k@example.org', phone: '555-0139', skills: ['Logistics', 'Heavy Lifting'], availability: 'Weekends', status: 'On Leave', hoursLogged: 19, joinedDate: '2026-07-22' },
      { id: 'v5', name: 'Amina Hassan', email: 'amina.h@example.org', phone: '555-0155', skills: ['Translation', 'Community Outreach'], availability: 'Evenings', status: 'Active', hoursLogged: 54, joinedDate: '2026-05-15' }
    ],
    events: [
      { id: 'e1', title: 'Riverfront Park Cleanup', category: 'Environment', date: '2026-11-22', time: '09:00 AM - 01:00 PM', location: 'Riverfront Park North', capacity: 20, filled: 14, coordinator: 'Santosh', status: 'Open', description: 'Community park restoration, litter collection, and native sapling planting.' },
      { id: 'e2', title: 'Winter Food Pantry Drive', category: 'Food Security', date: '2026-11-25', time: '10:00 AM - 03:00 PM', location: 'Central Civic Hall', capacity: 15, filled: 15, coordinator: 'Santosh', status: 'Full', description: 'Sorting, packing, and distributing winter food boxes for local families.' },
      { id: 'e3', title: 'Youth Coding & Design Workshop', category: 'Education', date: '2026-11-29', time: '02:00 PM - 05:00 PM', location: 'Eastside Library Lab', capacity: 10, filled: 6, coordinator: 'Chaitanya', status: 'Open', description: 'Mentoring high school students in basic web design and digital literacy.' },
      { id: 'e4', title: 'Senior Tech Support Clinic', category: 'Community Care', date: '2026-12-03', time: '11:00 AM - 02:00 PM', location: 'Oakwood Senior Center', capacity: 12, filled: 5, coordinator: 'Santosh', status: 'Open', description: 'One-on-one help with smartphones, video calls, and online safety.' }
    ],
    requests: [
      { id: 'r1', volunteerId: 'v1', volunteerName: 'Mohan Krishna', volunteerEmail: 'volunteer@voluntrack.org', eventId: 'e1', eventTitle: 'Riverfront Park Cleanup', shift: 'Morning (09:00 - 13:00)', notes: 'Bringing two extra pairs of work gloves.', status: 'Approved', createdAt: '2026-11-10', reviewedBy: 'Santosh' },
      { id: 'r2', volunteerId: 'v1', volunteerName: 'Mohan Krishna', volunteerEmail: 'volunteer@voluntrack.org', eventId: 'e3', eventTitle: 'Youth Coding & Design Workshop', shift: 'Afternoon (14:00 - 17:00)', notes: 'Experienced in teaching HTML/CSS basics.', status: 'Pending', createdAt: '2026-11-14', reviewedBy: '' },
      { id: 'r3', volunteerId: 'v3', volunteerName: 'Sofia Morales', volunteerEmail: 'sofia.m@example.org', eventId: 'e2', eventTitle: 'Winter Food Pantry Drive', shift: 'Full Shift (10:00 - 15:00)', notes: 'Available to document the event as well.', status: 'Waitlisted', createdAt: '2026-11-12', reviewedBy: 'Santosh' },
      { id: 'r4', volunteerId: 'v5', volunteerName: 'Amina Hassan', volunteerEmail: 'amina.h@example.org', eventId: 'e4', eventTitle: 'Senior Tech Support Clinic', shift: 'Midday (11:00 - 14:00)', notes: 'Fluent in Arabic and English.', status: 'Pending', createdAt: '2026-11-15', reviewedBy: '' }
    ],
    notifications: [
      { id: 'n1', message: 'Mohan Krishna submitted a registration request for Youth Coding & Design Workshop.', time: '2 hours ago', read: false, targetRoles: ['admin', 'coordinator'] },
      { id: 'n2', message: 'Your registration for Riverfront Park Cleanup was approved by Santosh.', time: '1 day ago', read: false, targetRoles: ['volunteer'] },
      { id: 'n3', message: 'Winter Food Pantry Drive reached 100% capacity (15/15).', time: '2 days ago', read: true, targetRoles: ['admin', 'coordinator', 'volunteer'] }
    ]
  };

  function clone(obj) { return JSON.parse(JSON.stringify(obj)); }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.volunteers && parsed.events && parsed.requests && parsed.users) {
          return parsed;
        }
      }
    } catch (e) { /* ignore storage errors */ }
    return clone(DEFAULT_DATA);
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
    } catch (e) { /* ignore storage errors */ }
  }

  const state = {
    data: loadState(),
    currentUser: null,
    activeTab: 'dashboard',
    filters: {
      volSearch: '',
      volStatus: 'All',
      volAvail: 'All',
      evtSearch: '',
      evtCategory: 'All',
      evtStatus: 'All',
      reqSearch: '',
      reqStatus: 'All'
    },
    charts: {}
  };

  // Restore session if present
  try {
    const savedUserId = localStorage.getItem(STORAGE_KEY + '_uid');
    if (savedUserId) {
      const found = state.data.users.find(u => u.id === savedUserId);
      if (found) state.currentUser = found;
    }
  } catch (e) {}

  // Helpers
  function esc(str) {
    return String(str ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  function uid(prefix) {
    return prefix + '_' + Math.random().toString(36).slice(2, 8);
  }

  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const colors = {
      success: 'bg-emerald-700 text-white',
      error: 'bg-rose-600 text-white',
      warning: 'bg-amber-600 text-white',
      info: 'bg-slate-800 text-white'
    };
    const el = document.createElement('div');
    el.className = `pointer-events-auto px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center justify-between gap-3 fade-in ${colors[type] || colors.info}`;
    el.innerHTML = `<span>${esc(message)}</span><button type="button" class="text-white/80 hover:text-white font-bold">&times;</button>`;
    el.querySelector('button').addEventListener('click', () => el.remove());
    container.appendChild(el);
    setTimeout(() => { if (el.parentNode) el.remove(); }, 3500);
  }

  function addNotification(message, targetRoles = ['admin', 'coordinator', 'volunteer']) {
    state.data.notifications.unshift({
      id: uid('n'),
      message,
      time: 'Just now',
      read: false,
      targetRoles
    });
    saveState();
    renderNotifications();
  }

  function statusBadge(status) {
    const map = {
      Active: 'bg-emerald-100 text-emerald-800',
      Approved: 'bg-emerald-100 text-emerald-800',
      Open: 'bg-emerald-100 text-emerald-800',
      Pending: 'bg-amber-100 text-amber-800',
      Waitlisted: 'bg-sky-100 text-sky-800',
      'On Leave': 'bg-amber-100 text-amber-800',
      Full: 'bg-purple-100 text-purple-800',
      Rejected: 'bg-rose-100 text-rose-800',
      Inactive: 'bg-slate-200 text-slate-700',
      Completed: 'bg-slate-200 text-slate-700',
      Cancelled: 'bg-rose-100 text-rose-800'
    };
    return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[status] || 'bg-slate-100 text-slate-700'}">${esc(status)}</span>`;
  }

  function isManager() {
    return state.currentUser && (state.currentUser.role === 'admin' || state.currentUser.role === 'coordinator');
  }

  function isAdmin() {
    return state.currentUser && state.currentUser.role === 'admin';
  }

  // Modal Helpers
  function openModal(title, htmlContent) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = htmlContent;
    document.getElementById('modal-backdrop').classList.remove('hidden');
  }

  function closeModal() {
    document.getElementById('modal-backdrop').classList.add('hidden');
    document.getElementById('modal-body').innerHTML = '';
  }

  document.getElementById('modal-close-btn').addEventListener('click', closeModal);
  document.getElementById('modal-backdrop').addEventListener('click', e => {
    if (e.target.id === 'modal-backdrop') closeModal();
  });

  function confirmAction(title, message, onConfirm) {
    openModal(title, `
      <p class="text-sm text-slate-600 mb-6">${esc(message)}</p>
      <div class="flex justify-end gap-3">
        <button id="confirm-cancel" type="button" class="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition">Cancel</button>
        <button id="confirm-ok" type="button" class="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition">Confirm</button>
      </div>
    `);
    document.getElementById('confirm-cancel').addEventListener('click', closeModal);
    document.getElementById('confirm-ok').addEventListener('click', () => {
      closeModal();
      onConfirm();
    });
  }

  // Auth Logic
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  tabLogin.addEventListener('click', () => {
    tabLogin.className = 'flex-1 py-2 text-sm font-semibold rounded-md bg-white text-slate-900 shadow-sm transition';
    tabRegister.className = 'flex-1 py-2 text-sm font-semibold rounded-md text-slate-600 hover:text-slate-900 transition';
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  });

  tabRegister.addEventListener('click', () => {
    tabRegister.className = 'flex-1 py-2 text-sm font-semibold rounded-md bg-white text-slate-900 shadow-sm transition';
    tabLogin.className = 'flex-1 py-2 text-sm font-semibold rounded-md text-slate-600 hover:text-slate-900 transition';
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
  });

  function loginUser(user) {
    state.currentUser = user;
    state.activeTab = 'dashboard';
    try { localStorage.setItem(STORAGE_KEY + '_uid', user.id); } catch (e) {}
    document.getElementById('auth-view').classList.add('hidden');
    document.getElementById('app-shell').classList.remove('hidden');
    renderShell();
    showToast(`Welcome back, ${user.name}!`, 'success');
  }

  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const pass = document.getElementById('login-password').value;
    const emailErr = document.getElementById('login-email-err');
    const passErr = document.getElementById('login-pass-err');
    emailErr.classList.add('hidden');
    passErr.classList.add('hidden');

    let valid = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailErr.textContent = 'Please enter a valid email address.';
      emailErr.classList.remove('hidden');
      valid = false;
    }
    if (pass.length < 6) {
      passErr.textContent = 'Password must be at least 6 characters.';
      passErr.classList.remove('hidden');
      valid = false;
    }
    if (!valid) return;

    const user = state.data.users.find(u => u.email.toLowerCase() === email && u.password === pass);
    if (!user) {
      passErr.textContent = 'Invalid email or password. Try a demo button below.';
      passErr.classList.remove('hidden');
      return;
    }
    loginUser(user);
  });

  registerForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const phone = document.getElementById('reg-phone').value.trim();
    const role = 'volunteer'; // self-registration is volunteer-only; admins promote users in Access & Roles
    const pass = document.getElementById('reg-password').value;

    const errs = {
      name: document.getElementById('reg-name-err'),
      email: document.getElementById('reg-email-err'),
      phone: document.getElementById('reg-phone-err'),
      pass: document.getElementById('reg-pass-err')
    };
    Object.values(errs).forEach(el => el.classList.add('hidden'));

    let valid = true;
    if (name.length < 2) {
      errs.name.textContent = 'Enter your full name.';
      errs.name.classList.remove('hidden');
      valid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email.textContent = 'Enter a valid email address.';
      errs.email.classList.remove('hidden');
      valid = false;
    } else if (state.data.users.some(u => u.email.toLowerCase() === email)) {
      errs.email.textContent = 'An account with this email already exists.';
      errs.email.classList.remove('hidden');
      valid = false;
    }
    if (!/^[0-9+\-\s()]{7,}$/.test(phone)) {
      errs.phone.textContent = 'Enter a valid phone number.';
      errs.phone.classList.remove('hidden');
      valid = false;
    }
    if (pass.length < 6) {
      errs.pass.textContent = 'Password must be at least 6 characters.';
      errs.pass.classList.remove('hidden');
      valid = false;
    }
    if (!valid) return;

    const newUser = { id: uid('u'), name, email, password: pass, role, phone, skills: ['General Support'], status: 'Active' };
    state.data.users.push(newUser);
    if (role === 'volunteer') {
      state.data.volunteers.push({
        id: uid('v'),
        name,
        email,
        phone,
        skills: ['General Support'],
        availability: 'Flexible',
        status: 'Active',
        hoursLogged: 0,
        joinedDate: new Date().toISOString().slice(0, 10)
      });
    }
    addNotification(`New ${role} account registered: ${name}.`, ['admin', 'coordinator']);
    saveState();
    loginUser(newUser);
  });

  document.querySelectorAll('.demo-login-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const role = btn.getAttribute('data-demo-role');
      const user = state.data.users.find(u => u.role === role);
      if (user) loginUser(user);
    });
  });

  document.getElementById('logout-btn').addEventListener('click', () => {
    state.currentUser = null;
    try { localStorage.removeItem(STORAGE_KEY + '_uid'); } catch (e) {}
    document.getElementById('app-shell').classList.add('hidden');
    document.getElementById('auth-view').classList.remove('hidden');
    showToast('Signed out successfully.', 'info');
  });

  document.getElementById('reset-demo-btn').addEventListener('click', () => {
    confirmAction('Reset Demo Data', 'Restore all volunteers, events, and requests to the initial sample dataset?', () => {
      state.data = clone(DEFAULT_DATA);
      const refreshed = state.data.users.find(u => u.role === state.currentUser.role) || state.data.users[0];
      state.currentUser = refreshed;
      saveState();
      renderShell();
      showToast('Demo data restored.', 'info');
    });
  });

  // Mobile Sidebar
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  function toggleSidebar(open) {
    if (open) {
      sidebar.classList.remove('-translate-x-full');
      backdrop.classList.remove('hidden');
    } else {
      sidebar.classList.add('-translate-x-full');
      backdrop.classList.add('hidden');
    }
  }
  document.getElementById('mobile-menu-btn').addEventListener('click', () => toggleSidebar(true));
  document.getElementById('close-sidebar-btn').addEventListener('click', () => toggleSidebar(false));
  backdrop.addEventListener('click', () => toggleSidebar(false));

  // Notifications Dropdown
  const notifDropdown = document.getElementById('notif-dropdown');
  document.getElementById('desktop-notif-btn').addEventListener('click', e => {
    e.stopPropagation();
    notifDropdown.classList.toggle('hidden');
  });
  document.getElementById('mobile-notif-btn').addEventListener('click', () => {
    const list = getRelevantNotifications();
    openModal('Notifications', `
      <div class="divide-y divide-slate-100">
        ${list.length ? list.map(n => `
          <div class="py-3 ${n.read ? 'opacity-65' : ''}">
            <p class="text-sm text-slate-800">${esc(n.message)}</p>
            <p class="text-xs text-slate-400 mt-1">${esc(n.time)}</p>
          </div>
        `).join('') : '<p class="text-sm text-slate-500">No notifications.</p>'}
      </div>
      <div class="mt-4 flex justify-end">
        <button id="mob-mark-read" type="button" class="px-4 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-lg">Mark all read</button>
      </div>
    `);
    document.getElementById('mob-mark-read').addEventListener('click', () => {
      markAllRead();
      closeModal();
    });
  });
  document.addEventListener('click', e => {
    if (!notifDropdown.contains(e.target) && e.target.id !== 'desktop-notif-btn') {
      notifDropdown.classList.add('hidden');
    }
  });
  document.getElementById('mark-all-read-btn').addEventListener('click', markAllRead);

  function getRelevantNotifications() {
    if (!state.currentUser) return [];
    return state.data.notifications.filter(n => !n.targetRoles || n.targetRoles.includes(state.currentUser.role));
  }

  function markAllRead() {
    state.data.notifications.forEach(n => { n.read = true; });
    saveState();
    renderNotifications();
  }

  function renderNotifications() {
    const list = getRelevantNotifications();
    const unread = list.filter(n => !n.read).length;
    const badge = document.getElementById('desktop-notif-count');
    const dot = document.getElementById('mobile-notif-dot');
    if (unread > 0) {
      badge.textContent = unread;
      badge.classList.remove('hidden');
      dot.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
      dot.classList.add('hidden');
    }
    const listEl = document.getElementById('notif-list');
    listEl.innerHTML = list.length ? list.slice(0, 8).map(n => `
      <div class="px-4 py-3 ${n.read ? 'bg-white opacity-70' : 'bg-emerald-50/50'}">
        <p class="text-xs text-slate-800 leading-relaxed">${esc(n.message)}</p>
        <span class="text-[11px] text-slate-400">${esc(n.time)}</span>
      </div>
    `).join('') : '<div class="px-4 py-6 text-center text-xs text-slate-400">No notifications yet.</div>';
  }

  // Navigation Config by Role
  function getNavItems() {
    const items = [
      { id: 'dashboard', label: 'Dashboard', subtitle: 'Operational overview & key metrics', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      { id: 'events', label: 'Events & Shifts', subtitle: 'Browse, schedule, and manage volunteer opportunities', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
      { id: 'requests', label: isManager() ? 'Requests Queue' : 'My Registrations', subtitle: isManager() ? 'Review and process volunteer shift requests' : 'Track your event bookings and approval status', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' }
    ];
    if (isManager()) {
      items.splice(1, 0, { id: 'volunteers', label: 'Volunteers', subtitle: 'Centralized volunteer directory & CRUD records', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' });
      items.push({ id: 'reports', label: 'Reports & Export', subtitle: 'Summary analytics and CSV data exports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' });
    }
    if (isAdmin()) {
      items.push({ id: 'users', label: 'Access & Roles', subtitle: 'Manage platform user accounts and permissions', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' });
    }
    return items;
  }

  function renderShell() {
    const u = state.currentUser;
    document.getElementById('user-avatar').textContent = u.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
    document.getElementById('user-name-display').textContent = u.name;
    document.getElementById('user-role-badge').textContent = u.role;

    const navItems = getNavItems();
    if (!navItems.some(i => i.id === state.activeTab)) state.activeTab = 'dashboard';

    const navEl = document.getElementById('sidebar-nav');
    navEl.innerHTML = navItems.map(item => {
      const active = item.id === state.activeTab;
      const pendingBadge = (item.id === 'requests' && isManager())
        ? (() => {
            const count = state.data.requests.filter(r => r.status === 'Pending').length;
            return count ? `<span class="ml-auto px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-slate-900">${count}</span>` : '';
          })()
        : '';
      return `
        <button type="button" data-nav="${item.id}" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${active ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}">
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="${item.icon}"/></svg>
          <span class="truncate">${esc(item.label)}</span>
          ${pendingBadge}
        </button>
      `;
    }).join('');

    navEl.querySelectorAll('[data-nav]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeTab = btn.getAttribute('data-nav');
        toggleSidebar(false);
        renderShell();
      });
    });

    const currentNav = navItems.find(i => i.id === state.activeTab);
    document.getElementById('page-title').textContent = currentNav.label;
    document.getElementById('page-subtitle').textContent = currentNav.subtitle;

    renderNotifications();
    renderActivePage();
  }

  function destroyCharts() {
    Object.values(state.charts).forEach(c => { try { c.destroy(); } catch (e) {} });
    state.charts = {};
  }

  function renderActivePage() {
    destroyCharts();
    const main = document.getElementById('main-content');
    main.innerHTML = '';
    if (state.activeTab === 'dashboard') renderDashboard(main);
    else if (state.activeTab === 'volunteers') renderVolunteers(main);
    else if (state.activeTab === 'events') renderEvents(main);
    else if (state.activeTab === 'requests') renderRequests(main);
    else if (state.activeTab === 'reports') renderReports(main);
    else if (state.activeTab === 'users') renderUsers(main);
  }

  // 1. DASHBOARD
  function renderDashboard(container) {
    const totalVols = state.data.volunteers.length;
    const activeVols = state.data.volunteers.filter(v => v.status === 'Active').length;
    const openEvents = state.data.events.filter(e => e.status === 'Open').length;
    const pendingReqs = state.data.requests.filter(r => r.status === 'Pending').length;
    const totalHours = state.data.volunteers.reduce((s, v) => s + Number(v.hoursLogged || 0), 0);

    const myReqs = state.data.requests.filter(r => r.volunteerEmail.toLowerCase() === state.currentUser.email.toLowerCase());
    const myApproved = myReqs.filter(r => r.status === 'Approved').length;
    const myPending = myReqs.filter(r => r.status === 'Pending').length;
    const myVolRecord = state.data.volunteers.find(v => v.email.toLowerCase() === state.currentUser.email.toLowerCase());
    const myHours = myVolRecord ? myVolRecord.hoursLogged : 0;

    const kpis = isManager() ? [
      { label: 'Active Volunteers', value: `${activeVols} / ${totalVols}`, sub: 'Centralized roster', color: 'text-emerald-600' },
      { label: 'Open Events', value: openEvents, sub: `${state.data.events.length} total scheduled`, color: 'text-sky-600' },
      { label: 'Pending Requests', value: pendingReqs, sub: 'Awaiting coordinator review', color: 'text-amber-600' },
      { label: 'Total Hours Logged', value: totalHours, sub: 'Across all programs', color: 'text-indigo-600' }
    ] : [
      { label: 'My Approved Shifts', value: myApproved, sub: 'Confirmed upcoming events', color: 'text-emerald-600' },
      { label: 'Pending Requests', value: myPending, sub: 'Awaiting approval', color: 'text-amber-600' },
      { label: 'Open Opportunities', value: openEvents, sub: 'Available to join', color: 'text-sky-600' },
      { label: 'My Hours Logged', value: myHours, sub: 'Verified service hours', color: 'text-indigo-600' }
    ];

    container.innerHTML = `
      <div class="welcome rounded-2xl p-6 text-white shadow-lg fade-in">
        <div class="text-xl sm:text-2xl font-bold">Welcome back, ${esc(state.currentUser.name)} 👋</div>
        <p class="text-sm text-emerald-50/90 mt-1">Here is what is happening with your volunteers and events today.</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 fade-in">
        ${kpis.map(k => `
          <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider">${esc(k.label)}</div>
            <div class="text-2xl font-bold text-slate-900 mt-1.5 ${k.color}">${esc(k.value)}</div>
            <div class="text-xs text-slate-400 mt-1">${esc(k.sub)}</div>
          </div>
        `).join('')}
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold text-slate-900">Event Capacity Utilization</h3>
            <span class="text-xs text-slate-400">Filled vs. Capacity</span>
          </div>
          <div class="relative h-64">
            <canvas id="chart-events"></canvas>
          </div>
        </div>
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold text-slate-900">Request Workflow Status</h3>
            <span class="text-xs text-slate-400">Live distribution</span>
          </div>
          <div class="relative h-64">
            <canvas id="chart-requests"></canvas>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 class="text-sm font-bold text-slate-900">${isManager() ? 'Upcoming Events & Staffing' : 'Recommended Open Opportunities'}</h3>
            <p class="text-xs text-slate-500">Quick overview of current schedule</p>
          </div>
          <button type="button" id="dash-goto-events" class="text-xs font-semibold text-emerald-600 hover:text-emerald-700">View all events &rarr;</button>
        </div>
        <div class="divide-y divide-slate-100">
          ${state.data.events.slice(0, 4).map(ev => {
            const pct = Math.min(100, Math.round((ev.filled / ev.capacity) * 100));
            return `
              <div class="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-semibold text-slate-900">${esc(ev.title)}</span>
                    ${statusBadge(ev.status)}
                  </div>
                  <div class="text-xs text-slate-500 mt-0.5">${esc(ev.date)} &bull; ${esc(ev.time)} &bull; ${esc(ev.location)}</div>
                </div>
                <div class="flex items-center gap-4">
                  <div class="w-32">
                    <div class="flex justify-between text-[11px] text-slate-500 mb-1"><span>Slots</span><span>${ev.filled}/${ev.capacity}</span></div>
                    <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div class="h-full bg-emerald-500 rounded-full" style="width:${pct}%"></div>
                    </div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    document.getElementById('dash-goto-events').addEventListener('click', () => {
      state.activeTab = 'events';
      renderShell();
    });

    // Charts
    if (window.Chart) {
      const ctx1 = document.getElementById('chart-events').getContext('2d');
      state.charts.events = new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: state.data.events.map(e => e.title.length > 18 ? e.title.slice(0, 18) + '…' : e.title),
          datasets: [
            { label: 'Filled Slots', data: state.data.events.map(e => e.filled), backgroundColor: '#10b981', borderRadius: 6 },
            { label: 'Open Slots', data: state.data.events.map(e => Math.max(0, e.capacity - e.filled)), backgroundColor: '#e2e8f0', borderRadius: 6 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } },
          plugins: { legend: { position: 'bottom' } }
        }
      });

      const statuses = ['Approved', 'Pending', 'Waitlisted', 'Rejected'];
      const counts = statuses.map(st => state.data.requests.filter(r => r.status === st).length);
      const ctx2 = document.getElementById('chart-requests').getContext('2d');
      state.charts.requests = new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: statuses,
          datasets: [{
            data: counts,
            backgroundColor: ['#10b981', '#f59e0b', '#0ea5e9', '#f43f5e'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }
  }

  // 2. VOLUNTEERS CRUD (Admin & Coordinator)
  function renderVolunteers(container) {
    const { volSearch, volStatus, volAvail } = state.filters;
    const filtered = state.data.volunteers.filter(v => {
      const q = volSearch.toLowerCase();
      const matchQ = !q || v.name.toLowerCase().includes(q) || v.email.toLowerCase().includes(q) || v.skills.join(' ').toLowerCase().includes(q);
      const matchS = volStatus === 'All' || v.status === volStatus;
      const matchA = volAvail === 'All' || v.availability === volAvail;
      return matchQ && matchS && matchA;
    });

    container.innerHTML = `
      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between fade-in">
        <div class="flex flex-1 flex-wrap gap-3">
          <input id="vol-search" type="text" value="${esc(volSearch)}" placeholder="Search name, email, or skill..." class="flex-1 min-w-[200px] px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          <select id="vol-status-filter" class="px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white">
            <option value="All" ${volStatus === 'All' ? 'selected' : ''}>All Statuses</option>
            <option value="Active" ${volStatus === 'Active' ? 'selected' : ''}>Active</option>
            <option value="On Leave" ${volStatus === 'On Leave' ? 'selected' : ''}>On Leave</option>
            <option value="Inactive" ${volStatus === 'Inactive' ? 'selected' : ''}>Inactive</option>
          </select>
          <select id="vol-avail-filter" class="px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white">
            <option value="All" ${volAvail === 'All' ? 'selected' : ''}>All Availability</option>
            <option value="Weekdays" ${volAvail === 'Weekdays' ? 'selected' : ''}>Weekdays</option>
            <option value="Weekends" ${volAvail === 'Weekends' ? 'selected' : ''}>Weekends</option>
            <option value="Evenings" ${volAvail === 'Evenings' ? 'selected' : ''}>Evenings</option>
            <option value="Flexible" ${volAvail === 'Flexible' ? 'selected' : ''}>Flexible</option>
          </select>
        </div>
        <button id="add-vol-btn" type="button" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-sm transition shrink-0">+ Add Volunteer</button>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th class="px-5 py-3.5">Volunteer</th>
                <th class="px-5 py-3.5">Skills</th>
                <th class="px-5 py-3.5">Availability</th>
                <th class="px-5 py-3.5">Hours</th>
                <th class="px-5 py-3.5">Status</th>
                <th class="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-sm">
              ${filtered.length ? filtered.map(v => `
                <tr class="hover:bg-slate-50/80 transition">
                  <td class="px-5 py-3.5">
                    <div class="font-semibold text-slate-900">${esc(v.name)}</div>
                    <div class="text-xs text-slate-500">${esc(v.email)} &bull; ${esc(v.phone)}</div>
                  </td>
                  <td class="px-5 py-3.5">
                    <div class="flex flex-wrap gap-1">
                      ${v.skills.map(s => `<span class="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-700 rounded-md">${esc(s)}</span>`).join('')}
                    </div>
                  </td>
                  <td class="px-5 py-3.5 text-slate-600">${esc(v.availability)}</td>
                  <td class="px-5 py-3.5 font-semibold text-slate-800">${esc(v.hoursLogged)} hrs</td>
                  <td class="px-5 py-3.5">${statusBadge(v.status)}</td>
                  <td class="px-5 py-3.5 text-right space-x-2 whitespace-nowrap">
                    <button type="button" data-edit-vol="${v.id}" class="text-xs font-semibold text-emerald-600 hover:text-emerald-800">Edit</button>
                    ${isAdmin() ? `<button type="button" data-del-vol="${v.id}" class="text-xs font-semibold text-rose-600 hover:text-rose-800">Delete</button>` : ''}
                  </td>
                </tr>
              `).join('') : `<tr><td colspan="6" class="px-5 py-8 text-center text-sm text-slate-400">No volunteers match your filters.</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById('vol-search').addEventListener('input', e => { state.filters.volSearch = e.target.value; renderVolunteers(container); });
    document.getElementById('vol-status-filter').addEventListener('change', e => { state.filters.volStatus = e.target.value; renderVolunteers(container); });
    document.getElementById('vol-avail-filter').addEventListener('change', e => { state.filters.volAvail = e.target.value; renderVolunteers(container); });
    document.getElementById('add-vol-btn').addEventListener('click', () => openVolunteerModal(null));
    container.querySelectorAll('[data-edit-vol]').forEach(btn => {
      btn.addEventListener('click', () => openVolunteerModal(btn.getAttribute('data-edit-vol')));
    });
    container.querySelectorAll('[data-del-vol]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-del-vol');
        const v = state.data.volunteers.find(x => x.id === id);
        confirmAction('Delete Volunteer', `Remove ${v.name} from the roster? Their login account and registration requests will also be deleted.`, () => {
          const email = v.email.toLowerCase();
          state.data.requests.filter(r => r.volunteerEmail.toLowerCase() === email && r.status === 'Approved').forEach(r => {
            const ev = state.data.events.find(e => e.id === r.eventId);
            if (ev && ev.filled > 0) { ev.filled -= 1; if (ev.status === 'Full' && ev.filled < ev.capacity) ev.status = 'Open'; }
          });
          state.data.requests = state.data.requests.filter(r => r.volunteerEmail.toLowerCase() !== email);
          state.data.users = state.data.users.filter(u => !(u.role === 'volunteer' && u.email.toLowerCase() === email));
          state.data.volunteers = state.data.volunteers.filter(x => x.id !== id);
          saveState();
          renderActivePage();
          showToast(`Removed ${v.name} and their account.`, 'info');
          renderShell();
        });
      });
    });
  }

  function openVolunteerModal(volId) {
    const v = volId ? state.data.volunteers.find(x => x.id === volId) : null;
    openModal(v ? 'Edit Volunteer' : 'Add New Volunteer', `
      <form id="vol-form" class="space-y-4" novalidate>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
          <input id="vf-name" type="text" value="${esc(v ? v.name : '')}" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" required />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Email</label>
            <input id="vf-email" type="email" value="${esc(v ? v.email : '')}" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" required />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
            <input id="vf-phone" type="tel" value="${esc(v ? v.phone : '')}" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" required />
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Skills (comma-separated)</label>
          <input id="vf-skills" type="text" value="${esc(v ? v.skills.join(', ') : 'Logistics, Outreach')}" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" />
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Availability</label>
            <select id="vf-avail" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white">
              ${['Weekdays', 'Weekends', 'Evenings', 'Flexible'].map(a => `<option value="${a}" ${v && v.availability === a ? 'selected' : ''}>${a}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Status</label>
            <select id="vf-status" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white">
              ${['Active', 'On Leave', 'Inactive'].map(s => `<option value="${s}" ${v && v.status === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Hours Logged</label>
            <input id="vf-hours" type="number" min="0" value="${v ? v.hoursLogged : 0}" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" />
          </div>
        </div>
        <p id="vf-err" class="text-xs text-rose-600 hidden"></p>
        <div class="flex justify-end gap-3 pt-2">
          <button type="button" id="vf-cancel" class="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg">Cancel</button>
          <button type="submit" class="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg">${v ? 'Save Changes' : 'Add Volunteer'}</button>
        </div>
      </form>
    `);
    document.getElementById('vf-cancel').addEventListener('click', closeModal);
    document.getElementById('vol-form').addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('vf-name').value.trim();
      const email = document.getElementById('vf-email').value.trim();
      const phone = document.getElementById('vf-phone').value.trim();
      const skills = document.getElementById('vf-skills').value.split(',').map(s => s.trim()).filter(Boolean);
      const availability = document.getElementById('vf-avail').value;
      const status = document.getElementById('vf-status').value;
      const hoursLogged = Math.max(0, Number(document.getElementById('vf-hours').value) || 0);
      const err = document.getElementById('vf-err');

      if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.length < 6) {
        err.textContent = 'Please provide a valid name, email, and phone number.';
        err.classList.remove('hidden');
        return;
      }
      if (!v && state.data.volunteers.some(x => x.email.toLowerCase() === email.toLowerCase())) {
        err.textContent = 'A volunteer with this email already exists.';
        err.classList.remove('hidden');
        return;
      }

      if (v) {
        Object.assign(v, { name, email, phone, skills: skills.length ? skills : ['General'], availability, status, hoursLogged });
        showToast(`Updated ${name}'s record.`, 'success');
      } else {
        state.data.volunteers.unshift({
          id: uid('v'),
          name, email, phone,
          skills: skills.length ? skills : ['General'],
          availability, status, hoursLogged,
          joinedDate: new Date().toISOString().slice(0, 10)
        });
        showToast(`Added ${name} to roster.`, 'success');
      }
      saveState();
      closeModal();
      renderActivePage();
    });
  }

  // 3. EVENTS & SHIFTS (All roles; CRUD for Managers, Request Booking for Volunteers)
  function renderEvents(container) {
    const { evtSearch, evtCategory, evtStatus } = state.filters;
    const categories = ['All', ...new Set(state.data.events.map(e => e.category))];
    const filtered = state.data.events.filter(ev => {
      const q = evtSearch.toLowerCase();
      const matchQ = !q || ev.title.toLowerCase().includes(q) || ev.location.toLowerCase().includes(q) || ev.description.toLowerCase().includes(q);
      const matchC = evtCategory === 'All' || ev.category === evtCategory;
      const matchS = evtStatus === 'All' || ev.status === evtStatus;
      return matchQ && matchC && matchS;
    });

    container.innerHTML = `
      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between fade-in">
        <div class="flex flex-1 flex-wrap gap-3">
          <input id="evt-search" type="text" value="${esc(evtSearch)}" placeholder="Search event title or location..." class="flex-1 min-w-[200px] px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          <select id="evt-cat-filter" class="px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white">
            ${categories.map(c => `<option value="${esc(c)}" ${evtCategory === c ? 'selected' : ''}>${c === 'All' ? 'All Categories' : esc(c)}</option>`).join('')}
          </select>
          <select id="evt-status-filter" class="px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white">
            ${['All', 'Open', 'Full', 'Completed', 'Cancelled'].map(s => `<option value="${s}" ${evtStatus === s ? 'selected' : ''}>${s === 'All' ? 'All Statuses' : s}</option>`).join('')}
          </select>
        </div>
        ${isManager() ? `<button id="add-evt-btn" type="button" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-sm transition shrink-0">+ Create Event</button>` : ''}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        ${filtered.length ? filtered.map(ev => {
          const pct = Math.min(100, Math.round((ev.filled / ev.capacity) * 100));
          const alreadyRequested = state.data.requests.find(r => r.eventId === ev.id && r.volunteerEmail.toLowerCase() === state.currentUser.email.toLowerCase() && r.status !== 'Rejected');
          return `
            <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex flex-col justify-between gap-4">
              <div>
                <div class="flex items-start justify-between gap-2">
                  <span class="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">${esc(ev.category)}</span>
                  ${statusBadge(ev.status)}
                </div>
                <h3 class="text-base font-bold text-slate-900 mt-2.5">${esc(ev.title)}</h3>
                <p class="text-xs text-slate-500 mt-1 leading-relaxed">${esc(ev.description)}</p>
                <div class="mt-4 space-y-1.5 text-xs text-slate-600">
                  <div><span class="font-semibold text-slate-700">When:</span> ${esc(ev.date)} &bull; ${esc(ev.time)}</div>
                  <div><span class="font-semibold text-slate-700">Where:</span> ${esc(ev.location)}</div>
                  <div><span class="font-semibold text-slate-700">Coordinator:</span> ${esc(ev.coordinator)}</div>
                </div>
              </div>

              <div class="pt-3 border-t border-slate-100 space-y-3">
                <div>
                  <div class="flex justify-between text-xs text-slate-600 mb-1">
                    <span>Volunteer Capacity</span>
                    <span class="font-semibold">${ev.filled} / ${ev.capacity} filled</span>
                  </div>
                  <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full ${pct >= 100 ? 'bg-purple-500' : 'bg-emerald-500'} rounded-full" style="width:${pct}%"></div>
                  </div>
                </div>
                <div class="flex items-center justify-end gap-2">
                  ${isManager() ? `
                    <button type="button" data-edit-evt="${ev.id}" class="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition">Edit</button>
                    <button type="button" data-del-evt="${ev.id}" class="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition">Delete</button>
                  ` : (
                    alreadyRequested
                      ? `<span class="text-xs font-semibold text-slate-500">Request Status: ${statusBadge(alreadyRequested.status)}</span>`
                      : `<button type="button" data-req-evt="${ev.id}" class="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition" ${ev.status === 'Cancelled' || ev.status === 'Completed' ? 'disabled' : ''}>${ev.status === 'Full' ? 'Join Waitlist' : 'Request to Join'}</button>`
                  )}
                </div>
              </div>
            </div>
          `;
        }).join('') : `<div class="col-span-full bg-white p-8 rounded-2xl border border-slate-200 text-center text-sm text-slate-400">No events match your filters.</div>`}
      </div>
    `;

    document.getElementById('evt-search').addEventListener('input', e => { state.filters.evtSearch = e.target.value; renderEvents(container); });
    document.getElementById('evt-cat-filter').addEventListener('change', e => { state.filters.evtCategory = e.target.value; renderEvents(container); });
    document.getElementById('evt-status-filter').addEventListener('change', e => { state.filters.evtStatus = e.target.value; renderEvents(container); });

    if (isManager()) {
      document.getElementById('add-evt-btn').addEventListener('click', () => openEventModal(null));
      container.querySelectorAll('[data-edit-evt]').forEach(b => b.addEventListener('click', () => openEventModal(b.getAttribute('data-edit-evt'))));
      container.querySelectorAll('[data-del-evt]').forEach(b => {
        b.addEventListener('click', () => {
          const id = b.getAttribute('data-del-evt');
          const ev = state.data.events.find(x => x.id === id);
          confirmAction('Delete Event', `Delete "${ev.title}"? Associated requests will remain in history.`, () => {
            state.data.events = state.data.events.filter(x => x.id !== id);
            saveState();
            renderActivePage();
            showToast(`Deleted "${ev.title}".`, 'info');
          });
        });
      });
    } else {
      container.querySelectorAll('[data-req-evt]').forEach(b => {
        b.addEventListener('click', () => openRequestModal(b.getAttribute('data-req-evt')));
      });
    }
  }

  function openEventModal(evtId) {
    const ev = evtId ? state.data.events.find(x => x.id === evtId) : null;
    openModal(ev ? 'Edit Event' : 'Create New Event', `
      <form id="evt-form" class="space-y-4" novalidate>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Event Title</label>
          <input id="ef-title" type="text" value="${esc(ev ? ev.title : '')}" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" required />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Category</label>
            <input id="ef-cat" type="text" value="${esc(ev ? ev.category : 'Community Care')}" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" required />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Date</label>
            <input id="ef-date" type="date" value="${esc(ev ? ev.date : '2026-12-10')}" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" required />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Time Window</label>
            <input id="ef-time" type="text" value="${esc(ev ? ev.time : '09:00 AM - 01:00 PM')}" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" required />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Location</label>
            <input id="ef-loc" type="text" value="${esc(ev ? ev.location : '')}" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" required />
          </div>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Capacity</label>
            <input id="ef-cap" type="number" min="1" value="${ev ? ev.capacity : 15}" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" required />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Filled (auto)</label>
            <input id="ef-filled" type="number" value="${ev ? ev.filled : 0}" readonly tabindex="-1" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed" title="Updated automatically when requests are approved" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Status</label>
            <select id="ef-status" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white">
              ${['Open', 'Full', 'Completed', 'Cancelled'].map(s => `<option value="${s}" ${ev && ev.status === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Description</label>
          <textarea id="ef-desc" rows="3" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg">${esc(ev ? ev.description : '')}</textarea>
        </div>
        <p id="ef-err" class="text-xs text-rose-600 hidden"></p>
        <div class="flex justify-end gap-3 pt-2">
          <button type="button" id="ef-cancel" class="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg">Cancel</button>
          <button type="submit" class="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg">${ev ? 'Save Event' : 'Create Event'}</button>
        </div>
      </form>
    `);
    document.getElementById('ef-cancel').addEventListener('click', closeModal);
    document.getElementById('evt-form').addEventListener('submit', e => {
      e.preventDefault();
      const title = document.getElementById('ef-title').value.trim();
      const category = document.getElementById('ef-cat').value.trim();
      const date = document.getElementById('ef-date').value;
      const time = document.getElementById('ef-time').value.trim();
      const location = document.getElementById('ef-loc').value.trim();
      const capacity = Number(document.getElementById('ef-cap').value);
      const filled = ev ? ev.filled : 0; // managed only through request approvals
      let status = document.getElementById('ef-status').value;
      const description = document.getElementById('ef-desc').value.trim();
      const err = document.getElementById('ef-err');

      if (title.length < 3 || !date || !location || capacity < 1) {
        err.textContent = 'Please complete title, date, location, and valid capacity (>= 1).';
        err.classList.remove('hidden');
        return;
      }
      if (capacity < filled) {
        err.textContent = `Capacity can't be lower than the ${filled} slots already filled.`;
        err.classList.remove('hidden');
        return;
      }
      if (filled >= capacity && status === 'Open') status = 'Full';

      if (ev) {
        Object.assign(ev, { title, category, date, time, location, capacity, filled, status, description });
        showToast(`Updated "${title}".`, 'success');
      } else {
        state.data.events.unshift({
          id: uid('e'),
          title, category, date, time, location, capacity, filled,
          coordinator: state.currentUser.name,
          status,
          description: description || 'Volunteer shift opportunity.'
        });
        addNotification(`New event published: ${title} (${date}).`, ['volunteer']);
        showToast(`Created "${title}".`, 'success');
      }
      saveState();
      closeModal();
      renderActivePage();
    });
  }

  function openRequestModal(evtId) {
    const ev = state.data.events.find(x => x.id === evtId);
    if (!ev) return;
    openModal(`Register: ${ev.title}`, `
      <form id="req-form" class="space-y-4" novalidate>
        <div class="bg-slate-50 p-3 rounded-xl text-xs text-slate-600 space-y-1">
          <div><span class="font-semibold">Date:</span> ${esc(ev.date)} (${esc(ev.time)})</div>
          <div><span class="font-semibold">Location:</span> ${esc(ev.location)}</div>
          <div><span class="font-semibold">Availability:</span> ${ev.filled}/${ev.capacity} slots filled</div>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Preferred Shift</label>
          <select id="rf-shift" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white">
            <option value="Full Shift (${esc(ev.time)})">Full Shift (${esc(ev.time)})</option>
            <option value="First Half">First Half</option>
            <option value="Second Half">Second Half</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Notes / Relevant Experience</label>
          <textarea id="rf-notes" rows="3" placeholder="Share any relevant skills, equipment, or arrival notes..." class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" required></textarea>
          <p id="rf-err" class="text-xs text-rose-600 mt-1 hidden"></p>
        </div>
        <div class="flex justify-end gap-3">
          <button type="button" id="rf-cancel" class="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg">Cancel</button>
          <button type="submit" class="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg">Submit Request</button>
        </div>
      </form>
    `);
    document.getElementById('rf-cancel').addEventListener('click', closeModal);
    document.getElementById('req-form').addEventListener('submit', e => {
      e.preventDefault();
      const shift = document.getElementById('rf-shift').value;
      const notes = document.getElementById('rf-notes').value.trim();
      const err = document.getElementById('rf-err');
      if (notes.length < 3) {
        err.textContent = 'Please add a brief note or confirmation before submitting.';
        err.classList.remove('hidden');
        return;
      }
      const vol = state.data.volunteers.find(v => v.email.toLowerCase() === state.currentUser.email.toLowerCase());
      state.data.requests.unshift({
        id: uid('r'),
        volunteerId: vol ? vol.id : state.currentUser.id,
        volunteerName: state.currentUser.name,
        volunteerEmail: state.currentUser.email,
        eventId: ev.id,
        eventTitle: ev.title,
        shift,
        notes,
        status: 'Pending',
        createdAt: new Date().toISOString().slice(0, 10),
        reviewedBy: ''
      });
      addNotification(`${state.currentUser.name} requested to join "${ev.title}".`, ['admin', 'coordinator']);
      saveState();
      closeModal();
      renderActivePage();
      showToast('Registration request submitted!', 'success');
    });
  }

  // 4. REQUESTS & WORKFLOW QUEUE
  function renderRequests(container) {
    const { reqSearch, reqStatus } = state.filters;
    const baseList = isManager()
      ? state.data.requests
      : state.data.requests.filter(r => r.volunteerEmail.toLowerCase() === state.currentUser.email.toLowerCase());

    const filtered = baseList.filter(r => {
      const q = reqSearch.toLowerCase();
      const matchQ = !q || r.volunteerName.toLowerCase().includes(q) || r.eventTitle.toLowerCase().includes(q) || r.notes.toLowerCase().includes(q);
      const matchS = reqStatus === 'All' || r.status === reqStatus;
      return matchQ && matchS;
    });

    container.innerHTML = `
      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between fade-in">
        <input id="req-search" type="text" value="${esc(reqSearch)}" placeholder="Search volunteer, event, or notes..." class="flex-1 px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        <div class="flex flex-wrap gap-1.5">
          ${['All', 'Pending', 'Approved', 'Waitlisted', 'Rejected'].map(st => `
            <button type="button" data-req-tab="${st}" class="px-3 py-1.5 text-xs font-semibold rounded-lg transition ${reqStatus === st ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">${st}</button>
          `).join('')}
        </div>
      </div>

      <div class="space-y-3">
        ${filtered.length ? filtered.map(r => `
          <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="space-y-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-sm font-bold text-slate-900">${esc(r.eventTitle)}</span>
                ${statusBadge(r.status)}
              </div>
              <div class="text-xs text-slate-600">
                <span class="font-semibold">${esc(r.volunteerName)}</span> (${esc(r.volunteerEmail)}) &bull; Shift: ${esc(r.shift)} &bull; Submitted: ${esc(r.createdAt)}
              </div>
              <p class="text-xs text-slate-500 italic">"${esc(r.notes)}"</p>
              ${r.reviewedBy ? `<div class="text-[11px] text-slate-400">Reviewed by ${esc(r.reviewedBy)}</div>` : ''}
            </div>

            <div class="flex flex-wrap items-center gap-2 shrink-0">
              ${isManager() ? `
                ${r.status !== 'Approved' ? `<button type="button" data-req-act="Approved:${r.id}" class="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition">Approve</button>` : ''}
                ${r.status !== 'Waitlisted' ? `<button type="button" data-req-act="Waitlisted:${r.id}" class="px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition">Waitlist</button>` : ''}
                ${r.status !== 'Rejected' ? `<button type="button" data-req-act="Rejected:${r.id}" class="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition">Reject</button>` : ''}
              ` : `
                ${r.status === 'Pending' || r.status === 'Waitlisted' ? `<button type="button" data-req-cancel="${r.id}" class="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition">Withdraw Request</button>` : ''}
              `}
            </div>
          </div>
        `).join('') : `<div class="bg-white p-8 rounded-2xl border border-slate-200 text-center text-sm text-slate-400">No requests found.</div>`}
      </div>
    `;

    document.getElementById('req-search').addEventListener('input', e => { state.filters.reqSearch = e.target.value; renderRequests(container); });
    container.querySelectorAll('[data-req-tab]').forEach(b => {
      b.addEventListener('click', () => { state.filters.reqStatus = b.getAttribute('data-req-tab'); renderRequests(container); });
    });

    container.querySelectorAll('[data-req-act]').forEach(b => {
      b.addEventListener('click', () => {
        const [newStatus, id] = b.getAttribute('data-req-act').split(':');
        const req = state.data.requests.find(x => x.id === id);
        if (!req) return;
        const ev = state.data.events.find(e => e.id === req.eventId);

        if (newStatus === 'Approved' && req.status !== 'Approved' && ev) {
          if (ev.filled >= ev.capacity) {
            showToast(`"${ev.title}" is already at full capacity.`, 'warning');
            return;
          }
          ev.filled += 1;
          if (ev.filled >= ev.capacity) ev.status = 'Full';
        } else if (req.status === 'Approved' && newStatus !== 'Approved' && ev && ev.filled > 0) {
          ev.filled -= 1;
          if (ev.status === 'Full' && ev.filled < ev.capacity) ev.status = 'Open';
        }

        req.status = newStatus;
        req.reviewedBy = state.currentUser.name;
        addNotification(`Your request for "${req.eventTitle}" was marked ${newStatus} by ${state.currentUser.name}.`, ['volunteer']);
        saveState();
        renderShell();
        showToast(`Request marked ${newStatus}.`, 'success');
      });
    });

    container.querySelectorAll('[data-req-cancel]').forEach(b => {
      b.addEventListener('click', () => {
        const id = b.getAttribute('data-req-cancel');
        confirmAction('Withdraw Request', 'Cancel your pending registration request?', () => {
          state.data.requests = state.data.requests.filter(x => x.id !== id);
          saveState();
          renderShell();
          showToast('Request withdrawn.', 'info');
        });
      });
    });
  }

  // 5. REPORTS & CSV EXPORT
  function renderReports(container) {
    const totalHours = state.data.volunteers.reduce((s, v) => s + Number(v.hoursLogged || 0), 0);
    const avgHours = state.data.volunteers.length ? (totalHours / state.data.volunteers.length).toFixed(1) : '0.0';
    const approvalRate = state.data.requests.length
      ? Math.round((state.data.requests.filter(r => r.status === 'Approved').length / state.data.requests.length) * 100)
      : 0;

    container.innerHTML = `
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 fade-in">
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div class="text-xs font-semibold text-slate-500 uppercase">Total Service Hours</div>
          <div class="text-2xl font-bold text-emerald-600 mt-1">${totalHours} hrs</div>
        </div>
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div class="text-xs font-semibold text-slate-500 uppercase">Avg Hours / Volunteer</div>
          <div class="text-2xl font-bold text-slate-900 mt-1">${avgHours} hrs</div>
        </div>
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div class="text-xs font-semibold text-slate-500 uppercase">Request Approval Rate</div>
          <div class="text-2xl font-bold text-sky-600 mt-1">${approvalRate}%</div>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 class="text-sm font-bold text-slate-900">Export Operational Reports (CSV)</h3>
          <p class="text-xs text-slate-500">Download clean tabular records to replace manual spreadsheets.</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button id="exp-vol-csv" type="button" class="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition">Export Volunteers CSV</button>
          <button id="exp-evt-csv" type="button" class="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition">Export Events CSV</button>
          <button id="exp-req-csv" type="button" class="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition">Export Requests CSV</button>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100">
          <h3 class="text-sm font-bold text-slate-900">Top Contributors & Hours Breakdown</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-sm">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                <th class="px-5 py-3">Volunteer</th>
                <th class="px-5 py-3">Joined</th>
                <th class="px-5 py-3">Availability</th>
                <th class="px-5 py-3">Status</th>
                <th class="px-5 py-3 text-right">Hours Logged</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${[...state.data.volunteers].sort((a, b) => b.hoursLogged - a.hoursLogged).map(v => `
                <tr>
                  <td class="px-5 py-3 font-semibold text-slate-900">${esc(v.name)}</td>
                  <td class="px-5 py-3 text-slate-500">${esc(v.joinedDate)}</td>
                  <td class="px-5 py-3 text-slate-600">${esc(v.availability)}</td>
                  <td class="px-5 py-3">${statusBadge(v.status)}</td>
                  <td class="px-5 py-3 text-right font-bold text-emerald-700">${esc(v.hoursLogged)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    function downloadCSV(filename, headers, rows) {
      const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast(`Exported ${filename}`, 'success');
    }

    document.getElementById('exp-vol-csv').addEventListener('click', () => {
      downloadCSV('volunteers_report.csv', ['Name', 'Email', 'Phone', 'Skills', 'Availability', 'Status', 'Hours'],
        state.data.volunteers.map(v => [v.name, v.email, v.phone, v.skills.join('; '), v.availability, v.status, v.hoursLogged]));
    });
    document.getElementById('exp-evt-csv').addEventListener('click', () => {
      downloadCSV('events_report.csv', ['Title', 'Category', 'Date', 'Time', 'Location', 'Filled', 'Capacity', 'Status'],
        state.data.events.map(e => [e.title, e.category, e.date, e.time, e.location, e.filled, e.capacity, e.status]));
    });
    document.getElementById('exp-req-csv').addEventListener('click', () => {
      downloadCSV('requests_report.csv', ['Volunteer', 'Email', 'Event', 'Shift', 'Status', 'Submitted', 'Reviewed By'],
        state.data.requests.map(r => [r.volunteerName, r.volunteerEmail, r.eventTitle, r.shift, r.status, r.createdAt, r.reviewedBy]));
    });
  }

  // 6. ACCESS & ROLES (Admin Only)
  function renderUsers(container) {
    container.innerHTML = `
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden fade-in">
        <div class="px-5 py-4 border-b border-slate-100">
          <h3 class="text-sm font-bold text-slate-900">Registered Platform Accounts</h3>
          <p class="text-xs text-slate-500">Assign role-based permissions (Admin, Coordinator, Volunteer)</p>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-sm">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                <th class="px-5 py-3">User</th>
                <th class="px-5 py-3">Email</th>
                <th class="px-5 py-3">Role</th>
                <th class="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${state.data.users.map(u => `
                <tr>
                  <td class="px-5 py-3 font-semibold text-slate-900">${esc(u.name)} ${u.id === state.currentUser.id ? '<span class="text-xs text-emerald-600">(You)</span>' : ''}</td>
                  <td class="px-5 py-3 text-slate-600">${esc(u.email)}</td>
                  <td class="px-5 py-3">
                    <select data-role-user="${u.id}" class="px-2.5 py-1 text-xs font-semibold border border-slate-300 rounded-lg bg-white" ${u.id === state.currentUser.id ? 'disabled' : ''}>
                      ${['admin', 'coordinator', 'volunteer'].map(r => `<option value="${r}" ${u.role === r ? 'selected' : ''}>${r.toUpperCase()}</option>`).join('')}
                    </select>
                  </td>
                  <td class="px-5 py-3">${statusBadge(u.status || 'Active')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    container.querySelectorAll('[data-role-user]').forEach(sel => {
      sel.addEventListener('change', e => {
        const id = sel.getAttribute('data-role-user');
        const target = state.data.users.find(u => u.id === id);
        if (target) {
          target.role = e.target.value;
          saveState();
          showToast(`Updated ${target.name}'s role to ${target.role}.`, 'success');
        }
      });
    });
  }

  // Initialize view
  if (state.currentUser) {
    document.getElementById('auth-view').classList.add('hidden');
    document.getElementById('app-shell').classList.remove('hidden');
    renderShell();
  }
})();
