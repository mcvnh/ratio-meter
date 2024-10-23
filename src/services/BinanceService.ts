interface BinancePrice {
  symbol: string;
  price: string;
}

export default class BinanceService {

  /**
   *
   * @param symbol string, e.g: FLMUSDT
   */
  static async getPrice(symbol: string) : Promise<number> {
    try {
      const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
      const data = (await response.json()) as BinancePrice;
      return parseFloat(data['price']);
    }
    catch (error) {
      console.error(error);
    }

    return 0;
  }
}