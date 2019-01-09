import "./scss/index.scss";

import * as React from "react";
import { ApolloConsumer } from "react-apollo";
import { Link } from "react-router-dom";

import { Button } from "../../components";
import { checkoutLoginUrl } from "../../components/App/routes";
import { CartContext } from "../../components/CartProvider/context";
import { getCheckout_checkout } from "../../components/CheckoutApp/types/getCheckout";
import { EmptyCart } from "../../components/EmptyCart";
import { GoToCheckout } from "../../components/GoToCheckout";
import { OverlayContext, OverlayType } from "../../components/Overlay/context";
import { UserContext } from "../../components/User/context";
import { maybe } from "../../core/utils";
import ProductsTable from "./ProductsTable";

const Page: React.SFC<{ checkout: getCheckout_checkout }> = ({ checkout }) => {
  const { lines } = checkout;

  if (lines.length > 0) {
    return (
      <CartContext.Consumer>
        {({ remove, add, subtract, loading, changeQuantity, errors }) => (
          <OverlayContext.Consumer>
            {({ show }) => {
              const hasErrors = maybe(() => !!errors.length);
              if (hasErrors) {
                show(OverlayType.message, null, {
                  status: "error",
                  title: "NOPE"
                });
              }
              return (
                <>
                  <ProductsTable
                    addToCart={add}
                    changeQuantityInCart={changeQuantity}
                    checkout={checkout}
                    processing={loading}
                    removeFromCart={remove}
                    subtractToCart={subtract}
                  />
                  <div className="cart-page__checkout-action">
                    <UserContext.Consumer>
                      {({ user }) =>
                        user ? (
                          <ApolloConsumer>
                            {client => (
                              <GoToCheckout
                                disabled={loading}
                                apolloClient={client}
                              >
                                Proceed to Checkout{" "}
                              </GoToCheckout>
                            )}
                          </ApolloConsumer>
                        ) : (
                          <Link to={checkoutLoginUrl}>
                            <Button disabled={loading}>
                              Proceed to Checkout
                            </Button>
                          </Link>
                        )
                      }
                    </UserContext.Consumer>
                  </div>
                </>
              );
            }}
          </OverlayContext.Consumer>
        )}
      </CartContext.Consumer>
    );
  } else {
    return <EmptyCart />;
  }
};

export default Page;
