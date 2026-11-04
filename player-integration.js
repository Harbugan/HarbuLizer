/* HarbuLizer v0.4.0 host integration. Add to the website after its player is initialized.
   Pass the existing HTMLAudioElement to installHarbuLizer; do not create a second player.
   Both pages must share the same origin. */
function installHarbuLizer(audio, mount = document.body) {
  if (!(audio instanceof HTMLMediaElement)) throw new Error('Expected website audio element');
  const button = document.createElement('button');
  button.type = 'button'; button.textContent = '◉ Visualizer';
  button.setAttribute('aria-label', 'Open HarbuLizer');
  const panel = document.createElement('div');
  panel.style.cssText = 'position:fixed;right:24px;bottom:90px;width:min(800px,calc(100vw - 24px));height:min(500px,75vh);z-index:99999;background:#090711;border:1px solid #65527c;border-radius:12px;overflow:hidden;box-shadow:0 24px 70px #0009;display:none;resize:both;min-width:300px;min-height:230px';
  const bar = document.createElement('div');
  bar.style.cssText = 'height:36px;background:#17121f;color:white;display:flex;align-items:center;justify-content:space-between;padding:0 12px;font:12px system-ui;cursor:move';
  const label = document.createElement('span'); label.textContent = 'HARBULIZER · v0.4.0';
  const actions = document.createElement('span');
  const max = document.createElement('button'); max.textContent = '⛶';max.title='Maximize';
  const close = document.createElement('button');close.textContent='×';close.title='Close';
  actions.append(max,close);bar.append(label,actions);
  const iframe=document.createElement('iframe');iframe.title='HarbuLizer';iframe.src='/Projects/HarbuLizer/index.html';iframe.allow='fullscreen; microphone; display-capture';iframe.style.cssText='border:0;width:100%;height:calc(100% - 36px)';
  panel.append(bar,iframe);mount.append(button,panel);
  let context,analyser,source,bytes,raf=0,drag=null;
  async function initAudio(){if(context)return;context=new (window.AudioContext||window.webkitAudioContext)();analyser=context.createAnalyser();analyser.fftSize=2048;source=context.createMediaElementSource(audio);source.connect(analyser);analyser.connect(context.destination);bytes=new Uint8Array(analyser.frequencyBinCount)}
  function band(lo,hi){const step=context.sampleRate/analyser.fftSize;let a=Math.max(1,Math.floor(lo/step)),b=Math.min(bytes.length,Math.ceil(hi/step)),sum=0;for(let i=a;i<b;i++)sum+=bytes[i]/255;return sum/Math.max(1,b-a)}
  function tick(){if(panel.style.display==='none'){raf=0;return}if(analyser&&iframe.contentWindow){analyser.getByteFrequencyData(bytes);const bands=[band(35,180),band(180,2500),band(2500,11000)];iframe.contentWindow.postMessage({type:'harbulizer:audio',bands:bands.map(x=>Math.min(1,x*2.4)),beat:Math.min(1,bands[0]*2)},location.origin)}raf=requestAnimationFrame(tick)}
  button.onclick=async()=>{panel.style.display='block';try{await initAudio();await context.resume()}catch(e){console.warn('HarbuLizer audio bridge:',e)}if(!raf)tick()};
  close.onclick=()=>{panel.style.display='none'};
  max.onclick=()=>{if(document.fullscreenElement===panel)document.exitFullscreen();else panel.requestFullscreen?.()};
  document.addEventListener('fullscreenchange',()=>{if(document.fullscreenElement===panel){panel.style.width='100%';panel.style.height='100%';panel.style.right='0';panel.style.bottom='0'}else{panel.style.width='min(800px,calc(100vw - 24px))';panel.style.height='min(500px,75vh)';panel.style.right='24px';panel.style.bottom='90px'}});
  bar.addEventListener('pointerdown',e=>{if(e.target!==bar&&e.target!==label)return;const r=panel.getBoundingClientRect();drag={x:e.clientX-r.left,y:e.clientY-r.top};bar.setPointerCapture(e.pointerId)});
  bar.addEventListener('pointermove',e=>{if(!drag)return;panel.style.left=Math.max(0,e.clientX-drag.x)+'px';panel.style.top=Math.max(0,e.clientY-drag.y)+'px';panel.style.right='auto';panel.style.bottom='auto'});
  bar.addEventListener('pointerup',()=>{drag=null});
  return {button,panel};
}
