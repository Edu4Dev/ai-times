const theme = require("../../../../content/cache/theme.json");
const userVarSass = () => {
  return `// automatic generated file, don't change it manually
// VARS
// Colors
$primary__colorOne: ${theme?.themeColors?.brand_color};
$cta__color: ${theme?.themeColors?.ctaColor};
$background_white: ${theme?.themeColors?.background_color};
$mix_cta_white_50: mix(white, $cta__color, 50%);
$mix_cta_black_50: mix(black, $cta__color, 50%);
$mix_black_30: mix(black, $primary__colorOne, 30%);
$mix_black_60: mix(black, $primary__colorOne, 60%);
$mix_black_80: mix(black, $primary__colorOne, 80%);
$mix_black_02: mix(rgba(0, 0, 0, 0.2), $primary__colorOne, 35%);
$dark_bg__color: mix($background_white, black, 25%);

// Dark Colors
$dark_primary__color: ${theme?.themeColors?.darkBrandColor};
$dark_cta__color: ${theme?.themeColors?.secondaryColor};
$dark_background_white__color: ${theme?.themeColors?.darkBackgroundColor};

// PADDINGS and MARGINS
$header_height__size: ${theme?.header?.headerHeight}px;

// LAYOUT WIDTH
$post__size: ${theme?.postsSettings?.postMaxW}px;
$page__size: ${theme?.pagesSettings?.pageMaxW}px;
`;
};
const userSass = () => {
  function postColumns() {
    const noCompColumns =
      theme?.postsSettings?.leftColumn === false &&
      theme?.postsSettings?.rightColumn === false;
    if (noCompColumns) return `1fr`;
    const onlyRight =
      theme?.postsSettings?.leftColumn === false &&
      theme?.postsSettings?.rightColumn === true;
    if (onlyRight) return `1fr 0.2fr`;
    const onlyLeft =
      theme?.postsSettings?.leftColumn && !theme?.postsSettings?.rightColumn;
    if (onlyLeft) return `0.18fr 1fr`;
    return "0.18fr 1fr 0.2fr";
  }
  return `// automatic generated file, don't change it manually
// THEME SETTINGS
.main-container-wrapper .main-container.main-page{
    margin-top: ${theme?.pagesSettings?.pageHeaderPadding}px;
    margin-bottom: ${theme?.pagesSettings?.pageBottomPadding}px;
    max-width: $page__size;
}

// HEADER
body header .main-header{
    height: $header_height__size;
    max-width: $page__size;
    grid-template-columns: ${
      theme?.header?.logoAlign === "center"
        ? "1fr"
        : "0.2fr 1fr 0.2fr !important"
    } !important;
}

// POSTS
body .single-post .main-post {
  grid-template-columns: ${postColumns()} !important;
}
`;
};

module.exports = { userVarSass, userSass };
