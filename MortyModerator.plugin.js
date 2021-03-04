/**
 * @name MortyModerator
 * @description Narzędzie ułatwiające moderację i administrację serwera Cytadela.
 * @website https://github.com/MsAfro12/MortyModerator
 * @github https://github.com/MsAfro12/MortyModerator
 * @github_raw
 * @updateUrl
 * @source
 * @author Afro
 * @authorId 238269609172533248
 * @invite GXPzyvY
 */

 module.exports = (() => {
	// ------------------------------------------------------------------------------------------------------------
	// ------------------------------------ Config ----------------------------------------------------------------
	// ------------------------------------------------------------------------------------------------------------
  
	const config = {
	  info: {
		name: "MortyModerator",
		description:
		  "Narzędzie ułatwiające moderację i administrację serwera Cytadela.",
		website: "https://github.com/MsAfro12/MortyModerator",
		github: "https://github.com/MsAfro12/MortyModerator",
		github_raw: "",
		updateUrl: "",
		source: "",
		author: "Afro",
		authorId: "231850998279176193",
		invite: "GXPzyvY",
		version: "1.0.0",
	  },
  
	  // added, fixed, improved
	  changeLog: {},
  
	  // milliseconds
	  time: {
		starting_delay: 250,
  
		tick_interval: { min: 500, max: 1e3 },
		sending_message_timeout: { min: 2e3, max: 4e3 },
		deleting_message_timeout: { min: 1e3, max: 2e3 },
		sending_command_timeout: { min: 2e3, max: 4e3 },
		adding_reaction_timeout: { min: 1e3, max: 2e3 },
	  },
	};
  
	// ------------------------------------------------------------------------------------------------------------
	// ------------------------------------ Structures ------------------------------------------------------------
	// ------------------------------------------------------------------------------------------------------------
  
	function queue() {
	  this._stack1 = [];
	  this._stack2 = [];
	}
  
	queue.prototype = {
	  push(item) {
		this._stack1.push(item);
	  },
  
	  shift() {
		if (this._stack2.length === 0) {
		  while (this._stack1.length > 0) {
			const item = this._stack1.pop();
			this._stack2.push(item);
		  }
		}
  
		return this._stack2.pop();
	  },
  
	  get length() {
		return this._stack1.length + this._stack2.length;
	  },
	};
  
	// ------------------------------------------------------------------------------------------------------------
	// ------------------------------------ Constants--------------------------------------------------------------
	// ------------------------------------------------------------------------------------------------------------
  
	const images = {
	  person: `<svg height='24px' width='24px' fill="#FFFF40" x="0px" y="0px" viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;"><g><path d="M83.9,77.4c-2.4-13-13.7-22.5-26.9-22.5H43.3c-13.5,0-24.9,9.8-27.1,23.1v0c-1.1,6.7,4.1,12.7,10.8,12.7h46.2 c6.8,0,12-6.2,10.8-12.9L83.9,77.4z"></path><path d="M36.1,44.2c7.8,7.8,20.4,8,28.4,0.4l0.2-0.2c6.9-6.6,7.6-17.3,1.5-24.7l0,0c-8.3-10-23.7-9.8-31.7,0.4l0,0 c-5.6,7.2-5,17.5,1.5,24L36.1,44.2z"></path></g></svg>`,
	  crossed_out_person: `<svg height='24px' width='24px' fill="#FFFF40" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100"><path d="M85.9,71.7c-0.1-2.1-0.4-4.3-0.7-6.7c-0.4-2.4-0.8-4.6-1.3-6.7c-0.5-2.1-1.3-4.1-2.2-6c-0.9-2-1.9-3.6-3.1-5 c-1.2-1.4-2.6-2.5-4.3-3.3c-1.7-0.8-3.5-1.2-5.5-1.2l0,0h0c0,0,0,0-0.1,0c0,0,0,0,0,0l-0.9,0c4.3-4.5,6.5-9.9,6.5-16.2 c0-6.5-2.3-12-6.9-16.6C62.9,5.3,57.3,3,50.8,3c-6.5,0-12,2.3-16.6,6.9c-4.6,4.6-6.9,10.1-6.9,16.6c0,6.3,2.2,11.7,6.5,16.2l-0.9,0 c0,0,0,0,0,0c0,0,0,0,0,0h-0.1l0,0c-2,0-3.9,0.4-5.5,1.2c-1.7,0.8-3.1,1.9-4.3,3.3c-1.2,1.4-2.2,3-3.1,5c-0.9,2-1.6,4-2.2,6 c-0.5,2.1-1,4.3-1.3,6.7c-0.4,2.4-0.6,4.7-0.7,6.7c-0.1,2.1-0.2,4.2-0.2,6.4c0,4.9,1.2,8.8,3.7,11.7c2.4,2.9,5.7,4.3,9.7,4.3h43.8 c4,0,7.3-1.4,9.7-4.3c2.4-2.9,3.7-6.8,3.7-11.7C86.1,75.9,86.1,73.8,85.9,71.7z M66.5,76.3c0.5,0.5,0.7,1.1,0.7,1.8 c0,0.7-0.2,1.3-0.7,1.8l-3.5,3.5c-0.5,0.5-1.1,0.7-1.8,0.7c-0.7,0-1.3-0.2-1.8-0.7l-7.6-7.6l-7.6,7.6c-0.5,0.5-1.1,0.7-1.8,0.7 c-0.7,0-1.3-0.2-1.8-0.7l-3.5-3.5c-0.5-0.5-0.7-1.1-0.7-1.8c0-0.7,0.2-1.3,0.7-1.8l7.6-7.6l-7.6-7.6c-0.5-0.5-0.7-1.1-0.7-1.8 c0-0.7,0.2-1.3,0.7-1.8l3.5-3.5c0.5-0.5,1.1-0.7,1.8-0.7c0.7,0,1.3,0.2,1.8,0.7l7.6,7.6l7.6-7.6c0.5-0.5,1.1-0.7,1.8-0.7 c0.7,0,1.3,0.2,1.8,0.7l3.5,3.5c0.5,0.5,0.7,1.1,0.7,1.8c0,0.7-0.2,1.3-0.7,1.8l-7.6,7.6L66.5,76.3z"></path></svg>`,
	  trash: `<svg height='24px' width='24px' fill="#FFFF40" viewBox="0 0 25 25" x="0px" y="0px"><g data-name="Icon 1"><path d="M4.5,8h.5321L5.94,21.6558a1.5016,1.5016,0,0,0,1.496,1.4013h10.129a1.5015,1.5015,0,0,0,1.496-1.4L19.9679,8H20.5a.5.5,0,0,0,.5-.5v-2a.5.5,0,0,0-.5-.5H4.5a.5.5,0,0,0-.5.5v2A.5.5,0,0,0,4.5,8Zm11.42,9.2129-.707.707L12.5,15.207,9.7871,17.92l-.707-.707L11.793,14.5,9.08,11.7871l.707-.707L12.5,13.793,15.2129,11.08l.707.707L13.207,14.5Z"></path><path d="M10,3h5V4h1V2.5a.5.5,0,0,0-.5-.5h-6a.5.5,0,0,0-.5.5V4h1Z"></path></g></svg>`,
	  nonsense: `<svg height='300px' width='300px' fill="#FFFF40" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100"><path d="M15.4,12c-0.1,3.2-0.4,6-0.4,8.7c0,4.8,0.2,9.5,0.3,14.3c0.1,6.2,0.1,12.5,0,18.7c-0.1,2.7,0,5.3,0.1,8 c0.1,2.7-0.1,5.5-0.2,8.2c-0.2,4.1-0.4,8.2-0.6,12.2c0,1-0.1,2.1-0.1,3.1c0,0.9,0.3,1.4,1.3,1.5c3.3,0.3,6.5,0.8,9.8,0.1 c0.5-0.1,1-0.1,1.6-0.2c3.6-0.1,7.3-0.2,10.9-0.4c1.6-0.1,3.2-0.6,4.8-0.7c1.6-0.1,3.3,0,4.9,0.1c0.7,0,1.5,0.1,2.2,0.1 c3.9,0,7.9-0.2,11.8,0c4.5,0.2,9,0.7,13.6,1.1c0.9,0.1,1.8,0.3,2.7,0.3c3.9,0.1,7.5,1.2,11,2.7c0.5,0.2,1.1,0.5,1.5,0.9 c0.8,0.7,1,1.6,0.8,2.6c-0.2,1.1-1.1,1.4-2,1.4c-1.3,0.1-2.7,0.2-4,0c-6.3-0.6-12.6-1.4-18.9-1.9c-3.8-0.3-7.7-0.2-11.6-0.2 c-1.5,0-3,0.2-4.5,0.1c-5.5-0.3-11,0.7-16.4,1.2c-0.3,0-0.6,0.1-0.9,0.1c-5.3-0.1-10.6-0.2-15.8-0.3c-2.1-0.1-4.3-0.3-6.4-0.5 c-1.1-0.1-2.1-0.4-2.8-0.6c0-3.8,0-7.2,0-10.6c0-2.3,0.2-4.6,0.3-6.9c0.1-2.9,0.2-5.8,0.3-8.7c0-0.1,0-0.1,0-0.2 C8.4,59.4,8.1,52.3,8,45.3c-0.1-4.7,0.2-9.4,0.2-14c0-2.4-0.2-4.7-0.2-7.1c0-2.5,0.2-4.9,0.3-7.4c0.1-2.3,0.1-4.6,0.1-6.9 c0-1.9,0.3-2.2,2.2-2.1c1.2,0.1,2.3,0.3,3.5,0.4c3.4,0.3,6.6-1,9.8-1.7c3.6-0.9,7.2-1.4,11-1.4c8.7-0.1,17.2,1.2,25.8,1.4 c3.3,0.1,6.5,0,9.8,0.1c3.6,0.1,7.1,0.5,10.7,0.6c1.2,0.1,2.4,0,3.6-0.1c1.9-0.1,3.6-0.2,5.5,0.5c1.2,0.4,1.5,0.9,1.4,2.1 c0,0.7,0.2,1.5,0.3,2.2c0.1,0.9,0.1,1.8,0,2.6c-0.2,1.9-0.5,3.8-0.7,5.7c-0.4,6,0,12,0.2,18c0.1,6,0,12,0.1,18.1 c0,3.9,0.2,7.7,0.2,11.6c0,1.8-0.5,3.5-0.8,5.3c-0.1,0.3-0.3,0.7-0.6,0.8c-1.6,0.7-3.4,1.5-4.9,0.8c-3.1-1.3-6.3-1.1-9.4-1 c-4.7,0.1-9.5,0.7-14.2,0.8c-3,0.1-6.1-0.3-9.1-0.3c-4.1,0-8.2,0.3-12.3,0.3c-2.2,0-4.4-0.1-6.7-0.2c-1.3-0.1-2-0.9-2.3-2.2 c-0.1-0.6-0.4-1.1-0.5-1.7c-0.1-0.6-0.4-1.4-0.3-1.9c0.7-2.1,0.2-4.3,0.2-6.4c0-3,0.1-6.1,0.1-9.1c0.1-3.6,0.4-7.1,0.4-10.7 c0-3.8,0-7.6-0.3-11.3c-0.3-2.8,1.3-4.6,2.4-6.7c0.2-0.3,0.7-0.5,1.1-0.5c3.5,0,7,0.1,10.4,0.2c4.9,0.1,9.8,0.2,14.7,0.4 c3,0.1,5.9,0.6,8.9,0.8c2.5,0.2,3.5,2,3.9,3.8c0.8,3.1,1.3,6.2,0.1,9.4c-0.6,1.8-0.9,3.7-1.4,5.6c-0.1,0.4-0.1,0.9,0,1.3 c0.8,3.1-0.2,6.2-0.1,9.3c0,2.7-0.8,3.4-3.5,3.5c-4.5,0.2-9.1,0.4-13.6,0.5c-1.3,0-2.7-0.3-4-0.5c-0.8-0.2-1.3-0.8-1.7-1.6 c-0.9-1.9-1.1-3.9-1.1-5.9c0-2.5,0.1-5.1,0.4-7.6c0.2-1.9,2.6-3.7,4.4-3.1c1.6,0.5,3.1,0.2,4.5-0.3c0.3-0.1,0.6-0.2,0.9-0.2 c1.5-0.2,2.4,0.7,1.8,2.1c-0.7,1.7-1.3,2.9-3.6,2.7c-1-0.1-2,0.1-3,0.2c-1.2,2.7,0.5,5,0.3,7.3c4.3,0.5,8.5,1,13,1.6 c0-1.3,0.1-2.5,0-3.7c-0.4-3.8-0.1-7.5,0.6-11.3c0.4-2.1,0.1-4.3,0.1-6.7c-0.9,0-1.9-0.1-2.8-0.1c-2.4,0-4.7,0-7.1-0.1 c-5.1-0.3-10.2-0.6-15.4-1c-0.9-0.1-1.8-0.2-2.7-0.2c-1.3,0-1.5,0.3-1.5,1.6c0,3,0.1,6.1,0,9.1c-0.1,3.1-0.4,6.2-0.7,9.3 c-0.3,3.4-0.3,6.7,0.7,10.1c0.6,2,0.7,4.2,1.1,6.7c1.4,0,2.8,0,4.3,0c4.7,0,9.4-0.1,14-0.2c1.8,0,3.6,0,5.4,0 c3.4,0,6.8-0.1,10.3-0.1c1.1,0,2.2,0.3,3.3,0.4c2.2,0.4,4.4,0.8,6.6,1.2c1.6,0.3,2,0,2.1-1.6c0.1-1.3,0.1-2.5,0.1-3.8 c-0.1-6.6-0.1-13.2-0.2-19.9c-0.1-4.5-0.4-8.9-0.4-13.4c0-3.5,0.4-6.9,0.8-10.4c0.2-1.7,0.5-3.5,0.7-5.3c-2.5-0.2-4.7-0.4-6.9-0.5 c-4.1-0.2-8.2-0.6-12.3-0.5c-7.6,0.3-15.1-0.7-22.7-1.3c-5.3-0.4-10.7-0.1-16.1-0.1C23.4,11.7,19.6,11.9,15.4,12z"></path></svg>`,
	  no_media: `<svg height='24px' width='24px' fill="#FFFF40" data-name="Laag 1" viewBox="0 0 100 100" x="0px" y="0px"><polygon points="75.91 78.29 74.81 77.28 73.73 76.29 26.51 76.29 25.43 77.28 24.33 78.29 24.2 78.41 24.2 79.61 77.35 79.61 75.91 78.29"></polygon><polygon points="79.01 28.17 78.01 29.09 78.01 70.17 79.01 71.08 80.01 72 81.34 73.22 81.34 26.04 80.01 27.26 79.01 28.17"></polygon><polygon points="77.48 19.52 78.57 18.52 21.67 18.52 22.76 19.52 23.86 20.52 76.38 20.52 77.48 19.52"></polygon><polygon points="22.25 70.14 22.25 29.11 21.25 28.19 20.25 27.27 20.25 71.98 21.25 71.06 22.25 70.14"></polygon><path d="M65.82,27a4.87,4.87,0,0,1,2.66.8l3.91-3.59H27.85l16.41,15L47,33.8l5.52,8.57,9-8.28A4.83,4.83,0,0,1,65.82,27Z"></path><polygon points="39.88 47.78 40.76 46.07 25.28 31.88 25.28 57.72 28.05 57.72 36.93 43.28 39.88 47.78"></polygon><polygon points="74.36 57.72 74.36 32.44 63.38 42.5 72.93 57.72 74.36 57.72"></polygon><polygon points="88.85 10.36 79.95 18.52 78.86 19.52 77.77 20.52 75.98 22.16 75.81 22.31 75.64 22.47 74.11 23.87 73.95 24.02 73.78 24.18 69.21 28.37 62.12 34.87 53.07 43.16 51.01 45.05 50.12 45.86 49.23 45.05 43.82 40.09 26.46 24.18 26.29 24.02 26.13 23.87 24.6 22.47 24.43 22.31 24.26 22.16 22.47 20.52 21.38 19.52 20.29 18.52 11.39 10.36 7.99 7.24 4.24 11.33 20.25 26.01 21.25 26.93 22.25 27.84 23.89 29.35 24.04 29.48 24.2 29.63 24.97 30.34 25.13 30.48 25.28 30.62 41.19 45.21 45.12 48.81 46.02 49.62 37.18 57.72 37.02 57.87 36.85 58.03 34.56 60.12 24.2 69.62 24.04 69.77 23.89 69.91 22.25 71.41 21.25 72.33 20.25 73.24 8.45 84.06 11.39 87.26 12.2 88.15 22.96 78.29 23.89 77.43 24.04 77.3 24.06 77.28 24.2 77.15 25.14 76.29 42.86 60.04 45.06 58.03 45.23 57.87 45.4 57.72 50.12 53.39 54.84 57.72 55.01 57.87 55.18 58.03 57.23 59.9 75.1 76.29 76.18 77.28 77.28 78.29 78.72 79.61 78.9 79.77 79.06 79.92 88.04 88.15 88.85 87.26 91.79 84.06 81.65 74.76 81.5 74.63 81.34 74.48 80.01 73.26 79.01 72.34 78.01 71.43 65.35 59.83 63.39 58.03 63.22 57.87 63.06 57.72 54.22 49.62 55.12 48.81 62.88 41.7 74.36 31.17 74.51 31.03 74.67 30.89 78.01 27.82 79.01 26.91 80.01 25.99 81.34 24.77 81.5 24.62 81.65 24.49 96 11.33 92.25 7.24 88.85 10.36"></polygon></svg>`,
	  checkbox_cross: `<svg height='24px' width='24px' fill="#FFFF40" x="0px" y="0px" viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;"><path d="M80.8,5H19.3C11.4,5,5,11.4,5,19.3v61.5C5,88.6,11.4,95,19.3,95h61.5C88.6,95,95,88.6,95,80.8V19.3C95,11.4,88.6,5,80.8,5z M85,80.8c0,2.3-1.9,4.3-4.3,4.3H19.3c-2.3,0-4.3-1.9-4.3-4.3V19.3c0-2.3,1.9-4.3,4.3-4.3h61.5c2.3,0,4.3,1.9,4.3,4.3V80.8z M69.9,61.6c2,1.9,2.2,5,0.3,7.1c-1,1.1-2.3,1.6-3.7,1.6c-1.2,0-2.4-0.4-3.4-1.3L50.3,57.1L38.4,69.9c-1,1.1-2.3,1.6-3.7,1.6 c-1.2,0-2.4-0.4-3.4-1.3c-2-1.9-2.2-5-0.3-7.1l11.9-12.9L30.1,38.4c-2-1.9-2.2-5-0.3-7.1c1.9-2,5-2.2,7.1-0.3l12.9,11.9l11.9-12.9 c1.9-2,5-2.2,7.1-0.3c2,1.9,2.2,5,0.3,7.1L57.1,49.7L69.9,61.6z"></path></svg>`,
	  banhammer: `<svg height='24px' width='24px' fill="#FF4040" x="0px" y="0px" viewBox="0 0 80 80" enable-background="new 0 0 80 80"><path d="M28.832,70.75l-0.542-2C27.693,66.542,25.604,65,23.208,65H8.792c-2.395,0-4.485,1.542-5.082,3.75l-0.542,2 c-0.394,1.454-0.087,2.983,0.84,4.195C4.992,76.232,6.578,77,8.25,77h15.5c1.672,0,3.258-0.768,4.242-2.055 C28.919,73.733,29.226,72.204,28.832,70.75z"></path><path d="M9,17c-1.104,0-2-0.896-2-2v-4c0-1.104,0.896-2,2-2s2,0.896,2,2v4C11,16.104,10.104,17,9,17z"></path><circle cx="9" cy="5" r="2"></circle><path d="M23,11c-1.104,0-2-0.896-2-2V5c0-1.104,0.896-2,2-2s2,0.896,2,2v4C25,10.104,24.104,11,23,11z"></path><circle cx="23" cy="15" r="2"></circle><path d="M72,30c-2.045,0-3.802,1.237-4.576,3H27v-8c0-3.309-2.691-6-6-6H11c-3.309,0-6,2.691-6,6v30c0,3.309,2.691,6,6,6h10 c3.309,0,6-2.691,6-6v-8h40.424c0.774,1.763,2.531,3,4.576,3c2.757,0,5-2.243,5-5V35C77,32.243,74.757,30,72,30z M21,55H11 c-1.104,0-2-0.896-2-2s0.896-2,2-2h10c1.104,0,2,0.896,2,2S22.104,55,21,55z M21,29H11c-1.104,0-2-0.896-2-2s0.896-2,2-2h10 c1.104,0,2,0.896,2,2S22.104,29,21,29z M49.789,39.895l-1,2C48.438,42.596,47.732,43,46.999,43c-0.301,0-0.606-0.067-0.893-0.211 c-0.988-0.494-1.388-1.695-0.895-2.684l1-2c0.495-0.988,1.697-1.388,2.684-0.895C49.882,37.705,50.283,38.906,49.789,39.895z M56.789,39.895l-1,2C55.438,42.596,54.732,43,53.999,43c-0.301,0-0.606-0.067-0.893-0.211c-0.988-0.494-1.388-1.695-0.895-2.684 l1-2c0.495-0.988,1.696-1.388,2.684-0.895C56.882,37.705,57.283,38.906,56.789,39.895z M63.789,39.895l-1,2 C62.438,42.596,61.732,43,60.999,43c-0.301,0-0.606-0.067-0.893-0.211c-0.988-0.494-1.388-1.695-0.895-2.684l1-2 c0.495-0.988,1.697-1.388,2.684-0.895C63.882,37.705,64.283,38.906,63.789,39.895z"></path></svg>`,
	  mute: `<svg height='24px' width='24px' fill="#FFA040" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100"><path d="M50,12.8c20.5,0,37.2,16.7,37.2,37.2S70.5,87.2,50,87.2c-20.5,0-37.2-16.7-37.2-37.2S29.5,12.8,50,12.8 M50,5 C25.1,5,5,25.2,5,50c0,24.8,20.1,45,45,45c24.9,0,45-20.2,45-45C95,25.2,74.9,5,50,5 M41.1,40.5c0,3.3-2.7,6-6,6c-3.3,0-6-2.7-6-6 s2.7-6,6-6C38.4,34.6,41.1,37.2,41.1,40.5 M64.9,34.6c-3.3,0-6,2.7-6,6c0,3.3,2.7,6,6,6c3.3,0,6-2.7,6-6 C70.9,37.3,68.2,34.6,64.9,34.6 M55.5,67.6l2.3-2.3c1.5-1.5,1.5-4,0-5.5c-1.5-1.5-4-1.5-5.5,0L50,62.1l-2.3-2.3 c-1.5-1.5-4-1.5-5.5,0c-1.5,1.5-1.5,4,0,5.5l2.3,2.3l-2.3,2.3c-1.5,1.5-1.5,4,0,5.5c1.5,1.5,4,1.5,5.5,0l2.3-2.3l2.3,2.3 c1.5,1.5,4,1.5,5.5,0c1.5-1.5,1.5-4,0-5.5L55.5,67.6z"></path></svg>`,
	  link: `<svg height='24px' width='24px'  fill="#FFFF40" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100"><path d="M57.041,68.077L43.288,81.831c-6.919,6.919-18.157,6.951-25.117,0.097l-0.001,0.001c-0.016-0.016-0.032-0.033-0.048-0.05  c-0.016-0.016-0.033-0.032-0.05-0.048c0,0,0,0,0,0l0.001-0.001c-6.854-6.96-6.823-18.198,0.097-25.117l15.156-15.156  c6.919-6.919,18.157-6.951,25.117-0.097l0.001-0.001c0.016,0.016,0.032,0.033,0.048,0.049c0.016,0.016,0.033,0.032,0.05,0.049  l-0.001,0.001c0.832,0.845,1.563,1.752,2.192,2.707l-4.118,4.118c-1.174,1.174-2.962,1.363-4.338,0.575  c-0.181-0.228-0.375-0.448-0.584-0.66c-3.21-3.152-8.385-3.136-11.573,0.052L24.963,63.506c-3.19,3.19-3.205,8.368-0.048,11.578  c3.21,3.157,8.389,3.142,11.578-0.048l8.615-8.615C48.885,68.059,53.022,68.61,57.041,68.077z M81.831,18.071l-0.001,0.001  c-6.96-6.854-18.198-6.823-25.117,0.097L42.959,31.923c4.02-0.533,8.157,0.018,11.933,1.655l8.615-8.615  c3.19-3.19,8.368-3.205,11.578-0.048c3.157,3.21,3.142,8.389-0.048,11.578L59.881,51.65c-3.188,3.188-8.363,3.204-11.573,0.052  c-0.208-0.212-0.403-0.432-0.584-0.66c-1.376-0.788-3.164-0.599-4.338,0.575l-4.118,4.118c0.629,0.955,1.36,1.863,2.192,2.707  l-0.001,0.001c0.016,0.016,0.033,0.032,0.05,0.049c0.016,0.016,0.032,0.033,0.048,0.049l0.001-0.001  c6.96,6.854,18.198,6.823,25.117-0.097l15.156-15.156c6.919-6.919,6.951-18.157,0.097-25.117l0.001-0.001l0,0  c-0.016-0.016-0.033-0.032-0.05-0.048C81.863,18.104,81.847,18.088,81.831,18.071z"></path></svg>`,
	  ok_hand: `<svg height='24px' width='24px' fill="#40FF40" viewBox="0 0 100 100" x="0px" y="0px"><path d="M38.17,69.56c-1.73-1.68-1.73-2.43,0-4.16s14.26,0,14.26-1.72-14.51,0-16.26-1.72-1.73-3.43,0-5.16,16.26,0,16.26-1.72-16.51,0-18.26-1.72-1.73-3.43,0-5.16,18.26,0,18.26-1.72-13.51,0-15.26-1.72-1.73-3.43,0-5.16S52.74,38.75,54,37.32c3.19-3.76-4-15.71-.25-19.22,2.66-2.51,2.36-2.16,4.9,0,3.74,3.18,3.29,16.19,12.26,22,6.17,4,18.75,4.6,24.13,4.59a45,45,0,1,0-1.89,19.25c-22.61,0-21.2,6.5-42.3,6.5C50.35,70.42,39.92,71.26,38.17,69.56Z"></path></svg>`,
	  not_ok_hand: `<svg height='24px' width='24px' fill="#40A040" viewBox="0 0 100 100" x="0px" y="0px"><path d="M38.17,30.44c-1.73,1.68-1.73,2.43,0,4.16s14.26,0,14.26,1.72-14.51,0-16.26,1.72-1.73,3.43,0,5.16,16.26,0,16.26,1.72-16.51,0-18.26,1.72-1.73,3.43,0,5.16,18.26,0,18.26,1.72-13.51,0-15.26,1.72-1.73,3.43,0,5.16,15.57.86,16.79,2.29c3.19,3.76-4,15.71-.25,19.22,2.66,2.51,2.36,2.16,4.9,0,3.74-3.18,3.29-16.19,12.26-22,6.17-4,18.75-4.6,24.13-4.59a45,45,0,1,1-1.89-19.25c-22.61,0-21.2-6.5-42.3-6.5C50.35,29.58,39.92,28.74,38.17,30.44Z"></path></svg>`,
	  AD: `<svg height='24px' width='24px' fill="#FF4040" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100"><g><text x="0" y="75" style="font: bold 70px sans-serif;">AD</text></g></svg>`,
	  SWEARING: `<svg height='24px' width='24px' fill="#FFFF40" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100"><g><text x="0" y="80" style="font: bold 90px sans-serif;">%!</text></g></svg>`,
	};
  
	const channels = {
		//Admin
		konsola:"804058731213619220",

		//support
		support:"817002021256298536",
	};
  
	const guild_id = "758440045190316032";
  
	const roles = {};
  
	const emojis = {
	  thumb_up: { id: "797226341354176572", name: "yes" },
	  thumb_down: { id: "797226362930462742", name: "no" },
	};
  
	// ------------------------------------------------------------------------------------------------------------
	// ------------------------------------ CSS -------------------------------------------------------------------
	// ------------------------------------------------------------------------------------------------------------
  
    const css = `
      .${config.info.name + "-MessageOptionToolbar-button"}{}
          #user-context-${config.info.name + "-Menu-UserContextMenu"}
          {
              color: #e0b840!important
          }
          #user-context-${config.info.name + "-Menu-UserContextMenu"}.da-focused
          {
              color: var(--background-floating)!important;
              background: #E0B840!important;
          }
          #user-context-${config.info.name + "-Kary-UserContextMenu"}
          {
              color: #E04040!important;
          }
          #user-context-${config.info.name + "-Kary-UserContextMenu"}.da-focused
          {
              color: var(--background-floating)!important;
              background: #E04040!important;
          }
  
          #user-context-${config.info.name + "-Kary-UserContextMenu--setnote"}.da-focused
          {
              color: #5c6fb1!important;
              background: #5c6fb140!important;
          }
          #user-context-${config.info.name + "-Kary-UserContextMenu--notes"}.da-focused
          {
              color: #5c6fb1!important;
              background: #5c6fb140!important;
          }
          #user-context-${config.info.name + "-Kary-UserContextMenu--warn"}.da-focused
          {
              color: #3ca374;
              background: #3ca37440!important;
          }
          #user-context-${config.info.name + "-Kary-UserContextMenu--mute"}.da-focused
          {
              color: #E0B840!important;
              background: #E0B84040!important;
          }	
          #user-context-${config.info.name + "-Kary-UserContextMenu--hardmute"}.da-focused
          {
              color: #E0B840!important;
              background: #E0B84040!important;
          }
          #user-context-${config.info.name + "-Kary-UserContextMenu--ban"}.da-focused
          {
              color: #E04040!important;
              background: #E0404040!important;
          }		
          #user-context-${config.info.name + "-Kary-UserContextMenu--tempban"}.da-focused
          {
              color: #E04040!important;
              background: #E0404040!important;
          }				
		  #user-context-${config.info.name + "-Menu-UserContextMenu--sup1"}.da-focused
          {
			color: var(--background-floating)!important;
			background: #e0b840!important;
          }
          #user-context-${config.info.name + "-Menu-UserContextMenu--sup2"}.da-focused
          {
			color: var(--background-floating)!important;
			background: #e0b840!important;
          }

          #user-context-${config.info.name + "-Kary-UserContextMenu--setnote"}
          {
              color: #5c6fb1!important;
          }
          #user-context-${config.info.name + "-Kary-UserContextMenu--notes"}
          {
              color: #5c6fb1!important;
          }
          #user-context-${config.info.name + "-Kary-UserContextMenu--warn"}
          {
              color: #3ca374!important;
          }
          #user-context-${config.info.name + "-Kary-UserContextMenu--mute"}
          {
              color: #E0B840!important;
          }	
          #user-context-${config.info.name + "-Kary-UserContextMenu--hardmute"}
          {
              color: #E0B840!important;
          }		
          #user-context-${config.info.name + "-Kary-UserContextMenu--ban"}
          {
              color: #E04040!important;
          }		
          #user-context-${config.info.name + "-Kary-UserContextMenu--tempban"}
          {
              color: #E04040!important;
          }		
		  #user-context-${config.info.name + "-Menu-UserContextMenu--sup1"}
          {
              color: #e0b840!important;
          }
          #user-context-${config.info.name + "-Menu-UserContextMenu--sup2"}
          {
              color: #e0b840!important;
          }

          #user-context-${config.info.name + ""}
      `;
  
	// ------------------------------------------------------------------------------------------------------------
	// ------------------------------------ Variables -------------------------------------------------------------
	// ------------------------------------------------------------------------------------------------------------
  
	let GBDFDB = null;
	let main_timer = null;
	let main_queue = new queue();
  
	// ------------------------------------------------------------------------------------------------------------
	// ------------------------------------ Main Loop -------------------------------------------------------------
	// ------------------------------------------------------------------------------------------------------------
  
	let main_loop = function () {
	  let delay =
		config.time.tick_interval.min +
		Math.max(
		  0,
		  config.time.tick_interval.max - config.time.tick_interval.min
		) *
		  Math.random();
  
	  if (main_queue.length > 0) {
		let task = main_queue.shift();
		if (task.action == "send_message") {
		  actions.send_message(task.channel_id, task.message);
		  delay +=
			config.time.sending_message_timeout.min +
			Math.max(
			  0,
			  config.time.sending_message_timeout.max -
				config.time.sending_message_timeout.min
			) *
			  Math.random();
		} else if (task.action == "delete_message") {
		  actions.delete_message(task.channel_id, task.message_id);
		  delay +=
			config.time.deleting_message_timeout.min +
			Math.max(
			  0,
			  config.time.deleting_message_timeout.max -
				config.time.deleting_message_timeout.min
			) *
			  Math.random();
		} else if (task.action == "execute_command") {
		  actions.execute_command(task.command);
		  delay +=
			config.time.sending_command_timeout.min +
			Math.max(
			  0,
			  config.time.sending_command_timeout.max -
				config.time.sending_command_timeout.min
			) *
			  Math.random();
		} else if (task.action == "add_reaction") {
		  actions.add_reaction(task.channel_id, task.message_id, task.reaction);
		  delay +=
			config.time.adding_reaction_timeout.min +
			Math.max(
			  0,
			  config.time.adding_reaction_timeout.max -
				config.time.adding_reaction_timeout.min
			) *
			  Math.random();
		}
	  }
  
	  main_timer = setTimeout(main_loop, delay);
	};
  
	// ------------------------------------------------------------------------------------------------------------
	// ------------------------------------ Discord Actions -------------------------------------------------------
	// ------------------------------------------------------------------------------------------------------------
  
	let discord_actions = {};
	discord_actions.add_reaction = BdApi.findModuleByProps(
	  "addReaction"
	).addReaction;
	discord_actions.getUser = BdApi.findModuleByProps("getUser").getUser;
	discord_actions.getLastSelectedGuildId = BdApi.findModuleByProps(
	  "getLastSelectedGuildId"
	).getLastSelectedGuildId;
  
	// ------------------------------------------------------------------------------------------------------------
	// ------------------------------------ Actions ---------------------------------------------------------------
	// ------------------------------------------------------------------------------------------------------------
  
	let actions = {};
	actions.send_message = function (channel_id, message) {
	  log(`action.send_message('${channel_id}', '${message}');`);
	  ZLibrary.DiscordModules.MessageActions.sendMessage(channel_id, {
		content: message,
	  });
	};
  
	actions.delete_message = function (channel_id, message_id) {
	  log(`action.delete_message('${channel_id}', '${message_id}');`);
	  ZLibrary.DiscordModules.MessageActions.deleteMessage(
		channel_id,
		message_id
	  );
	};
  
	actions.execute_command = function (command) {
	  log(`action.execute_command('${command}');`);
	  actions.send_message(channels.konsola, command);
	};
  
	actions.add_reaction = function (channel_id, message_id, reaction) {
	  log(
		`action.add_reaction('${channel_id}', '${message_id}', {id: '${reaction.id}', name: '${reaction.name}'});`
	  );
	  discord_actions.add_reaction(channel_id, message_id, reaction);
	};
  
	// ------------------------------------------------------------------------------------------------------------
	// ------------------------------------ Tasks -----------------------------------------------------------------
	// ------------------------------------------------------------------------------------------------------------
  
	let tasks = {};
	tasks.queue = function (task) {
	  if (!task || !task.action) return;
  
	  main_queue.push(task);
	};
  
	tasks.send_message = function (channel_id, message) {
	  tasks.queue({
		action: "send_message",
		channel_id: channel_id,
		message: message,
	  });
	};
  
	tasks.delete_message = function (channel_id, message_id) {
	  tasks.queue({
		action: "delete_message",
		channel_id: channel_id,
		message_id: message_id,
	  });
	};
  
	tasks.execute_command = function (command) {
	  tasks.queue({ action: "execute_command", command: command });
	};
  
    tasks.warn = function (user_id, reason) {
		tasks.execute_command(`.warn <@${user_id}> ${reason}`);
	  };
	
	  tasks.clearwarn = function (user_id, reason) {
		tasks.execute_command(`.clearwarn <@${user_id}>`);
	  };
	
	  tasks.setnote = function (user_id, reason) {
		tasks.execute_command(`.setnote <@${user_id}> ${reason}`);
	  };
	
	  tasks.view_notes = function (user_id) {
		tasks.execute_command(`.notes <@${user_id}>`);
	  };
	
	  tasks.tempban = function (user_id, reason) {
		if (GBDFDB.UserUtils.can("BAN_MEMBERS"))
		  tasks.execute_command(`.tempban <@${user_id}> ${reason}`);
		else {
		  tasks.report_to_tempban(user_id, reason);
		  tasks.mute(user_id);
		}
	  };
	
	  tasks.report_to_tempban = function (user_id, reason) {
		tasks.send_message(
		  channels.zgłoszenia,
		  `Zgłoszenie do tymczasowego bana użytkownika: <@${user_id}> za: ${reason}`
		);
	  };
	
	  tasks.ban = function (user_id, reason) {
		if (GBDFDB.UserUtils.can("BAN_MEMBERS"))
		  tasks.execute_command(`.ban <@${user_id}> ${reason}`);
		else {
		  tasks.report_to_ban(user_id, reason);
		  tasks.mute(
			user_id,
			`Działanie prewencyjna przed banem. Sprawa została sierowana do administracji. Powód bana: ${reason}`
		  );
		}
	  };
	
	  tasks.report_to_ban = function (user_id, reason) {
		tasks.send_message(
		  channels.zgłoszenia,
		  `Zgłoszenie do bana użytkownika: <@${user_id}>, za: ${reason}`
		);
	  };
	
	  tasks.mute = function (user_id) {
		if (GBFDB.UserUtils.can("MUTE_MEMBERS"))
		  tasks.execute_command(`.mute <@${user_id}> ${reason}`);
	  };
	
	  tasks.hardmute = function (user_id, days, reason) {
		if (GBDFDB.UserUtils.can("MUTE_MEMBERS"))
		  tasks.execute_command(`.hardmute ${user_id} ${reason}`);
	  };
	
	  tasks.add_reaction = function (channel_id, message_id, reaction) {
		tasks.queue({
		  action: "add_reaction",
		  channel_id: channel_id,
		  message_id: message_id,
		  reaction: reaction,
		});
	  };
	
	
	// ------------------------------------------------------------------------------------------------------------
	// ------------------------------------ Functions -------------------------------------------------------------
	// ------------------------------------------------------------------------------------------------------------
  
	let has_emoji = function (reactions, emoji_name) {
	  if (reactions != Object(reactions)) return false;
  
	  for (let reaction of reactions) {
		if (
		  !"emoji" in reaction ||
		  reaction.emoji != Object(reaction.emoji) ||
		  !"name" in reaction.emoji ||
		  reaction.emoji.name != String(reaction.emoji.name)
		)
		  continue;
  
		if (reaction.emoji.name == emoji_name) return true;
	  }
  
	  return false;
	};
  
	// ------------------------------------------------------------------------------------------------------------
	// ------------------------------------ Utils -------------------------------------------------------------
	// ------------------------------------------------------------------------------------------------------------
  
	let log = function (...args) {
	  console.log("%c[MortyModerator]", "color: #40E040", ...args);
	};
  
	let action_popup__get_user_header = function (user_id, user_tag) {
	  let elements = [];
	  elements.push(
		GBDFDB.ReactUtils.createElement(GBDFDB.LibraryComponents.Flex, {
		  className: GBDFDB.disCN.marginbottom8,
		  children: [
			GBDFDB.ReactUtils.createElement(GBDFDB.LibraryComponents.Flex.Child, {
			  grow: 0,
			  shrink: 0,
			  basis: "25%",
			  children: GBDFDB.ReactUtils.createElement(
				GBDFDB.LibraryComponents.TextElement,
				{
				  children: "Nazwa użytkownika",
				  color:
					GBDFDB.LibraryComponents.TextElement.Colors.HEADER_SECONDARY,
				}
			  ),
			}),
			GBDFDB.ReactUtils.createElement(GBDFDB.LibraryComponents.Flex.Child, {
			  grow: 0,
			  shrink: 0,
			  basis: "75%",
			  children: GBDFDB.ReactUtils.createElement(
				GBDFDB.LibraryComponents.TextElement,
				{
				  children: user_tag,
				  color: GBDFDB.LibraryComponents.TextElement.Colors.STANDARD,
				}
			  ),
			}),
		  ],
		})
	  );
	  elements.push(
		GBDFDB.ReactUtils.createElement(GBDFDB.LibraryComponents.Flex, {
		  className: GBDFDB.disCN.marginbottom8,
		  children: [
			GBDFDB.ReactUtils.createElement(GBDFDB.LibraryComponents.Flex.Child, {
			  grow: 0,
			  shrink: 0,
			  basis: "25%",
			  children: GBDFDB.ReactUtils.createElement(
				GBDFDB.LibraryComponents.TextElement,
				{
				  children: "ID użytkownika",
				  color:
					GBDFDB.LibraryComponents.TextElement.Colors.HEADER_SECONDARY,
				}
			  ),
			}),
			GBDFDB.ReactUtils.createElement(GBDFDB.LibraryComponents.Flex.Child, {
			  grow: 0,
			  shrink: 0,
			  basis: "75%",
			  children: GBDFDB.ReactUtils.createElement(
				GBDFDB.LibraryComponents.TextElement,
				{
				  children: user_id,
				  color: GBDFDB.LibraryComponents.TextElement.Colors.STANDARD,
				}
			  ),
			}),
		  ],
		})
	  );
  
	  elements.push(
		GBDFDB.ReactUtils.createElement(
		  GBDFDB.LibraryComponents.FormComponents.FormDivider,
		  {
			className: GBDFDB.disCN.marginbottom8,
		  }
		)
	  );
  
	  return elements;
	};
  
	// ------------------------------------------------------------------------------------------------------------
	// ------------------------------------ Main Class ------------------------------------------------------------
	// ------------------------------------------------------------------------------------------------------------
  
	return (([Plugin, BDFDB]) => {
	  GBDFDB = BDFDB;
	  return class MortyModerator extends Plugin {
		unpatches = [];
  
		onLoad() {
		  this.patchedModules = {
			before: {
			  Message: "default",
			},
		  };
		}
  
		onStart() {
		  this.update();
		  log("onStart();");
  
		  main_timer = setTimeout(main_loop, config.time.starting_delay);
		  BdApi.injectCSS(config.info.name, css);
		}
  
		onStop() {
		  log("onStop();");
  
		  for (unpatch of this.unpatches) {
			unpatch();
		  }
  
		  this.unpatches = [];
		  main_queue = new queue();
		  clearTimeout(main_timer);
  
		  BdApi.clearCSS(config.info.name, css);
		}
  
		update() {
		  ZLibrary.PluginUpdater.checkForUpdate(
			config.info.name,
			config.info.version,
			config.info.updateUrl
		  );
		}
  
		onUserContextMenu(e) {
		  console.log(e);
		  if (e?.instance?.props?.guildId != guild_id) return;
  
		  if (!e?.instance?.props?.user?.id) return;
  
		  let menu = e.instance.props;
		  let user = menu.user;
  
		  let [children, index] = BDFDB.ContextMenuUtils.findItem(e.returnvalue, {
			id: "devmode-copy-id",
			group: true,
		  });
		  let contextMenuItems = [];
		  let menuEntries = [];
		  
		  menuEntries.push(
			BDFDB.ContextMenuUtils.createItem(
			  BDFDB.LibraryComponents.MenuItems.MenuItem,
			  {
				label: "Zaproś na Support #1",
				id: "sup1",
				action: (_) => {
					tasks.send_message(channels.support,`<@${user.id}> Zapraszam na「:parking:」support #1 w celu wyjaśnienia sprawy. Link do kanału: https://discord.gg/ScqwFCpKss`)
				},
			  }
			)
		  );

		  menuEntries.push(
			BDFDB.ContextMenuUtils.createItem(
			  BDFDB.LibraryComponents.MenuItems.MenuItem,
			  {
				label: "Zaproś na Support #2",
				id: "sup2",
				action: (_) => {
					tasks.send_message(channels.support,`<@${user.id}> Zapraszam na「:parking:」support #2 w celu wyjaśnienia sprawy. Link do kanału: https://discord.gg/82hUP7SEJm`)
				},
			  }
			)
		  );

		  contextMenuItems.push(
			BDFDB.ContextMenuUtils.createItem(
			  BDFDB.LibraryComponents.MenuItems.MenuItem,
			  {
				label: "Morty | Support",
				id: config.info.name + "-Menu-UserContextMenu",
				children: BDFDB.ContextMenuUtils.createItem(
				  BDFDB.LibraryComponents.MenuItems.MenuGroup,
				  {
					children: menuEntries,
				  }
				),
			  }
			)
		  );
  
		  if (!BDFDB.UserUtils.can("MANAGE_MESSAGES", user.id)) {
			contextMenuItems.push(
			  BDFDB.ContextMenuUtils.createItem(
				BDFDB.LibraryComponents.MenuItems.MenuItem,
				{
				  label: "Morty | Kary",
				  id: config.info.name + "-Kary-UserContextMenu",
				  children: BDFDB.ContextMenuUtils.createItem(
					BDFDB.LibraryComponents.MenuItems.MenuGroup,
					{
					  children: [
						BDFDB.ContextMenuUtils.createItem(
						  BDFDB.LibraryComponents.MenuItems.MenuItem,
						  {
							label: "Notatka",
							id: "setnote",
							action: (_) => {
							  BdApi.showConfirmationModal(
								`Notatka`,
								action_popup__get_user_header(
								  user.id,
								  user.tag
								).concat([
								  BDFDB.ReactUtils.createElement(
									BDFDB.LibraryComponents.TextInput,
									{
									  autoFocus: true,
									  errorMessage: "Musisz podać treść notatki.",
									  value: "",
									  placeholder: "Treść notatki",
									  size:
										BDFDB.LibraryComponents.TextInput.Sizes
										  .DEFAULT,
									  maxLength: 1024,
									  id: config.info.name + "-note-text",
									  success: false,
									  onChange: (value, instance) => {
										if (value.length) {
										  instance.props.errorMessage = null;
										  instance.props.success = true;
										} else {
										  instance.props.errorMessage =
											"Musisz podać treść notatki.";
										  instance.props.success = false;
										}
									  },
									}
								  ),
								]),
								{
								  danger: true,
								  confirmText: "Zanotuj",
								  cancelText: "Anuluj",
								  onConfirm: function () {
									let reason = document.getElementById(
									  config.info.name + "-note-text"
									).value;
									if (!reason) {
									  BdApi.showToast(
										"Notatka niezapisana: Brak treści.",
										{ type: "error" }
									  );
									  return;
									}
  
									tasks.setnote(user.id, reason);
								  },
								}
							  );
  
							  setTimeout(function () {
								document
								  .getElementById(config.info.name + "-note-text")
								  .focus();
							  }, 0);
							},
						  }
						),
						BDFDB.ContextMenuUtils.createItem(
							BDFDB.LibraryComponents.MenuItems.MenuItem,
							{
							  label: "Sprawdź notatki",
							  id: "notes",
							  action: (_) => {
								tasks.execute_command(`.notes <@${user.id}>`);
							  },
							}
						  ),  
						BDFDB.ContextMenuUtils.createItem(
						  BDFDB.LibraryComponents.FormComponents.FormDivider,
						  { id: "separator-between-note-and-mute" }
						),
						BDFDB.ContextMenuUtils.createItem(
						  BDFDB.LibraryComponents.MenuItems.MenuItem,
						  {
							label: "Ostrzeżenie",
							id: "warn",
							action: (_) => {
							  BdApi.showConfirmationModal(
								`Ostrzeżenie`,
								action_popup__get_user_header(
								  user.id,
								  user.tag
								).concat([
								  BDFDB.ReactUtils.createElement(
									BDFDB.LibraryComponents.TextInput,
									{
									  autoFocus: true,
									  errorMessage:
										"Musisz podać powód ostrzeżenia.",
									  value: "",
									  placeholder: "Powód ostrzeżenia",
									  size:
										BDFDB.LibraryComponents.TextInput.Sizes
										  .DEFAULT,
									  maxLength: 1024,
									  id: config.info.name + "-warn-reason",
									  success: false,
									  onChange: (value, instance) => {
										if (value.length) {
										  instance.props.errorMessage = null;
										  instance.props.success = true;
										} else {
										  instance.props.errorMessage =
											"Musisz podać powód ostrzeżenia (tekstowego).";
										  instance.props.success = false;
										}
									  },
									}
								  ),
								]),
								{
								  danger: true,
								  confirmText: "Warn",
								  cancelText: "Anuluj",
								  onConfirm: function () {
									let reason = document.getElementById(
									  config.info.name + "-warn-reason"
									).value;
									if (!reason) {
									  BdApi.showToast(
										"Warn nieudany: Brak powodu.",
										{ type: "error" }
									  );
									  return;
									}
  
									tasks.warn(user.id, reason);
								  },
								}
							  );
  
							  setTimeout(function () {
								document
								  .getElementById(
									config.info.name + "-warn-reason"
								  )
								  .focus();
							  }, 0);
							},
						  }
						),
						BDFDB.ContextMenuUtils.createItem(
						  BDFDB.LibraryComponents.MenuItems.MenuItem,
						  {
							label: "Mute",
							id: "mute",
							action: (_) => {
							  BdApi.showConfirmationModal(
								`Mute`,
								action_popup__get_user_header(
								  user.id,
								  user.tag
								).concat([
								  BDFDB.ReactUtils.createElement(
									BDFDB.LibraryComponents.TextInput,
									{
									  autoFocus: true,
									  errorMessage: "Musisz podać powód muta.",
									  value: "",
									  placeholder: "Powód muta",
									  size:
										BDFDB.LibraryComponents.TextInput.Sizes
										  .DEFAULT,
									  maxLength: 1024,
									  id: config.info.name + "-mute-2d-reason",
									  success: false,
									  onChange: (value, instance) => {
										if (value.length) {
										  instance.props.errorMessage = null;
										  instance.props.success = true;
										} else {
										  instance.props.errorMessage =
											"Musisz podać powód muta.";
										  instance.props.success = false;
										}
									  },
									}
								  ),
								]),
								{
								  danger: true,
								  confirmText: "Mute",
								  cancelText: "Anuluj",
								  onConfirm: function () {
									let reason = document.getElementById(
									  config.info.name + "-mute-2d-reason"
									).value;
									if (!reason) {
									  BdApi.showToast(
										"Mute nieudany: Brak powodu.",
										{ type: "error" }
									  );
									  return;
									}
									task.mute(user.id,reason)
								  },
								}
							  );
  
							  setTimeout(function () {
								document
								  .getElementById(
									config.info.name + "-mute-2d-reason"
								  )
								  .focus();
							  }, 0);
							},
						  }
						),
						BDFDB.ContextMenuUtils.createItem(
						  BDFDB.LibraryComponents.MenuItems.MenuItem,
						  {
							label: "Mute na 3 dni ",
							id: "hardmute",
							action: (_) => {
							  BdApi.showConfirmationModal(
								`Mute (tekstowy) — 4 dni`,
								action_popup__get_user_header(
								  user.id,
								  user.tag
								).concat([
								  BDFDB.ReactUtils.createElement(
									BDFDB.LibraryComponents.TextInput,
									{
									  autoFocus: true,
									  errorMessage: "Musisz podać powód muta.",
									  value: "",
									  placeholder: "Powód muta",
									  size:
										BDFDB.LibraryComponents.TextInput.Sizes
										  .DEFAULT,
									  maxLength: 1024,
									  id: config.info.name + "-mute-4d-reason",
									  success: false,
									  onChange: (value, instance) => {
										if (value.length) {
										  instance.props.errorMessage = null;
										  instance.props.success = true;
										} else {
										  instance.props.errorMessage =
											"Musisz podać powód muta.";
										  instance.props.success = false;
										}
									  },
									}
								  ),
								]),
								{
								  danger: true,
								  confirmText: "Mute",
								  cancelText: "Anuluj",
								  onConfirm: function () {
									let reason = document.getElementById(
									  config.info.name + "-mute-4d-reason"
									).value;
									if (!reason) {
									  BdApi.showToast(
										"Mute nieudany: Brak powodu.",
										{ type: "error" }
									  );
									  return;
									}
  
									tasks.hardmute(user.id,reason);
								  },
								}
							  );
  
							  setTimeout(function () {
								document
								  .getElementById(
									config.info.name + "-mute-4d-reason"
								  )
								  .focus();
							  }, 0);
							},
						  }
						),				
						BDFDB.ContextMenuUtils.createItem(
						  BDFDB.LibraryComponents.FormComponents.FormDivider,
						  { id: "separator-between-mute-and-ban" }
						),
						BDFDB.ContextMenuUtils.createItem(
						  BDFDB.LibraryComponents.MenuItems.MenuItem,
						  {
							label: "Tymczasowy ban",
							id: "tempban",
							action: (_) => {
							  BdApi.showConfirmationModal(
								`Tymczasowy ban na 7 dni`,
								action_popup__get_user_header(
								  user.id,
								  user.tag
								).concat([
								  BDFDB.ReactUtils.createElement(
									BDFDB.LibraryComponents.TextInput,
									{
									  autoFocus: true,
									  errorMessage: "Musisz podać powód bana.",
									  value: "",
									  placeholder: "Powód bana",
									  size:
										BDFDB.LibraryComponents.TextInput.Sizes
										  .DEFAULT,
									  maxLength: 1024,
									  id: config.info.name + "-tempban-2d-reason",
									  success: false,
									  onChange: (value, instance) => {
										if (value.length) {
										  instance.props.errorMessage = null;
										  instance.props.success = true;
										} else {
										  instance.props.errorMessage =
											"Musisz podać powód bana.";
										  instance.props.success = false;
										}
									  },
									}
								  ),
								]),
								{
								  danger: true,
								  confirmText: "Ban",
								  cancelText: "Anuluj",
								  onConfirm: function () {
									let reason = document.getElementById(
									  config.info.name + "-tempban-2d-reason"
									).value;
									if (!reason) {
									  BdApi.showToast(
										"Ban nieudany: Brak powodu.",
										{ type: "error" }
									  );
									  return;
									}
  
									tasks.tempban(user.id, reason);
								  },
								}
							  );
  
							  setTimeout(function () {
								document
								  .getElementById(
									config.info.name + "-tempban-2d-reason"
								  )
								  .focus();
							  }, 0);
							},
						  }
						),
						BDFDB.ContextMenuUtils.createItem(
						  BDFDB.LibraryComponents.MenuItems.MenuItem,
						  {
							label: "Ban",
							id: "ban",
							action: (_) => {
							  BdApi.showConfirmationModal(
								`Ban`,
								action_popup__get_user_header(
								  user.id,
								  user.tag
								).concat([
								  BDFDB.ReactUtils.createElement(
									BDFDB.LibraryComponents.TextInput,
									{
									  autoFocus: true,
									  errorMessage: "Musisz podać powód bana.",
									  value: "",
									  placeholder: "Powód bana",
									  size:
										BDFDB.LibraryComponents.TextInput.Sizes
										  .DEFAULT,
									  maxLength: 1024,
									  id: config.info.name + "-ban-reason",
									  success: false,
									  onChange: (value, instance) => {
										if (value.length) {
										  instance.props.errorMessage = null;
										  instance.props.success = true;
										} else {
										  instance.props.errorMessage =
											"Musisz podać powód bana.";
										  instance.props.success = false;
										}
									  },
									}
								  ),
								]),
								{
								  danger: true,
								  confirmText: "Ban",
								  cancelText: "Anuluj",
								  onConfirm: function () {
									let reason = document.getElementById(
									  config.info.name + "-ban-reason"
									).value;
									if (!reason) {
									  BdApi.showToast(
										"Ban nieudany: Brak powodu.",
										{ type: "error" }
									  );
									  return;
									}
  
									tasks.ban(user.id, reason);
								  },
								}
							  );
  
							  setTimeout(function () {
								document
								  .getElementById(
									config.info.name + "-ban-reason"
								  )
								  .focus();
							  }, 0);
							},
						  }
						),
					  ],
					}
				  ),
				}
			  )
			);
		  }
  
		  children.splice(
			index > -1 ? index : children.length,
			0,
			BDFDB.ContextMenuUtils.createItem(
			  BDFDB.LibraryComponents.MenuItems.MenuGroup,
			  { children: contextMenuItems }
			)
		  );
		}
	  };
	})(window.BDFDB_Global.PluginUtils.buildPlugin(config));
  })();
  