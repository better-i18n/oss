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
		const s = document.createElement("script");
		s.id = "better-support-widget";
		s.src = "https://api.helpway.ai/widget.js";
		s.setAttribute("data-key", "pk_live_ds0Y8RtYg20IlT_HufD5ud1j");
		s.async = true;
		document.body.appendChild(s);
	}, []);
	return null;
}
