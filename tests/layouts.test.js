import test from 'node:test';
import assert from 'node:assert/strict';
import { getGuideLines, getLayout } from '../js/layouts.js';
import { getUpscaledDimensions } from '../js/upscaler.js';

test('triptych keeps the production master dimensions', () => {
  const layout = getLayout('triptych');
  assert.equal(layout.masterWidth, 3240);
  assert.equal(layout.masterHeight, 1440);
  assert.equal(layout.outputCount, 3);
});

test('nine grid creates 9 square 1080px slices', () => {
  const layout = getLayout('grid9');
  assert.equal(layout.slices.length, 9);
  assert.ok(layout.slices.every(slice => slice.width === 1080 && slice.height === 1080));
  assert.deepEqual(layout.slices.at(-1), { key: '2-2', label: '09_3-3', x: 2160, y: 2160, width: 1080, height: 1080 });
});

test('carousel creates three 4:5 panels', () => {
  const layout = getLayout('carousel3');
  assert.equal(layout.masterWidth, 3240);
  assert.equal(layout.masterHeight, 1350);
  assert.equal(layout.slices.length, 3);
  assert.ok(layout.slices.every(slice => slice.width === 1080 && slice.height === 1350));
});

test('guide lines follow rows and columns', () => {
  const guides = getGuideLines(getLayout('grid6'));
  assert.deepEqual(guides.vertical, [1080, 2160]);
  assert.deepEqual(guides.horizontal, [1080]);
});

test('upscale dimensions support exact 2x and 3x output', () => {
  assert.deepEqual(getUpscaledDimensions(1152, 1440, 2), { width: 2304, height: 2880 });
  assert.deepEqual(getUpscaledDimensions(1152, 1440, 3), { width: 3456, height: 4320 });
});
