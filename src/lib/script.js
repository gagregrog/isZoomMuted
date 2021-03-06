const path = require('path');
const shell = require('shelljs');

const scriptDir = path.resolve(`${__dirname}/../scripts`);
const getStatusPath = `${scriptDir}/get_zoom_mute_status.scpt`;
const mutePath = `${scriptDir}/mute_zoom.scpt`;
const unmutePath = `${scriptDir}/unmute_zoom.scpt`;

const script = module.exports = {};

const getStateFromStatus = (status) => {
  const state = {
    muted: status === script.statuses.muted,
    unmuted: status === script.statuses.unmuted,
    inactive: status === script.statuses.inactive,
  };

  state.active = !state.inactive;

  return state;
}

script.statuses = {
  muted: 'MUTED',
  unmuted: 'UNMUTED',
  inactive: 'INACTIVE',
};

script.getMuteState = () => {
  const res = shell.exec(`osascript ${getStatusPath}`, { silent: true });
  const status = res.replace('\n', '');
  const state = getStateFromStatus(status);

  console.log(state);

  return state;
}

script.mute = () => {
  shell.exec(`osascript ${mutePath}`, { silent: true });
}

script.unmute = () => {
  shell.exec(`osascript ${unmutePath}`, { silent: true });
}

script.toggle = () => {
  const state = script.getMuteState();

  if (state.muted) {
    script.unmute();
  } else if (state.unmuted) {
    script.mute();
  }

  if (state.active) {
    state.muted = !state.muted;
    state.unmuted = !state.unmuted;
  }

  return state;
}
