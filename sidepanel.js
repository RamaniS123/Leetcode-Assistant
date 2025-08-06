document.addEventListener('DOMContentLoaded', ()=> { 
  
  // Get the currently active tab
  chrome.tabs.query({active: true, currentWindow: true }, ([tab]) => { 
    
    // If the tab or the URL is not available display this
    if (!tab || !tab.url) { 
      document.body.innerHTML = `
        <div style = "padding: 15px; font-family: Arial, sans-serif;">
          <h3> Sorry! </h3>
          <p> This extension only works on LeetCode problem pages.</p>
          <p>Please navigate to a LeetCode problem to begin using the assistant.</p>
        </div>
      `; 
      return; 
    }

    // Check if the current URL is actually a LeetCode problem 
    const isLeetCodeProblem = tab.url.startsWith('https://leetcode.com/problems/'); 

    // If it's not a LeetCode problem, then show the same "unsupported page" message as before 

    if (!isLeetCodeProblem) { 
      document.body.innerHTML = `
        <div style = "padding: 15px; font-family: Arial, sans-serif;">
          <h3> Sorry! </h3>
          <p> This extension only works on LeetCode problem pages.</p>
          <p>Please navigate to a LeetCode problem to begin using the assistant.</p>
        </div>
      `; 
      return; 
    }

    // Use just the path form the tab's URL to use as a unique key for saving the notes

    const pageUrl = new URL(tab.url).pathname; 

    // Load the previously saved notes for the specific LeetCode problem from Chrome local storage 
    chrome.storage.local.get([pageUrl], (data) => { 
      document.getElementById('notes').value = data[pageUrl] || ''; 
    }); 

    // Save notes button 
    document.getElementById('saveNotesBtn').addEventListener('click', () => { 
      const notes = document.getElementById('notes').value; 
      chrome.storage.local.set({ [pageUrl]: notes}); 

      showToast('✅ Notes saved!');
    })

    // Clear notes button 
    document.getElementById('clearNotesBtn').addEventListener('click', () => { 
      chrome.storage.local.remove(pageUrl); 

      document.getElementById('notes').value = ''; 

      showToast('🗑️ Notes cleared!'); 
    }); 

    // Set up key buttons and call the backend for each 

    document.getElementById('explainBtn').addEventListener('click', () => handleAction('explain', tab.url)); 

    document.getElementById('hintBtn').addEventListener('click', () => handleAction('hint', tab.url)); 

    document.getElementById('coachBtn').addEventListener('click', () => handleAction('coach', tab.url)); 
  }); 
}); 

// Display Toasty messages
function showToast(message) {
  const toastContainer = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.remove();
    }, 500);
  }, 3000); 
}


// Handle calls to the backend API 
async function handleAction(operation,url) { 
  showResult("Loading..."); 

  try { 
    const response = await fetch('http://localhost:8080/api/leetcode/process', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json'}, 
      body: JSON.stringify({content: url, operation})
    }); 

    if (!response.ok) { 
      throw new Error(`Server Error: ${response.status}`); 
    }

    const text = await response.text(); 

    showResult(text.replace(/\n/g, '<br>'));

  } catch(err) { 
    showResult(`Error: ${err.message}`); 
  }
}

// Update the result box content
function showResult(content) { 
  document.getElementById('results').innerHTML = `<div class="result-box">${content}</div>`
}
