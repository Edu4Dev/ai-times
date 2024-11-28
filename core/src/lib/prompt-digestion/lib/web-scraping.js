const puppeteer = require("puppeteer");

const debugMe = require("../utils/debug-me");

// async function homePageScrapeLink(url, debug = false) {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   console.log("urlurlurlurl");
//   console.log(url);
//   console.log("debugdebugdebug");
//   console.log(debug);

//   debugMe(debug, `Scrape Home Page URL`, url);

//   await page.goto(url, { waitUntil: "domcontentloaded" });
//   let h2;
//   let h3;
//   // Pegar os links prioritários na página
//   const links = await page?.evaluate(() => {
//     const linkObjects = [];
//     console.log("oooooooooiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");

//     // Selecionar e priorizar os elementos "h2 a" e "a h2"
//     h2 = document.querySelectorAll("h2 a, a h2");
//     // debugMe(debug, "Scrape H2", h2 || "h2");

//     h2.forEach((element) => {
//       if (element.href && element.innerText.trim()) {
//         linkObjects.push({
//           href: element.href,
//           text: element.innerText.trim(),
//         });
//       }
//     });
//     h3 = document.querySelectorAll("h3 a, a h3");
//     // debugMe(debug, "Scrape H3", h3 || "h3");

//     // Se não houver links prioritários em h2, busca em "h3 a" e "a h3"
//     if (linkObjects.length === 0) {
//       h3.forEach((element) => {
//         if (element.href && element.innerText.trim()) {
//           linkObjects.push({
//             href: element.href,
//             text: element.innerText.trim(),
//           });
//         }
//       });
//     }
//     // debugMe(debug, "Scraped Links", linkObjects);

//     return linkObjects[0].href;
//   });

//   await browser.close();

//   // Função de priorização - aqui você pode ajustar conforme necessário
//   const scrapeLink = prioritizeLink(links);

//   return scrapeLink;
// }

/**
 * Scrapes the home page for important links.
 *
 * @param {string} url - The URL of the home page to scrape.
 * @param {boolean} debug - Flag to enable or disable debugging.
 * @returns {Promise<string>} - The prioritized link found on the page.
 */
async function homePageScrapeLink(url, debug = false) {
  let browser;
  try {
    browser = await puppeteer.launch(); // Set headless: false to see the browser
    const page = await browser.newPage();

    debugMe(debug, `Scrape Home Page URL`, url);

    console.log("Navigating to URL:", url);
    await page.goto(url, { waitUntil: "domcontentloaded" });

    console.log("Page loaded, evaluating links...");

    // Evaluate function to be executed in the browser context
    const links = await page.evaluate(() => {
      const linkObjects = [];
      console.log("Collecting links...");

      // Selecionar e priorizar os elementos "h2 a" e "a h2"
      const h2Elements = document.querySelectorAll("h2 a, a h2");
      h2Elements.forEach((element) => {
        if (element.href && element.innerText.trim()) {
          linkObjects.push({
            href: element.href,
            text: element.innerText.trim(),
          });
        }
      });

      // Se não houver links prioritários em h2, busca em "h3 a" e "a h3"
      if (linkObjects.length === 0) {
        const h3Elements = document.querySelectorAll("h3 a, a h3");
        h3Elements.forEach((element) => {
          if (element.href && element.innerText.trim()) {
            linkObjects.push({
              href: element.href,
              text: element.innerText.trim(),
            });
          }
        });
      }

      console.log("Links collected:", linkObjects);
      return linkObjects.length ? linkObjects : [];
    });

    await browser.close();

    // Função de priorização - ajustar conforme necessário
    const scrapeLink = prioritizeLink(links);
    return scrapeLink;
  } catch (error) {
    console.error("Error occurred while scraping the page:", error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
async function visitAndGetBodyContent(url, debug) {
  if (!url) return null;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  debugMe(debug, "Scraped Link ", url);

  await page.goto(url, { waitUntil: "networkidle0" });

  const content = await page.evaluate(() => {
    const elements = [];
    let capture = false;

    document.body
      .querySelectorAll("h1, h2, h3, h4, h5, h6, p, a, ul, li, ol")
      .forEach((el) => {
        // Função para remover imagens de dentro de elementos <p>
        el.innerHTML = el.innerHTML.replace(/<img[^>]*\/>/g, "");
        // Inicia a captura no primeiro <h1> sem <img>, ou no primeiro <h2> ou <h3>
        if (
          !capture &&
          ((el.tagName === "H1" && !el.querySelector("img")) ||
            el.tagName === "H2" ||
            el.tagName === "H3")
        ) {
          capture = true;
        }

        if (capture) {
          elements.push(el.innerText); // Adiciona o texto do elemento
        }

        // Para no último <p>
        if (capture && el.tagName === "P") {
          if (el === document.body.querySelector("p:last-of-type")) {
            capture = false;
          }
        }
      });

    return elements.join(" "); // Retorna o conteúdo como um texto contínuo
  });

  await browser.close();
  return content;
}

function prioritizeLink(links) {
  // Exemplo simples: retorna o primeiro link encontrado
  // Aqui você pode implementar uma lógica mais complexa de priorização
  if (links.length > 0) {
    return links[0].href;
  }
  return null;
}

async function webScraping(urls, autoPost, debug) {
  console.log("webScraping: urls");
  console.log(urls);
  console.log("webScraping autoPost");
  console.log(autoPost);

  if (!Array.isArray(urls) || urls.length === 0) {
    console.log("webScraping: Nenhuma URL fornecida.");
    return null;
  }

  let combinedContent = "";
  let combinedLinks = [];
  for (const url of urls) {
    try {
      debugMe(debug, "webScraping: Home to Scrape", url);
      const scrapeLink = autoPost
        ? await homePageScrapeLink(url?.linkUrl || url, debug)
        : url?.linkUrl || url;

      if (scrapeLink) {
        combinedLinks.push(scrapeLink);
      }
      if (scrapeLink && debug) {
        debugMe(debug, "webScraping: Web Scraping URL Found", scrapeLink);
      }
      console.log("scrapeLink");
      console.log(scrapeLink);

      const content = await visitAndGetBodyContent(scrapeLink, debug);
      console.log("webScraping: scrapeLink");
      console.log(content);

      if (content) {
        combinedContent += content + "\n";
        debugMe(debug, "webScraping: Web Scraping Content Added ", content);
      }

      if (scrapeLink && debug) {
        debugMe(debug, "webScraping: Web Scraping Full Content", content);
      }
    } catch (error) {
      console.error(`Erro ao processar a URL ${url}:`, error);
    }
  }

  if (combinedContent === "") {
    debugMe(debug, "webScraping: NO CONTENT", "");
    return null;
  }
  const scrapedContent = {
    content: combinedContent.trim(),
    scrapeLink: combinedLinks,
  };
  debugMe(debug, "webScraping: WEB SCRAPED CONTENT", scrapedContent);
  return scrapedContent;
}

module.exports = webScraping;
