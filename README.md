# HarbuLizer v0.4.0

Standalone: deploy index.html and logo.png to /Projects/HarbuLizer/.

Audio inputs: Demo, local file, microphone, tab/system audio (browser support and user consent required), Stop. Tab/system audio capture requires HTTPS and a browser that supports getDisplayMedia audio.

Website integration: include player-integration.js in the website and call `installHarbuLizer(document.querySelector('audio'), document.querySelector('.player-controls'))` after the player has been created. Replace `.player-controls` with the actual controls container. The player and visualizer must share an origin. The visualizer button opens a movable/resizable overlay; maximize enters fullscreen. Closing does not stop playback.

IMPORTANT: createMediaElementSource can only be called once per HTMLMediaElement. If your existing player already uses a Web Audio MediaElementAudioSourceNode, reuse its AudioContext/analyser instead of calling initAudio() again. Integrate into the actual player source before deployment; this package cannot verify the site's player implementation.

Created by .::H∆RBUGΛП::.
