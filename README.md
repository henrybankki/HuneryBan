# Hunery AI Sijoitusbotti

Selainpohjainen prototyyppi kryptobottiin, jossa on oma kevyt sääntö-AI, paper trading -tila, live-tilan AsterDex-adapterin liityntäpiste sekä HTML-käyttöliittymä.

## Ominaisuudet

- Esiasetetut kryptovaihtoehdot: BTC, ETH, SOL, BNB, XRP ja DOGE USDT-pareina.
- Oma `MicroInvestmentAI`, joka pisteyttää synteettisen markkinadatan momentumin, trendin, volyymin ja volatiliteettiriskin perusteella.
- Automaattinen position avaus, kun AI antaa BUY-signaalin.
- Automaattinen sulkeminen stop loss-, take profit- tai SELL-signaalilla.
- Paper trading toimii kokonaan selaimessa ilman API-avaimia.
- Live AsterDex -tila tarkistaa API-asetukset ja toimii turvallisena integraatiopisteenä oikealle toimeksiantologikalle.

## Käynnistys

Avaa `index.html` selaimessa tai aja kevyt paikallinen palvelin:

```bash
python3 -m http.server 8080
```

ja avaa <http://localhost:8080>.

## Turvallisuus

Tämä on prototyyppi eikä sijoitusneuvontaa. Testaa paper trading -tilassa ennen oikeita toimeksiantoja. Älä tallenna API-avaimia versionhallintaan.
