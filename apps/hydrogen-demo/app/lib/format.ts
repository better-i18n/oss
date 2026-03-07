export function formatMoney(
  amount: string | number,
  currencyCode: string,
  locale: string,
): string {
  const numericAmount =
    typeof amount === "number" ? amount : Number.parseFloat(amount);

  if (!Number.isFinite(numericAmount)) {
    return `${currencyCode} ${amount}`;
  }

  try {
    return new Intl.NumberFormat(locale === "en" ? "en-US" : locale, {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(numericAmount);
  } catch {
    return `${currencyCode} ${numericAmount.toFixed(0)}`;
  }
}
