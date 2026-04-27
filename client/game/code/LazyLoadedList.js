const listEl = document.getElementById('list');
const spacer = document.getElementById('spacer');
const content = document.getElementById('content');

const items = Array.from({ length: 100000 }, (_, i) => ({
  text: `Item ${i + 1}`,
  height: 20 + (i % 5) * 10
}));

const overscan = 5;

class Virtualizer {
  constructor({ el, items, estimateSize, overscan = 0, onChange }) {
    this.el = el;
    this.items = items;
    this.estimateSize = estimateSize;
    this.overscan = overscan;
    this.onChange = onChange;

    this.heights = new Array(items.length).fill(0);
    this.offsets = new Array(items.length).fill(0);

    this.recalculate();

    this.el.addEventListener('scroll', () => this.update());

    const ro = new ResizeObserver(() => this.update());
    ro.observe(this.el);
  }

  recalculate() {
    let sum = 0;
    for (let i = 0; i < this.items.length; i++) {
      const h = this.heights[i] || this.estimateSize(this.items[i], i);
      this.heights[i] = h;
      this.offsets[i] = sum;
      sum += h;
    }
    this.totalSize = sum;
  }

  update() {
    this.scrollTop = this.el.scrollTop;
    this.height = this.el.clientHeight;
    this.onChange();
  }

  findStart(scrollTop) {
    return this.offsets.findIndex(o => o >= scrollTop);
  }

  findEnd(bottom) {
    for (let i = 0; i < this.offsets.length; i++) {
      if (this.offsets[i] > bottom) return i;
    }
    return this.items.length - 1;
  }

  getVirtualItems() {
    const start = this.findStart(this.scrollTop);
    const end = this.findEnd(this.scrollTop + this.height);

    const s = Math.max(0, start - this.overscan);
    const e = Math.min(this.items.length, end + this.overscan);

    const out = [];
    for (let i = s; i < e; i++) {
      out.push({ index: i, start: this.offsets[i] });
    }
    return out;
  }

  getTotalSize() {
    return this.totalSize;
  }
}

function render() {
  const vItems = virtualizer.getVirtualItems();

  spacer.style.height = virtualizer.getTotalSize() + 'px';

  content.replaceChildren();

  const frag = document.createDocumentFragment();

  for (const v of vItems) {
    const row = document.createElement('div');
    row.className = 'row';

    row.style.transform = `translateY(${v.start}px)`;
    row.style.height = items[v.index].height + 'px';

    row.textContent = items[v.index].text;

    const meta = document.createElement('span');
    meta.className = 'meta';
    meta.textContent = `#${v.index + 1}`;

    row.appendChild(meta);
    frag.appendChild(row);
  }

  content.appendChild(frag);
}

const virtualizer = new Virtualizer({
  el: listEl,
  items,
  estimateSize: () => 30,
  overscan,
  onChange: render
});

virtualizer.update();
render();
