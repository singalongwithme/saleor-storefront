import { smallScreen } from "../../components/App/scss/variables.scss";

import classNames from "classnames";
import * as React from "react";
import Media from "react-media";
import { Link } from "react-router-dom";
import ReactSVG from "react-svg";

import { CachedThumbnail, DebouncedTextField } from "../../components";
import { getCheckout_checkout } from "../../components/CheckoutApp/types/getCheckout";
import { generateProductUrl } from "../../core/utils";

const cartRemoveSvg = require("../../images/cart-remove.svg");
const cartAddSvg = require("../../images/cart-add.svg");
const cartSubtractSvg = require("../../images/cart-subtract.svg");

const ProductsTable: React.SFC<{
  checkout: getCheckout_checkout;
  processing: boolean;
  addToCart(variantId: string): void;
  changeQuantityInCart(variantId: string, quantity: number): void;
  removeFromCart(variantId: string): void;
  subtractToCart(variantId: string): void;
}> = ({
  addToCart,
  changeQuantityInCart,
  checkout,
  processing,
  removeFromCart,
  subtractToCart
}) => {
  const { lines } = checkout;
  return (
    <Media query={{ minWidth: smallScreen }}>
      {isMediumScreen => (
        <table className="cart-page__table">
          <thead>
            <tr>
              <th>Products</th>
              {isMediumScreen && <th>Price</th>}
              <th className="cart-page__table__quantity-header">Quantity</th>
              <th colSpan={2}>{isMediumScreen ? "Total Price" : "Price"}</th>
            </tr>
          </thead>
          <tbody>
            {lines
              .sort((a, b) =>
                b.id.toLowerCase().localeCompare(a.id.toLowerCase())
              )
              .map(line => {
                const productUrl = generateProductUrl(
                  line.variant.product.id,
                  line.variant.product.name
                );
                return (
                  <tr
                    key={line.id}
                    className={classNames({
                      "cart-page__table-row--processing": processing
                    })}
                  >
                    <td className="cart-page__thumbnail">
                      {isMediumScreen && (
                        <Link to={productUrl}>
                          <CachedThumbnail source={line.variant.product} />
                        </Link>
                      )}
                      <Link to={productUrl}>
                        {line.variant.product.name}
                        {line.variant.name && ` (${line.variant.name})`}
                      </Link>
                    </td>
                    {isMediumScreen && <td>{line.variant.price.localized}</td>}
                    <td className="cart-page__table__quantity-cell">
                      {isMediumScreen ? (
                        <div>
                          <ReactSVG
                            path={cartAddSvg}
                            onClick={() => addToCart(line.variant.id)}
                          />
                          <p>{line.quantity}</p>
                          <ReactSVG
                            path={cartSubtractSvg}
                            onClick={() => subtractToCart(line.variant.id)}
                          />
                        </div>
                      ) : (
                        <DebouncedTextField
                          onChange={({ target: { value } }) =>
                            changeQuantityInCart(
                              line.variant.id,
                              parseInt(value, 10)
                            )
                          }
                          disabled={processing}
                          value={line.quantity}
                          type="number"
                        />
                      )}
                    </td>
                    <td>{line.totalPrice.gross.localized}</td>
                    <td>
                      <ReactSVG
                        path={cartRemoveSvg}
                        onClick={() => removeFromCart(line.variant.id)}
                      />
                    </td>
                  </tr>
                );
              })}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan={isMediumScreen ? 3 : 2}
                className="cart-page__table__subtotal"
              >
                Subtotal
              </td>
              <td colSpan={2}>{checkout.subtotalPrice.gross.localized}</td>
            </tr>
          </tfoot>
        </table>
      )}
    </Media>
  );
};

export default ProductsTable;
