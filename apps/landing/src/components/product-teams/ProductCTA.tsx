"use client";

import { useTranslations } from "@better-i18n/use-intl";
import { motion } from "framer-motion";
import { SpriteIcon } from "@/components/SpriteIcon";

export default function ProductCTA() {
  const t = useTranslations("product-teams");

  return (
    <section className="px-2 py-16 lg:py-24">
      <div className="w-full mx-auto max-w-[1400px]">
        <div className="px-6 lg:px-10">
          <motion.div
            className="bg-mist-950 rounded-3xl p-8 lg:p-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl/[1.2] font-semibold tracking-[-0.02em] text-white sm:text-3xl/[1.2] lg:text-4xl/[1.2]">
              {t("cta.title")}
            </h2>
            <p className="mt-4 text-base lg:text-lg text-mist-300 max-w-xl mx-auto">
              {t("cta.description")}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://dash.better-i18n.com"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-medium text-mist-950 hover:bg-mist-100 transition-colors"
              >
                {t("cta.primary")}
                <SpriteIcon name="arrow-right" className="size-4" />
              </a>
              <a
                href="mailto:sales@better-i18n.com"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "mailto:sales@better-i18n.com";
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-mist-700 px-8 py-3.5 text-sm font-medium text-white hover:bg-mist-900 transition-colors"
              >
                {t("cta.secondary")}
              </a>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 pt-8 border-t border-mist-800">
              <p className="text-xs text-mist-500 mb-4">{t("cta.trustedBy")}</p>
              <div className="flex items-center justify-center gap-6 sm:gap-8 flex-wrap">
                <a href="http://carna.ai/" target="_blank" rel="noopener noreferrer" className="flex h-8 items-center justify-center shrink-0">
                  <img
                    src="/carna.webp"
                    alt="Carna - Better i18n customer"
                    width={112}
                    height={28}
                    loading="lazy"
                    className="h-6 w-auto opacity-60 grayscale brightness-0 invert hover:opacity-80 transition-opacity"
                  />
                </a>
                <a href="https://hellonomad.app/" target="_blank" rel="noopener noreferrer" className="flex h-8 items-center justify-center shrink-0">
                  <img
                    src="/nomadwork.webp"
                    alt="Nomad Work - Better i18n customer"
                    width={112}
                    height={28}
                    loading="lazy"
                    className="h-6 w-auto opacity-60 grayscale brightness-0 invert hover:opacity-80 transition-opacity"
                  />
                </a>
                <a href="https://hellospace.world/" target="_blank" rel="noopener noreferrer" className="flex h-8 items-center justify-center shrink-0">
                  <img
                    src="/hellospace.webp"
                    alt="Hellospace - Better i18n customer"
                    width={112}
                    height={28}
                    loading="lazy"
                    className="h-6 w-auto opacity-60 grayscale brightness-0 invert hover:opacity-80 transition-opacity"
                  />
                </a>
                <a href="https://masraff.ai" target="_blank" rel="noopener noreferrer" className="flex h-8 items-center justify-center shrink-0">
                  <img
                    src="/masraff.webp"
                    alt="Masraff - Better i18n customer"
                    width={28}
                    height={28}
                    loading="lazy"
                    className="h-6 w-auto opacity-60 grayscale brightness-0 invert hover:opacity-80 transition-opacity"
                  />
                </a>
                <a href="https://www.cloudflare.com/" target="_blank" rel="noopener noreferrer" className="flex h-8 items-center justify-center shrink-0">
                  <img
                    src="/cloudflare.webp"
                    alt="Cloudflare - Better i18n customer"
                    width={112}
                    height={28}
                    loading="lazy"
                    className="h-6 w-auto opacity-60 grayscale brightness-0 invert hover:opacity-80 transition-opacity"
                  />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
