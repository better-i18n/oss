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
      <div className="page-frame flex min-h-[60vh] flex-col items-center justify-center text-center">
        <svg
          className="h-16 w-16 text-slate-300"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-slate-950">
          {tc("empty")}
        </h1>
        <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">
          {tc("empty_description")}
        </p>
        <LocaleLink to="/" locale={locale} className="button-primary mt-8">
          {tc("continue_shopping")}
        </LocaleLink>
      </div>
    );
  }

  return (
    <div className="page-frame">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
        {tc("title")}
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.4fr]">
        <div className="space-y-4">
          {lines.map((line) => (
            <div
              key={line.id}
              className="glass-panel flex gap-4 p-4 sm:gap-6 sm:p-5"
            >
              {line.merchandise.image ? (
                <LocaleLink
                  to={`/products/${line.merchandise.product.handle}`}
                  locale={locale}
                  className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-28 sm:w-28"
                >
                  <img
                    src={line.merchandise.image.url}
                    alt={line.merchandise.image.altText || line.merchandise.product.title}
                    className="h-full w-full object-cover"
                  />
                </LocaleLink>
              ) : null}

              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <LocaleLink
                    to={`/products/${line.merchandise.product.handle}`}
                    locale={locale}
                    className="text-base font-semibold text-slate-950 hover:underline"
                  >
                    {line.merchandise.product.title}
                  </LocaleLink>
                  {line.merchandise.title !== "Default Title" && (
                    <p className="mt-1 text-sm text-slate-500">
                      {line.merchandise.title}
                    </p>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <CartForm
                      route={locale === "en" ? "/cart" : `/${locale}/cart`}
                      action={CartForm.ACTIONS.LinesUpdate}
                      inputs={{
                        lines: [{ id: line.id, quantity: Math.max(1, line.quantity - 1) }],
                      }}
                    >
                      <button
                        type="submit"
                        disabled={line.quantity <= 1}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-black/8 text-sm text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
                      >
                        -
                      </button>
                    </CartForm>

                    <span className="min-w-[2rem] text-center text-sm font-semibold text-slate-950">
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
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-black/8 text-sm text-slate-600 transition-colors hover:bg-slate-50"
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
                        className="ml-2 text-xs font-medium text-slate-400 transition-colors hover:text-rose-600"
                      >
                        {tc("remove")}
                      </button>
                    </CartForm>
                  </div>

                  <p className="text-base font-semibold text-slate-950">
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

        <div className="glass-panel h-fit p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            {tc("subtotal")}
          </h2>
          {totalAmount ? (
            <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              {formatMoney(totalAmount.amount, totalAmount.currencyCode, locale)}
            </p>
          ) : null}

          {cart?.checkoutUrl ? (
            <a
              href={cart.checkoutUrl}
              className="button-primary mt-6 w-full"
            >
              {tc("checkout")}
            </a>
          ) : null}

          <LocaleLink
            to="/"
            locale={locale}
            className="mt-3 block text-center text-sm text-slate-500 transition-colors hover:text-slate-950"
          >
            {tc("continue_shopping")}
          </LocaleLink>
        </div>
      </div>
    </div>
  );
}
