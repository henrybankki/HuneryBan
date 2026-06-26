(function attachAsterDexPlugin(global) {
  const DEFAULT_FUTURES_BASE_URL = "https://fapi3.asterdex.com";
  const DEFAULT_TESTNET_BASE_URL = "https://testnet-fapi3.asterdex.com";
  const ASTER_EIP712_DOMAIN = {
    name: "AsterSignTransaction",
    version: "1",
    chainId: 1666,
    verifyingContract: "0x0000000000000000000000000000000000000000",
  };
  const ASTER_EIP712_TYPES = {
    Message: [{ name: "msg", type: "string" }],
  };

  class AsterDexPlugin {
    constructor(options = {}) {
      this.baseUrl = (options.baseUrl || DEFAULT_FUTURES_BASE_URL).replace(/\/$/, "");
      this.signer = options.signer || "";
      this.signatureProvider = options.signatureProvider || null;
    }

    static get defaults() {
      return { DEFAULT_FUTURES_BASE_URL, DEFAULT_TESTNET_BASE_URL, ASTER_EIP712_DOMAIN };
    }

    toAsterSymbol(symbol) {
      return symbol.replace("/", "").toUpperCase();
    }

    createNonce() {
      return String(Date.now() * 1000 + Math.floor(performance.now() % 1000));
    }

    encodeParams(params) {
      return new URLSearchParams(params).toString();
    }

    async request(path, { method = "GET", params = {}, signed = false } = {}) {
      const requestParams = { ...params };
      if (signed) {
        requestParams.nonce = requestParams.nonce || this.createNonce();
        requestParams.signer = requestParams.signer || this.signer;
        if (!requestParams.signer) throw new Error("AsterDex signer-osoite puuttuu.");
        const message = this.encodeParams(requestParams);
        requestParams.signature = await this.signMessage(message);
      }

      const query = this.encodeParams(requestParams);
      const url = `${this.baseUrl}${path}${method === "GET" && query ? `?${query}` : ""}`;
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: method === "GET" ? undefined : query,
      });
      if (!response.ok) throw new Error(`AsterDex ${method} ${path} epäonnistui (${response.status}).`);
      const text = await response.text();
      return text ? JSON.parse(text) : {};
    }

    async signMessage(message) {
      if (this.signatureProvider) return this.signatureProvider(message, ASTER_EIP712_DOMAIN, ASTER_EIP712_TYPES);
      if (!global.ethereum?.request) {
        throw new Error("Live-toimeksianto vaatii EIP-712 allekirjoittajan (esim. selainlompakko tai oma signatureProvider). ");
      }
      const [account] = await global.ethereum.request({ method: "eth_requestAccounts" });
      const typedData = {
        types: { EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
        ], ...ASTER_EIP712_TYPES },
        primaryType: "Message",
        domain: ASTER_EIP712_DOMAIN,
        message: { msg: message },
      };
      return global.ethereum.request({
        method: "eth_signTypedData_v4",
        params: [account, JSON.stringify(typedData)],
      });
    }

    ping() {
      return this.request("/fapi/v3/ping");
    }

    serverTime() {
      return this.request("/fapi/v3/time");
    }

    tickerPrice(symbol) {
      return this.request("/fapi/v3/ticker/price", { params: { symbol: this.toAsterSymbol(symbol) } });
    }

    async candle(symbol) {
      const ticker = await this.tickerPrice(symbol);
      return { symbol, price: Number(ticker.price), source: "asterdex" };
    }

    placeMarketOrder({ symbol, side, quantity, reduceOnly = false }) {
      return this.request("/fapi/v3/order", {
        method: "POST",
        signed: true,
        params: {
          symbol: this.toAsterSymbol(symbol),
          side,
          type: "MARKET",
          quantity: String(quantity),
          reduceOnly: String(reduceOnly),
        },
      });
    }
  }

  global.AsterDexPlugin = AsterDexPlugin;
})(window);
