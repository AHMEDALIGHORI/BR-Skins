// Landmark samples from the supplied 1920x1080 film, measured on 480x270 frames.
// Interpolation uses the decoded video timestamp, not the requested scroll target.
export const anatomyFrames = [
  [240,74,240,40,239,214,239,142,206,102,295,130],
  [240,74,240,40,239,215,239,142,207,103,295,130],
  [240,74,240,40,239,216,239,142,212,107,280,127],
  [239,71,239,38,239,214,239,142,231,106,247,131],
  [240,72,240,39,234,214,239,142,258,104,206,130],
  [239,73,240,40,242,214,239,142,274,105,185,132],
  [239,74,239,42,239,212,239,142,276,102,182,134],
  [240,76,240,43,240,210,239,142,276,106,183,134],
  [240,84,240,53,240,208,239,145,257,104,216,136],
];
export function anatomyAt(progress: number) {
  const p = Math.max(0, Math.min(1, progress)) * (anatomyFrames.length - 1);
  const a = Math.floor(p), b = Math.min(a + 1, anatomyFrames.length - 1), t = p - a;
  return anatomyFrames[a].map((v, i) => v + (anatomyFrames[b][i] - v) * t);
}
