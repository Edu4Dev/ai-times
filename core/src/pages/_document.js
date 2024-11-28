import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

import logos from "@/content/settings/logos.json";
import theme from "@/content/settings/theme.json";

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => <App {...props} />,
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
      };
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }

  render() {
    return (
      <Html lang="en-US">
        <Head>
          <link
            rel="icon prefetch"
            href={logos.faviconLogo || "/brandimages/favicon.png"}
            sizes="any"
          />
        </Head>
        <body
          className={`boilerplate-times theme-${theme.generalThemeSettings.themeStyle}`}
        >
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
