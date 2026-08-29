const squareTile = 1080;

function gridSlices(columns, rows, tileWidth, tileHeight) {
  const slices = [];
  let index = 1;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const number = String(index).padStart(2, '0');
      slices.push(Object.freeze({
        key: `${row}-${column}`,
        label: `${number}_${row + 1}-${column + 1}`,
        x: column * tileWidth,
        y: row * tileHeight,
        width: tileWidth,
        height: tileHeight,
      }));
      index += 1;
    }
  }
  return Object.freeze(slices);
}

export const LAYOUTS = Object.freeze({
  triptych: Object.freeze({
    id: 'triptych', label: '三聯', short: '3', accent: '#6657ff',
    description: '經典 IG 三聯，保留原有 bleed 與 Business Suite 發布邏輯。',
    masterWidth: 3240, masterHeight: 1440, columns: 3, rows: 1,
    outputCount: 3, kind: 'triptych', publishHint: '發布：03 → 02 → 01',
  }),
  grid9: Object.freeze({
    id: 'grid9', label: '九宮格', short: '9', accent: '#00a7ff',
    description: '3 × 3 正方形拼圖，適合個人頁九宮格與品牌視覺。',
    masterWidth: 3240, masterHeight: 3240, columns: 3, rows: 3,
    outputCount: 9, kind: 'grid', publishHint: '個人頁拼圖：09 → 01 反向發布',
    slices: gridSlices(3, 3, squareTile, squareTile),
  }),
  grid4: Object.freeze({
    id: 'grid4', label: '四宮格', short: '4', accent: '#ff3d8d',
    description: '2 × 2 方格切片，適合簡潔的封面拼圖。',
    masterWidth: 2160, masterHeight: 2160, columns: 2, rows: 2,
    outputCount: 4, kind: 'grid', publishHint: '個人頁拼圖：04 → 01 反向發布',
    slices: gridSlices(2, 2, squareTile, squareTile),
  }),
  grid6: Object.freeze({
    id: 'grid6', label: '六宮格', short: '6', accent: '#00b86b',
    description: '3 × 2 橫向拼圖，適合產品、旅行與活動視覺。',
    masterWidth: 3240, masterHeight: 2160, columns: 3, rows: 2,
    outputCount: 6, kind: 'grid', publishHint: '個人頁拼圖：06 → 01 反向發布',
    slices: gridSlices(3, 2, squareTile, squareTile),
  }),
  carousel3: Object.freeze({
    id: 'carousel3', label: '輪播 3', short: '↔', accent: '#ff7a00',
    description: '3 張 4:5 無縫輪播，滑動時形成連續長圖。',
    masterWidth: 3240, masterHeight: 1350, columns: 3, rows: 1,
    outputCount: 3, kind: 'grid', publishHint: '輪播：01 → 02 → 03',
    slices: gridSlices(3, 1, 1080, 1350),
  }),
});

export const LAYOUT_ORDER = Object.freeze(['triptych', 'grid9', 'grid4', 'grid6', 'carousel3']);

export function getLayout(id) {
  const layout = LAYOUTS[id];
  if (!layout) throw new TypeError(`Unsupported layout: ${id}`);
  return layout;
}

export function getGuideLines(layout) {
  const vertical = [];
  const horizontal = [];
  for (let column = 1; column < layout.columns; column += 1) vertical.push((layout.masterWidth / layout.columns) * column);
  for (let row = 1; row < layout.rows; row += 1) horizontal.push((layout.masterHeight / layout.rows) * row);
  return { vertical, horizontal };
}
