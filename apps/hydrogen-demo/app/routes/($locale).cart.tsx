import { useLoaderData } from "react-router";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@shopify/remix-oxygen";
import { CartForm, useOptimisticCart } from "@shopify/hydrogen";
import { data } from "react-router";
import { useTranslation } from "react-i18next";
import { LocaleLink } from "~/components/LocaleLink";
import { formatMoney } from "~/lib/format";
import { msg } from "@better-i18n/remix";

export const meta: MetaFunction<typeof loader> = ({ data: loaderData }) => {
  const title = msg(loaderData?.messages?.cart, "title", "Cart");
  return [{ title }];
};

export async function action({ request, context }: ActionFunctionArgs) {
  const { cart } = context;
  const formData = await request.formData();
  const { action: cartAction, inputs } = CartForm.getFormInput(formData);

  let result: Awaited<ReturnType<typeof cart.addLines>>;

  switch (cartAction) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    default:
      throw new Response("Invalid cart action", { status: 400 });
  }

  const headers = cart.setCartId(result.cart.id);
  return data(result, { headers });
}

export async function loader({ context }: LoaderFunctionArgs) {
  const cartData = await context.cart.get();
  return {
    cart: cartData,
    locale: context.locale,
    messages: context.messages,
  };
}

export default function CartPage() {
  const { cart: originalCart, locale } = useLoaderData<typeof loader>();
  const cart = useOptimisticCart(originalCart);
  const { t: tc } = useTranslation("cart");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Hydrogen cart line types are complex union types
  const lines: any[] = cart?.lines?.nodes ?? [];
  const totalAmount = cart?.cost?.subtotalAmount;

  if (lines.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <svg
          className="h-12 w-12 text-stone-200"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
          />
        </svg>
        <h1 className="mt-5 text-xl font-semibold tracking-tight text-stone-900">
          {tc("empty")}
        </h1>
        <p className="mt-2 max-w-sm text-[14px] leading-6 text-stone-400">
          {tc("empty_description")}
        </p>
        <LocaleLink to="/" locale={locale} className="btn-dark mt-8">
          {tc("continue_shopping")}
        </LocaleLink>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="border-b border-stone-200 bg-white">
        <div className="page-frame flex items-center gap-2 py-3 text-[12px] text-stone-400">
          <LocaleLink to="/" locale={locale} className="hover:text-stone-700">
            Home
          </LocaleLink>
          <span>/</span>
          <span className="text-stone-700">{tc("title")}</span>
        </div>
      </div>

      <div className="page-frame">
        <div className="grid grid-cols-1 divide-y divide-stone-200 border-x border-b border-stone-200 lg:grid-cols-[1fr_320px] lg:divide-x lg:divide-y-0">
          {/* Lines */}
          <div className="divide-y divide-stone-200">
            <div className="flex items-center justify-between px-6 py-4">
              <h1 className="text-[15px] font-semibold text-stone-900">
                {tc("title")}
              </h1>
              <span className="label">{lines.length} items</span>
            </div>

            {lines.map((line) => (
              <div key={line.id} className="flex gap-4 p-6">
                {line.merchandise.image ? (
                  <LocaleLink
                    to={`/products/${line.merchandise.product.handle}`}
                    locale={locale}
                    className="h-20 w-20 shrink-0 overflow-hidden bg-stone-100"
                  >
                    <img
                      src={line.merchandise.image.url}
                      alt={
                        line.merchandise.image.altText ||
                        line.merchandise.product.title
                      }
                      className="h-full w-full object-cover"
                    />
                  </LocaleLink>
                ) : null}

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <LocaleLink
                      to={`/products/${line.merchandise.product.handle}`}
                      locale={locale}
                      className="text-[14px] font-medium text-stone-900 hover:underline"
                    >
                      {line.merchandise.product.title}
                    </LocaleLink>
                    {line.merchandise.title !== "Default Title" && (
                      <p className="mt-0.5 text-[12px] text-stone-400">
                        {line.merchandise.title}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1">
                      <CartForm
                        route={locale === "en" ? "/cart" : `/${locale}/cart`}
                        action={CartForm.ACTIONS.LinesUpdate}
                        inputs={{
                          lines: [
                            {
                              id: line.id,
                              quantity: Math.max(1, line.quantity - 1),
                            },
                          ],
                        }}
                      >
                        <button
                          type="submit"
                          disabled={line.quantity <= 1}
                          className="flex h-7 w-7 items-center justify-center border border-stone-200 text-[13px] text-stone-600 transition-colors hover:bg-stone-50 disabled:opacity-30"
                        >
                          −
                        </button>
                      </CartForm>

                      <span className="w-8 text-center text-[13px] font-medium text-stone-900">
                        {line.quantity}
                      </span>

                      <CartForm
                        route={locale === "en" ? "/cart" : `/${locale}/cart`}
                        action={CartForm.ACTIONS.LinesUpdate}
                        inputs={{
                          lines: [{ id: line.id, quantity: line.quantity + 1 }],
                        }}
                      >
                        <button
                          type="submit"
                          className="flex h-7 w-7 items-center justify-center border border-stone-200 text-[13px] text-stone-600 transition-colors hover:bg-stone-50"
                        >
                          +
                        </button>
                      </CartForm>

                      <CartForm
                        route={locale === "en" ? "/cart" : `/${locale}/cart`}
                        action={CartForm.ACTIONS.LinesRemove}
                        inputs={{ lineIds: [line.id] }}
                      >
                        <button
                          type="submit"
                          className="ml-2 text-[11px] text-stone-400 transition-colors hover:text-rose-600"
                        >
                          {tc("remove")}
                        </button>
                      </CartForm>
                    </div>

                    <p className="text-[14px] font-semibold text-stone-900">
                      {formatMoney(
                        line.cost.totalAmount.amount,
                        line.cost.totalAmount.currencyCode,
                        locale,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="flex flex-col divide-y divide-stone-200 bg-stone-50">
            <div className="p-6">
              <p className="label mb-3">{tc("subtotal")}</p>
              {totalAmount ? (
                <p className="text-[2rem] font-semibold tracking-tight text-stone-900">
                  {formatMoney(
                    totalAmount.amount,
                    totalAmount.currencyCode,
                    locale,
                  )}
                </p>
              ) : null}
              <p className="mt-1 text-[12px] text-stone-400">
                Taxes and shipping at checkout
              </p>
            </div>

            <div className="p-6">
              {cart?.checkoutUrl ? (
                <a
                  href={cart.checkoutUrl}
                  className="btn-dark w-full justify-center"
                >
                  {tc("checkout")} →
                </a>
              ) : null}
              <LocaleLink
                to="/"
                locale={locale}
                className="mt-3 block text-center text-[12px] text-stone-400 hover:text-stone-700"
              >
                {tc("continue_shopping")}
              </LocaleLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
