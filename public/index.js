window.addEventListener('load', () => {
  const btn = document.querySelector('#status');
  const state = { toggling: false };
  
  const fetchStatus = async () => {
    const res = await window.fetch('/status');
    const muteState = await res.json();

    handleMuteState(muteState);
  }

  const fetchStatusRecursively = async () => {
    await fetchStatus();

    if (!state.toggling) {
      await fetchStatusRecursively();
    }
  }

  const toggleStatus = async () => {
    state.toggling = true;
    btn.setAttribute('disabled', true);

    const clearToggling = () => {
      btn.removeAttribute('disabled');
      state.toggling = false;
      setTimeout(fetchStatusRecursively, 500);
    }

    const timeout = setTimeout(clearToggling, 5000);
    
    const res = await window.fetch('/toggle', { method: 'post' });
    const muteState = await res.json();
    handleMuteState(muteState);
    
    if (state.toggling) {
      clearTimeout(timeout);
      clearToggling();
    }
  }

  function handleMuteState(state) {
    if (state.active) {
      btn.classList.remove('inactive');
      btn.style.background = state.muted ? 'red' : 'lightgreen';
      btn.style.color = state.muted ? 'white' : 'black';
      btn.textContent = state.muted ? 'Muted' : 'Unmuted';
    } else {
      btn.classList.add('inactive');
      btn.textContent = 'Inactive';
    }
  }

  btn.addEventListener('click', toggleStatus);
  
  fetchStatusRecursively()
})
