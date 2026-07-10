const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data', 'portal.json');

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

async function readData() {
  try {
    return JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') {
      const initial = { profile: {}, settings: {}, notifications: [] };
      await writeData(initial);
      return initial;
    }
    throw error;
  }
}

async function writeData(data) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/dashboard', async (_req, res) => {
  try {
    const data = await readData();
    res.json({
      stats: data.stats,
      profile: data.profile,
      recentActivity: data.recentActivity || []
    });
  } catch {
    res.status(500).json({ message: 'Unable to load dashboard.' });
  }
});

app.get('/api/profile', async (_req, res) => {
  try {
    const data = await readData();
    res.json(data.profile);
  } catch {
    res.status(500).json({ message: 'Unable to load profile.' });
  }
});

app.put('/api/profile', async (req, res) => {
  try {
    const data = await readData();
    const allowed = [
      'name', 'companyName', 'role', 'email', 'phone', 'website', 'location',
      'industry', 'companySize', 'founded', 'timezone', 'about', 'hiringFocus',
      'workTypes', 'preferredLocations', 'interviewMode', 'hiringVolume',
      'linkedin', 'twitter', 'facebook'
    ];

    const updated = { ...data.profile };
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) updated[key] = req.body[key];
    }

    data.profile = updated;
    data.recentActivity = [
      {
        type: 'profile',
        title: 'Profile updated',
        detail: 'Company and employer information updated',
        date: new Date().toISOString()
      },
      ...(data.recentActivity || [])
    ].slice(0, 6);

    await writeData(data);
    res.json(data.profile);
  } catch {
    res.status(500).json({ message: 'Unable to save profile.' });
  }
});

app.get('/api/settings', async (_req, res) => {
  try {
    const data = await readData();
    res.json(data.settings);
  } catch {
    res.status(500).json({ message: 'Unable to load settings.' });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    const data = await readData();
    data.settings = {
      ...data.settings,
      emailNotifications: Boolean(req.body.emailNotifications),
      applicantAlerts: Boolean(req.body.applicantAlerts),
      eventReminders: Boolean(req.body.eventReminders),
      weeklySummary: Boolean(req.body.weeklySummary),
      profileVisibility: req.body.profileVisibility || 'Public',
      language: req.body.language || 'English',
      timezone: req.body.timezone || data.settings.timezone || 'Central Time (CT)'
    };
    await writeData(data);
    res.json(data.settings);
  } catch {
    res.status(500).json({ message: 'Unable to save settings.' });
  }
});

app.get('/api/notifications', async (_req, res) => {
  try {
    const data = await readData();
    res.json(data.notifications || []);
  } catch {
    res.status(500).json({ message: 'Unable to load notifications.' });
  }
});

app.post('/api/notifications/read-all', async (_req, res) => {
  try {
    const data = await readData();
    data.notifications = (data.notifications || []).map(item => ({ ...item, read: true }));
    await writeData(data);
    res.json(data.notifications);
  } catch {
    res.status(500).json({ message: 'Unable to update notifications.' });
  }
});

app.post('/api/logout', (_req, res) => {
  res.json({ message: 'Logged out successfully.' });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Waypoint Employer Portal running at http://localhost:${PORT}`);
});
