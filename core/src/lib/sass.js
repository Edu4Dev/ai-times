const theme = require("../../../content/cache/theme.json");
const sass = (
  brandColor,
  backgroundColor,
  headerHeight,
  logoAlign,
  pageHeaderPadding,
  pageBottomPadding,
  pageMaxW
) => {
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
  return `
// VARS
// Colors
$primary__colorOne: ${brandColor};
$cta__color: ${theme?.themeColors?.ctaColor};
$background_white: ${backgroundColor};
$mix_black_30: mix(black, $primary__colorOne, 30%);
$mix_black_60: mix(black, $primary__colorOne, 60%);
$mix_black_80: mix(black, $primary__colorOne, 80%);
$dark_bg__color: mix($background_white, black, 25%);

// PADDINGS and MARGINS
$header_height__size: ${headerHeight}px;



// LAYOUT WIDTH
$post__size: ${theme?.postsSettings?.postMaxW}px;

// THEME SETTINGS
.main-container-wrapper .main-container.main-page{
    margin-top: ${pageHeaderPadding}px;
    margin-bottom: ${pageBottomPadding}px;
    max-width: ${pageMaxW}px;
}

// HEADER
body header .main-header{
    height: ${headerHeight}px;
    max-width: ${pageMaxW}px;
    grid-template-columns: ${
      logoAlign === "center" ? "1fr" : "0.2fr 1fr 0.2fr !important"
    } !important;
}

// POSTS
body .single-post .main-post {
  grid-template-columns: ${postColumns()} !important;
}



`;
};

module.exports = sass;
