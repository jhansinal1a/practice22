const state = { dashboard: null, profile: null, settings: null, notifications: [], activeSettingsTab: 'notifications' };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

async function api(url, options = {}) {
  const response = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
  if (!response.ok) throw new Error((await response.json()).message || 'Request failed');
  return response.json();
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.remove('hidden');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.add('hidden'), 2600);
}

function showPage(name) {
  $$('.page').forEach(page => page.classList.remove('active-page'));
  const target = $(`#${name}Page`);
  if (target) target.classList.add('active-page');
  $$('.nav-link').forEach(item => item.classList.toggle('active', item.dataset.page === name));
  $('#accountMenu').classList.add('hidden');
  $('#notificationPanel').classList.add('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (name === 'profile') renderProfile();
  if (name === 'settings') renderSettings();
}

function openPlaceholder(title) {
  $('#placeholderTitle').textContent = title;
  $$('.page').forEach(page => page.classList.remove('active-page'));
  $('#placeholderPage').classList.add('active-page');
}

function renderHome() {
  const stats = state.dashboard.stats;
  $('#homeStats').innerHTML = [
    ['Open postings', stats.openPostings],
    ['Applicants', stats.applicants],
    ['Upcoming events', stats.upcomingEvents]
  ].map(([label, value]) => `<article class="stat-card"><strong>${value}</strong><span>${label}</span></article>`).join('');
}

function renderProfile() {
  const p = state.profile;
  const s = state.dashboard.stats;
  $('#performanceStats').innerHTML = [
    ['▣', s.jobsPosted, 'Jobs Posted'],
    ['▦', s.eventsScheduled, 'Events Scheduled'],
    ['♙', s.employeesHired, 'Employees Hired']
  ].map(([icon,value,label]) => `<article class="performance-item"><span class="metric-icon">${icon}</span><div><strong>${value}</strong><div>${label}</div><small>All time</small></div></article>`).join('');

  $('#profileOverview').innerHTML = `
    <div><div class="avatar profile-avatar">JH</div></div>
    <div><h2>${p.name}</h2><div class="company">${p.companyName}</div><span class="tag">${p.role}</span><ul><li>✉ ${p.email}</li><li>⌕ ${p.phone}</li><li>◎ ${p.website}</li><li>⌖ ${p.location}</li></ul></div>
    <div class="details-list"><div><strong>Industry</strong><span>${p.industry}</span></div><div><strong>Company Size</strong><span>${p.companySize}</span></div><div><strong>Founded</strong><span>${p.founded}</span></div><div><strong>Timezone</strong><span>${p.timezone}</span></div></div>
    <div class="about-company"><h3>About Company</h3><p>${p.about}</p></div>`;

  $('#hiringFocusCard').innerHTML = `<h3>◎ Hiring Focus</h3><div class="tag-list">${p.hiringFocus.map(item => `<span class="tag">${item}</span>`).join('')}</div>`;
  $('#socialCard').innerHTML = `<h3>◉ Social & Company Links</h3>${[['Website',p.website],['LinkedIn',p.linkedin],['Twitter / X',p.twitter],['Facebook',p.facebook]].map(([label,value]) => `<div class="social-row"><strong>${label}</strong><span>${value || 'Not added'}</span></div>`).join('')}`;
  $('#teamCard').innerHTML = `<h3>♙ Team Members</h3>${p.teamMembers.map(m => `<div class="team-row"><span class="avatar" style="width:42px;height:42px">${m.initials}</span><div class="team-copy"><strong>${m.name}</strong><small>${m.role}</small></div><span class="access-pill">${m.access}</span></div>`).join('')}<button class="secondary-btn" style="width:100%;margin-top:14px">＋ Invite Team Member</button>`;
  $('#workplaceCard').innerHTML = `<h3>▣ Workplace & Hiring Details</h3>${[['Work Types',p.workTypes],['Preferred Locations',p.preferredLocations],['Interview Mode',p.interviewMode],['Hiring Volume',p.hiringVolume]].map(([a,b]) => `<div class="detail-row"><strong>${a}</strong><span>${b}</span></div>`).join('')}`;
  $('#activityCard').innerHTML = `<h3>⌁ Recent Activity</h3><div class="activity-list">${state.dashboard.recentActivity.map(a => `<div class="activity-row"><span class="metric-icon">${a.type==='job'?'▣':a.type==='event'?'▦':'♙'}</span><div><strong>${a.title}</strong><p>${a.detail}</p><small>${new Date(a.date).toLocaleString()}</small></div></div>`).join('')}</div>`;
}

function renderSettings() {
  const s = state.settings;
  const tab = state.activeSettingsTab;
  $$('.settings-tab').forEach(btn => btn.classList.toggle('active', btn.dataset.settingsTab === tab));
  const content = $('#settingsContent');
  if (tab === 'notifications') {
    content.innerHTML = `<h2>Notification Preferences</h2><p>Choose which employer updates you want to receive.</p>${[
      ['emailNotifications','Email notifications','Receive important account and hiring updates by email.'],
      ['applicantAlerts','New applicant alerts','Get notified when a candidate applies to a job.'],
      ['eventReminders','Event reminders','Receive reminders before scheduled hiring events.'],
      ['weeklySummary','Weekly hiring summary','Receive a weekly summary of hiring performance.']
    ].map(([key,title,desc]) => `<div class="setting-row"><div><strong>${title}</strong><p>${desc}</p></div><button class="toggle ${s[key]?'on':''}" data-toggle="${key}" aria-label="Toggle ${title}"></button></div>`).join('')}<div class="save-row"><button id="saveSettings" class="primary-btn">Save Settings</button></div>`;
  } else if (tab === 'account') {
    content.innerHTML = `<h2>Account & Security</h2><div class="setting-row"><div><strong>Account email</strong><p>${state.profile.email}</p></div><button class="secondary-btn">Change</button></div><div class="setting-row"><div><strong>Password</strong><p>Last updated 30 days ago</p></div><button class="secondary-btn">Update Password</button></div><div class="setting-row"><div><strong>Two-factor authentication</strong><p>Add an extra layer of security.</p></div><button class="secondary-btn">Enable</button></div>`;
  } else if (tab === 'preferences') {
    content.innerHTML = `<h2>Preferences</h2><div class="setting-row"><div><strong>Profile visibility</strong><p>Control who can view your employer profile.</p></div><select id="profileVisibility"><option ${s.profileVisibility==='Public'?'selected':''}>Public</option><option ${s.profileVisibility==='Private'?'selected':''}>Private</option></select></div><div class="setting-row"><div><strong>Language</strong></div><select id="language"><option>English</option><option>Spanish</option></select></div><div class="setting-row"><div><strong>Timezone</strong></div><input id="timezone" value="${s.timezone}"></div><div class="save-row"><button id="saveSettings" class="primary-btn">Save Settings</button></div>`;
  } else {
    content.innerHTML = `<h2>Danger Zone</h2><div class="setting-row"><div><strong>Sign out from all devices</strong><p>End every active Waypoint session.</p></div><button class="secondary-btn">Sign Out Everywhere</button></div><div class="setting-row"><div><strong>Delete employer account</strong><p>This permanently removes employer data and cannot be undone.</p></div><button class="primary-btn" style="background:#d73535">Delete Account</button></div>`;
  }
}

function renderNotifications() {
  const unread = state.notifications.some(n => !n.read);
  $('#notificationBadge').classList.toggle('hidden', !unread);
  $('#notificationList').innerHTML = state.notifications.map(n => `<article class="notification-item ${n.read?'':'unread'}"><strong>${n.title}</strong><p>${n.message}</p><small>${n.time}</small></article>`).join('');
}

function openProfileModal() {
  const form = $('#profileForm');
  const p = state.profile;
  [...form.elements].forEach(el => {
    if (!el.name) return;
    el.value = el.name === 'hiringFocus' ? p.hiringFocus.join(', ') : (p[el.name] || '');
  });
  $('#profileModal').classList.remove('hidden');
}

async function saveSettings() {
  const payload = { ...state.settings };
  const visibility = $('#profileVisibility');
  const language = $('#language');
  const timezone = $('#timezone');
  if (visibility) payload.profileVisibility = visibility.value;
  if (language) payload.language = language.value;
  if (timezone) payload.timezone = timezone.value;
  state.settings = await api('/api/settings', { method: 'PUT', body: JSON.stringify(payload) });
  showToast('Settings saved successfully.');
  renderSettings();
}

async function init() {
  try {
    const [dashboard, profile, settings, notifications] = await Promise.all([
      api('/api/dashboard'), api('/api/profile'), api('/api/settings'), api('/api/notifications')
    ]);
    Object.assign(state, { dashboard, profile, settings, notifications });
    renderHome(); renderProfile(); renderSettings(); renderNotifications();
  } catch (error) { showToast(error.message); }
}

$('#accountButton').addEventListener('click', () => $('#accountMenu').classList.toggle('hidden'));
$('#notificationButton').addEventListener('click', () => $('#notificationPanel').classList.toggle('hidden'));
$$('[data-page]').forEach(btn => btn.addEventListener('click', () => showPage(btn.dataset.page)));
$$('[data-placeholder]').forEach(btn => btn.addEventListener('click', () => openPlaceholder(btn.dataset.placeholder)));
$('#editProfileButton').addEventListener('click', openProfileModal);
$('#closeModal').addEventListener('click', () => $('#profileModal').classList.add('hidden'));
$('#cancelModal').addEventListener('click', () => $('#profileModal').classList.add('hidden'));
$('#profileForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(event.currentTarget));
  payload.hiringFocus = payload.hiringFocus.split(',').map(x => x.trim()).filter(Boolean);
  try {
    state.profile = await api('/api/profile', { method: 'PUT', body: JSON.stringify(payload) });
    state.dashboard = await api('/api/dashboard');
    renderProfile();
    $('#profileModal').classList.add('hidden');
    showToast('Profile saved successfully.');
  } catch (error) { showToast(error.message); }
});
$('#markAllRead').addEventListener('click', async () => {
  state.notifications = await api('/api/notifications/read-all', { method: 'POST' });
  renderNotifications(); showToast('All notifications marked as read.');
});
$('#logoutButton').addEventListener('click', async () => {
  await api('/api/logout', { method: 'POST' });
  showToast('Logged out successfully.');
  $('#accountMenu').classList.add('hidden');
});
document.addEventListener('click', async event => {
  const tab = event.target.closest('.settings-tab');
  if (tab) { state.activeSettingsTab = tab.dataset.settingsTab; renderSettings(); }
  const toggle = event.target.closest('[data-toggle]');
  if (toggle) { const key = toggle.dataset.toggle; state.settings[key] = !state.settings[key]; renderSettings(); }
  if (event.target.id === 'saveSettings') await saveSettings();
});
window.addEventListener('keydown', e => { if (e.key === 'Escape') $('#profileModal').classList.add('hidden'); });
init();
