export interface IPriceConfig {
  _id: string;
  url: string;
  web: string;
  itemName: string;
  priceSelector: string;
  nameSelector: string;
  rawPrice: string;
  price: number;
  highestPrice: number;
  lowestPrice: number;
}
