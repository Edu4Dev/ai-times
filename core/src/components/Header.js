import React from "react";
import Link from "next/link";
import Image from "next/image";
import DarkModeContainer from "../containers/DarkModeContainer";
import mainMenu from "@/content/settings/mainMenu.json";
import general from "@/content/settings/general.json";
import theme from "@/content/settings/theme.json";
import logos from "@/content/settings/logos.json";
import postsData from "@/content/cache/allPostsData.json";
import slugify from "../lib/prompt-digestion/utils/slugify";
const Header = ({
  hasMenu,
  pathname,
  gtagCounter,
  logoW,
  logoH,
  wrapperRef,
  refState,
  menuActive,
  handleRefState,
  labelledby,
  navClasses,
  promoVisitState,
  campaignMode,
}) => {
  const cnMainMenu =
    theme?.header?.headerMainMenu !== "off" ? "main-menu-" : false;
  const cnMenuRight =
    theme?.header?.headerMainMenu === "right" ? "right" : false;
  const cnMenuBottom =
    theme?.header?.headerMainMenu === "bottom" ? "bottom" : false;
  const mainMenuClassName = `${cnMainMenu || ""}${cnMenuRight || cnMenuBottom}`;

  const { allPosts } = postsData;
  // Função para contar e ordenar as categorias
  const getCategoryPostCount = () => {
    const categoryCount = {};

    // Itera sobre todos os posts e conta quantas vezes cada categoria aparece
    allPosts.forEach((post) => {
      post.frontmatter.categories.forEach((category) => {
        if (categoryCount[category]) {
          categoryCount[category] += 1;
        } else {
          categoryCount[category] = 1;
        }
      });
    });

    // Transforma o objeto em um array de categorias com a contagem
    const categoryArray = Object.keys(categoryCount).map((category) => ({
      category,
      count: categoryCount[category],
    }));

    // Ordena o array pela contagem de posts em ordem decrescente
    categoryArray.sort((a, b) => b.count - a.count);

    return categoryArray;
  };

  // Usando a função
  const sortedCategories = getCategoryPostCount();

  const topFiveMenu = sortedCategories.slice(0, 5).map((sc) => sc.category);

  const categoryItems = topFiveMenu.map((cat) => {
    return { label: cat, href: slugify(cat) };
  });
  const mainMenuItems =
    theme?.header?.headerMainMenuType === "category"
      ? categoryItems
      : mainMenu?.mainMenu;

  return (
    <header>
      <div className={`main-header ${mainMenuClassName}`}>
        <div className={`header-logo`}>
          <Link
            href={"/"}
            className="logo-link desktop-only"
            onClick={() => gtagCounter(`${pathname}-logo-link`)}
            id={`${pathname}-logo-link`}
          >
            <Image
              src={logos?.mainLogo || "/brandimages/logo.png"}
              alt={"Business logo"}
              className={"main-logo"}
              width={logoW || 183}
              height={logoH || 50}
            />
          </Link>
          <Link
            href={"/"}
            className="logo-link mobile-only"
            onClick={() => gtagCounter("small-logo-link")}
            id={"small-logo-link"}
          >
            <Image
              src={logos?.mainLogo || "/brandimages/logo.png"}
              alt={"Business logo"}
              className={"main-logo"}
              width={logoW || 183}
              height={logoH || 50}
            />
          </Link>
        </div>
        {!campaignMode && theme?.header?.headerMainMenu !== "off" ? (
          <div className={"main-header-" + menuActive + " mobile-only"}>
            <div className="header-columns toggle-menu">
              <button
                type="button"
                id="check-toggle-icon"
                onClick={handleRefState}
                aria-haspopup="true"
                aria-controls="mainmenu"
                aria-expanded={refState}
                aria-label="Alternar visibilidade do menu"
                className={`menu-wrapper menu-bar-icon  ${
                  refState ? "active opened" : "not-active"
                }`}
              >
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <path
                    className="line line1"
                    d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058"
                  />
                  <path className="line line2" d="M 20,50 H 80" />
                  <path
                    className="line line3"
                    d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942"
                  />
                </svg>
              </button>
            </div>
          </div>
        ) : null}
        {!campaignMode && theme?.header?.headerMainMenu !== "off" ? (
          <nav
            className={`header-main-menu main-menu-${
              theme?.header?.headerMainMenu
            } ${navClasses + " " + mainMenuClassName}`}
            ref={wrapperRef}
            id="site-navigation"
            itemScope="itemScope"
            itemType="https://schema.org/SiteNavigationElement"
          >
            <ul role="menu" aria-labelledby={"check-toggle-icon"}>
              {mainMenuItems?.map((item, itemIndx) => (
                <li role="presentation" key={itemIndx} onClick={handleRefState}>
                  <Link
                    href={"/" + item.href}
                    role={"menuitem"}
                    itemProp="url"
                    title={item.label}
                    aria-label={`${item.label}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
      {general.darkModeSwitcher ? <DarkModeContainer /> : null}
    </header>
  );
};

export default Header;
