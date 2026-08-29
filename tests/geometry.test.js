import test from 'node:test';
import assert from 'node:assert/strict';
import { getImagePlacement, getMasterWidth, validateTriptychGeometry } from '../js/geometry.js';
test('master width includes two 36px bleed areas', () => { assert.equal(getMasterWidth(3240, 36), 3312); });
test('triptych geometry matches current production contract', () => { assert.equal(validateTriptychGeometry({ contentWidth: 3240, bleed: 36, panelWidth: 1080, outputWidth: 1152, starts: [0, 1080, 2160] }), true); });
test('edge mode contains a 4:5 portrait inside the master', () => { const r = getImagePlacement({ imageWidth: 1152, imageHeight: 1440, targetWidth: 3240, targetHeight: 1440, mode: 'edge' }); assert.equal(r.drawHeight, 1440); assert.equal(r.drawWidth, 1152); assert.equal(r.drawX, 1044); assert.equal(r.drawY, 0); });
test('cover mode fills the complete master', () => { const r = getImagePlacement({ imageWidth: 1152, imageHeight: 1440, targetWidth: 3240, targetHeight: 1440, mode: 'cover' }); assert.equal(r.drawWidth, 3240); assert.equal(r.drawHeight, 4050); assert.equal(r.drawX, 0); assert.equal(r.drawY, -1305); });
test('pan range reproduces the original editor behavior', () => { const l = getImagePlacement({ imageWidth: 1152, imageHeight: 1440, targetWidth: 3240, targetHeight: 1440, mode: 'edge', panX: -100 }); const r = getImagePlacement({ imageWidth: 1152, imageHeight: 1440, targetWidth: 3240, targetHeight: 1440, mode: 'edge', panX: 100 }); assert.equal(l.drawX, 0); assert.equal(r.drawX, 2088); });
