const DEFAULT_PREVIEW_SIZE = 100;

export class ShopManager {
  constructor(economy, prices, opts = {}) {
    this.economy = economy;
    this.prices  = prices;

    this.canPlaceAt  = opts.canPlaceAt;
    this.placeTurret = opts.placeTurret;
    this.mount       = opts.mount;
    this.previewSize = opts.previewSize ?? DEFAULT_PREVIEW_SIZE;

    this.container = Html.div();
    this.btnTurret = Html.button(this._btnText('turret'), () => this._startPlacementFlow());
    Html.append(this.container, [this.btnTurret]);

    const mounts = { upper:Html.upper, upperLeft:Html.upperLeft, upperRight:Html.upperRight,
                     lower:Html.lower, lowerLeft:Html.lowerLeft, lowerRight:Html.lowerRight };
    (mounts[this.mount] || Html.upperRight)([this.container]);

    this.unsubMoney = this.economy.events.on('change', () => this.update());
    this.update();
  }

  priceOf(item){ return this.prices[item] ?? Infinity; }
  canBuy(item){ return this.economy.canSpend(this.priceOf(item)); }
  buy(item){
    const ok = this.economy.trySpend(this.priceOf(item)); 
    if (ok) this.update();
    return ok;
  }

  _btnText(item){ return `${item} ($${this.priceOf(item)})`; }

  _startPlacementFlow(){
    if (!this.canBuy('turret')) { Audio?.click?.(); return; }
    Audio?.click?.();
    Mouse.onClick = (p) => {
      const ok = this.canPlaceAt?.(p);
      if (!ok) { Audio?.click?.(); Mouse.onClick = null; return; }
      if (this.buy('turret')) {
        this.placeTurret?.(p.copy());
        Audio?.click?.();
      } else {
        Audio?.click?.();
      }
      Mouse.onClick = null;
    };
  }

  update(){
    Html.changeText(this.btnTurret, this._btnText('turret'));
    this.canBuy('turret') ? Html.enable(this.btnTurret) : Html.disable(this.btnTurret);
  }

  drawPreview(draw){
    if (!Mouse.onClick) return;
    const rect = new Position(Mouse.position.x, Mouse.position.y, this.previewSize, this.previewSize);
    draw.rectangle(rect);
    const ok = this.canPlaceAt?.(Mouse.position);
    draw.color(rect, ok ? 'green' : 'red');
  }

  destroy(){
    this.unsubMoney?.();
    try { Html.remove?.(this.container); } catch {}
  }
}
