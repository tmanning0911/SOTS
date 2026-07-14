import { formatCents } from "../../../js/shop.js";

const MAX_QTY = 4;

export function TicketSouvenirAddon({
  products = [],
  quantities = {},
  options = {},
  onQuantityChange,
  onOptionChange,
}) {
  if (!products.length) return null;

  return (
    <div className="sots-co__souvenirs">
      <p className="sots-checkout__donation-note">
        Pick up at the merchandise table or box office on show day — included in this payment.
      </p>
      <ul className="sots-co__souvenir-list">
        {products.map((product) => {
          const qty = quantities[product.id] ?? 0;
          const hasOptions = Boolean(product.options?.length);
          const optionValue = options[product.id] ?? product.options?.[0]?.values?.[0] ?? "";

          return (
            <li key={product.id} className="sots-co__souvenir-row">
              <div className="sots-co__souvenir-copy">
                <strong>{product.name}</strong>
                <span>{product.price?.display ?? formatCents(product.price?.value)}</span>
                {hasOptions ? (
                  <label className="sots-co__souvenir-option">
                    {product.options[0].name}
                    <select
                      value={optionValue}
                      onChange={(e) => onOptionChange(product.id, e.target.value)}
                      disabled={qty === 0}
                    >
                      {product.options[0].values.map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}
              </div>
              <div className="sots-co__qty" role="group" aria-label={`${product.name} quantity`}>
                <button
                  type="button"
                  className="sots-co__qty-btn"
                  onClick={() => onQuantityChange(product.id, Math.max(0, qty - 1))}
                  disabled={qty <= 0}
                  aria-label={`Decrease ${product.name}`}
                >
                  −
                </button>
                <span className="sots-co__qty-value">{qty}</span>
                <button
                  type="button"
                  className="sots-co__qty-btn"
                  onClick={() => onQuantityChange(product.id, Math.min(MAX_QTY, qty + 1))}
                  disabled={qty >= MAX_QTY}
                  aria-label={`Increase ${product.name}`}
                >
                  +
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function shopItemsFromSelections(products, quantities, options) {
  return products
    .map((product) => {
      const quantity = quantities[product.id] ?? 0;
      if (quantity < 1) return null;
      const hasOptions = Boolean(product.options?.length);
      return {
        productId: product.id,
        quantity,
        option: hasOptions ? options[product.id] ?? product.options[0].values[0] : undefined,
      };
    })
    .filter(Boolean);
}

export function shopLinesForSummary(products, quantities, options) {
  return shopItemsFromSelections(products, quantities, options).map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      key: item.option ? `${item.productId}:${item.option}` : item.productId,
      label: item.option ? `${product?.name} (${item.option})` : product?.name,
      quantity: item.quantity,
      cents: (product?.price?.value ?? 0) * item.quantity,
    };
  });
}
