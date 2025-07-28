document.addEventListener('DOMContentLoaded', () => {
  loadNotesForCurrentPage();

  document.getElementById('summarizeBtn').addEventListener('click', summarizeText);
  document.getElementById('saveNotesBtn').addEventListener('click', saveNotesForCurrentPage);
});

async function loadNotesForCurrentPage() {
  const url = await getCurrentPageUrl();
  chrome.storage.local.get(['researchNotes'], (result) => {
    const allNotes = result.researchNotes || {};
    const note = allNotes[url] || '';
    document.getElementById('notes').value = note;
    console.log('Loaded notes for:', url, note);
  });
}

async function saveNotesForCurrentPage() {
  const url = await getCurrentPageUrl();
  const notes = document.getElementById('notes').value;

  chrome.storage.local.get(['researchNotes'], (result) => {
    const allNotes = result.researchNotes || {};
    allNotes[url] = notes;

    chrome.storage.local.set({ researchNotes: allNotes }, () => {
      alert('Notes saved for this page!');
      console.log('Saved notes for:', url, notes);
    });
  });
}

async function getCurrentPageUrl() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0]?.url || 'unknown';
      resolve(url);
    });
  });
}

async function summarizeText() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => window.getSelection().toString()
    });

    if (!result) {
      showResult('Please select some text first');
      return;
    }

    console.log('Selected text:', result);
    console.log('Sending to backend...');

    const response = await fetch('http://localhost:8080/api/research/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: result, operation: 'summarize' })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const text = await response.text();
    showResult(text.replace(/\n/g, '<br>'));
  } catch (error) {
    showResult('Error: ' + error.message);
  }
}

function showResult(content) {
  document.getElementById('results').innerHTML = `
    <div class="result-item">
      <div class="result-content">${content}</div>
    </div>`;
}

