"use client";

import { useEffect } from "react";

/**
 * Helpway support widget loader — always hits production.
 * Same config everywhere (dev + prod) so developers see the real support
 * widget while working locally.
 */
export function BetterSupportWidget() {
	useEffect(() => {
		if (document.getElementById("better-support-widget")) return;
		// Key is baked in at build time via Next.js — NEXT_PUBLIC_HELPWAY_KEY
		const key = process.env.NEXT_PUBLIC_HELPWAY_KEY;
		if (!key) return;
		const s = document.createElement("script");
		s.id = "better-support-widget";
		s.src = "https://api.helpway.ai/widget.js";
		s.setAttribute("data-key", key);
		s.async = true;
		document.body.appendChild(s);
	}, []);
	return null;
}
