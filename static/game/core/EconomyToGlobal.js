export function EconomyToGlobal(economy){
  Object.defineProperty(G, 'money', {
    get: () => economy.money,
    set: (v) => economy.setMoney(v),
    configurable: true,
  });

  economy.events.on('change', (m) => G.events.emit('money:change', m));
  
  G.economy = economy;
}