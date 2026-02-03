import { createFileRoute } from "@tanstack/react-router";
import { ImageResponse } from "@vercel/og";

export const Route = createFileRoute("/api/og")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const title = url.searchParams.get("title") || "Better i18n";
          const author = url.searchParams.get("author") || "";
          const date = url.searchParams.get("date") || "";

          const imageResponse = new ImageResponse(
            {
              type: "div",
              props: {
                style: {
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#fafafa",
                  padding: "60px",
                  fontFamily: "Inter, sans-serif",
                },
                children: [
                  // Header with logo
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      },
                      children: [
                        {
                          type: "div",
                          props: {
                            style: {
                              width: "40px",
                              height: "40px",
                              backgroundColor: "#0a0a0a",
                              borderRadius: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            },
                            children: {
                              type: "span",
                              props: {
                                style: {
                                  color: "white",
                                  fontSize: "20px",
                                  fontWeight: 600,
                                },
                                children: "i",
                              },
                            },
                          },
                        },
                        {
                          type: "span",
                          props: {
                            style: {
                              fontSize: "24px",
                              fontWeight: 600,
                              color: "#0a0a0a",
                            },
                            children: "Better i18n",
                          },
                        },
                        {
                          type: "span",
                          props: {
                            style: {
                              fontSize: "24px",
                              color: "#737373",
                              marginLeft: "8px",
                            },
                            children: "Blog",
                          },
                        },
                      ],
                    },
                  },
                  // Title
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        flex: 1,
                        alignItems: "center",
                      },
                      children: {
                        type: "h1",
                        props: {
                          style: {
                            fontSize: title.length > 60 ? "48px" : "56px",
                            fontWeight: 600,
                            color: "#0a0a0a",
                            lineHeight: 1.2,
                            letterSpacing: "-0.02em",
                            maxWidth: "900px",
                          },
                          children: title,
                        },
                      },
                    },
                  },
                  // Footer with author and date
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      },
                      children: [
                        author
                          ? {
                              type: "span",
                              props: {
                                style: {
                                  fontSize: "20px",
                                  color: "#525252",
                                },
                                children: author,
                              },
                            }
                          : null,
                        date
                          ? {
                              type: "span",
                              props: {
                                style: {
                                  fontSize: "20px",
                                  color: "#a3a3a3",
                                },
                                children: date,
                              },
                            }
                          : null,
                      ].filter(Boolean),
                    },
                  },
                ],
              },
            },
            {
              width: 1200,
              height: 630,
            }
          );

          // Get the response and add caching headers
          const buffer = await imageResponse.arrayBuffer();

          return new Response(buffer, {
            headers: {
              "Content-Type": "image/png",
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          });
        } catch (error) {
          console.error("OG Image generation error:", error);
          return Response.redirect("https://better-i18n.com/og-image.png", 302);
        }
      },
    },
  },
});
