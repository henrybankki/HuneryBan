# Hunery AI Sijoitusbotti

Selainpohjainen prototyyppi kryptobottiin, jossa on oma kevyt sääntö-AI, paper trading -tila, oikea AsterDex V3 -plugin sekä HTML-käyttöliittymä.

## Ominaisuudet

- Esiasetetut kryptovaihtoehdot: BTC, ETH, SOL, BNB, XRP ja DOGE USDT-pareina.
- Oma `MicroInvestmentAI`, joka pisteyttää markkinadatan momentumin, trendin, volyymin ja volatiliteettiriskin perusteella.
- Automaattinen position avaus, kun AI antaa BUY-signaalin.
- Automaattinen sulkeminen stop loss-, take profit- tai SELL-signaalilla.
- Paper trading toimii kokonaan selaimessa ilman API-avaimia.
- `asterdex-plugin.js` käyttää AsterDex Futures V3 -polkuja kuten `/fapi/v3/ping`, `/fapi/v3/time`, `/fapi/v3/ticker/price` ja `/fapi/v3/order`.
- Live-tilassa plugin muodostaa AsterDexin vaatiman EIP-712 `AsterSignTransaction` -allekirjoituksen selaimen `window.ethereum`-lompakolla tai omalla `signatureProvider`-funktiolla.

## Käynnistys

Avaa `index.html` selaimessa tai aja kevyt paikallinen palvelin:

```bash
python3 -m http.server 8080
```

ja avaa <http://localhost:8080>.

## AsterDex live -käyttö

1. Luo AsterDex API signer / API wallet AsterDexissä.
2. Syötä käyttöliittymään Futures V3 Base URL, oletuksena `https://fapi3.asterdex.com`.
3. Syötä signer-osoite `0x...` muodossa.
4. Käynnistä botti live-tilassa ja allekirjoita EIP-712-viestit lompakossa.

> Huomio: selainpohjainen live-treidaus on tarkoitettu vain kehitys- ja testikäyttöön. Tuotannossa allekirjoitus kannattaa tehdä omalla backendillä tai hardware-wallet-/vault-ratkaisulla, eikä salaisia avaimia pidä koskaan tallentaa tähän repositorioon.

## Turvallisuus

Tämä on prototyyppi eikä sijoitusneuvontaa. Testaa paper trading -tilassa ennen oikeita toimeksiantoja. Älä tallenna API-avaimia, signereiden private key -avaimia tai siemenlauseita versionhallintaan.
