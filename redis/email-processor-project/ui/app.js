const API_BASE = 'http://localhost:4000/api';

const uploadForm = document.getElementById('upload-form');
const fileInput = document.getElementById('file');
const uploadBtn = document.getElementById('upload-btn');
const uploadMessage = document.getElementById('upload-message');
const statusSection = document.getElementById('status-section');
const batchFilename = document.getElementById('batch-filename');
const batchStatus = document.getElementById('batch-status');
const batchProgress = document.getElementById('batch-progress');
const progressFill = document.getElementById('progress-fill');
const batchesList = document.getElementById('batches-list');
const refreshBtn = document.getElementById('refresh-btn');

function showMessage(text, type = '') {
  uploadMessage.textContent = text;
  uploadMessage.className = 'message' + (type ? ` ${type}` : '');
}

function showStatus(batch) {
  statusSection.hidden = false;
  batchFilename.textContent = batch.filename || batch.batchId || '-';
  batchStatus.textContent = batch.status || '-';

  const total = batch.totalEmails ?? batch.total ?? 0;
  const inserted = batch.insertedCount ?? batch.inserted ?? 0;

  batchProgress.textContent = `${inserted} / ${total}`;
  const pct = total > 0 ? Math.round((inserted / total) * 100) : 0;
  progressFill.style.width = pct + '%';

  // Change bar color based on status
  if (batch.status === 'completed') {
    progressFill.style.background = '#22c55e'; // green
  } else if (batch.status === 'inserting') {
    progressFill.style.background = '#f59e0b'; // orange
  } else {
    progressFill.style.background = '#2563eb'; // blue
  }
}

function connectStream(batchId) {
  const es = new EventSource(`${API_BASE}/batches/${batchId}/stream`);
  es.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);
      if (data.error) {
        showMessage(data.error, 'error');
        return;
      }
      showStatus(data);
    } catch (_) {}
  };
  es.onerror = () => es.close();
  return es;
}

uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const file = fileInput.files[0];
  if (!file) {
    showMessage('Please select a CSV file.', 'error');
    return;
  }
  uploadBtn.disabled = true;
  showMessage('Uploading…');
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      showMessage(data.error || 'Upload failed', 'error');
      uploadBtn.disabled = false;
      return;
    }
    showMessage(`Queued: ${data.totalEmails} emails. Worker will insert them into the database.`, 'success');
    showStatus({
      filename: data.filename,
      status: data.status,
      totalEmails: data.totalEmails,
      insertedCount: 0,
    });
    connectStream(data.batchId);
  } catch (err) {
    showMessage('Network error: ' + err.message, 'error');
  }
  uploadBtn.disabled = false;
});

async function loadBatches() {
  batchesList.textContent = 'Loading…';
  try {
    const res = await fetch(`${API_BASE}/batches`);
    const list = await res.json();
    if (!list.length) {
      batchesList.innerHTML = '<p class="hint">No batches yet. Upload a CSV above.</p>';
      return;
    }
    batchesList.innerHTML = list
      .map((b) => {
        return `<div class="batch-item">
            <span>${escapeHtml(b.filename)} — ${b.insertedCount}/${b.totalEmails}</span>
            <span class="status ${b.status}">${b.status}</span>
          </div>`;
      })
      .join('');
  } catch {
    batchesList.textContent = 'Could not load batches. Is the API running?';
  }
}

function escapeHtml(s) {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

refreshBtn.addEventListener('click', loadBatches);
loadBatches();
