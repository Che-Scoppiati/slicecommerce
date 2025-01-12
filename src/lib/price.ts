import { Currency } from "@slicekit/core";

export const formatPrice = (price: string, currency: Currency) => {
  const priceInWei = parseInt(price, 10);
  if (isNaN(priceInWei)) {
    return `${currency.symbol} -`;
  }
  if (priceInWei === 0) {
    return `${currency.symbol} Free`;
  }
  if (!currency.decimals) {
    return `${currency.symbol}${priceInWei}`;
  }
  const priceInEth = priceInWei / Math.pow(10, currency.decimals);
  return `${priceInEth.toFixed(2)} ${currency.symbol}`;
};
