const general = require("../../../../content/cache/general.json");
const version = require("../../../../content/cache/version.json");
const logos = require("../../../../content/cache/logos.json");

const userAdmin = () => `backend:
  name: git-gateway
  repo: ${version?.gitRepo}
  branch: master
  site_domain: ${general?.siteUrl}

media_folder: "core/public/posts"
public_folder: ""
media_library:
  name: cloudinary
  config:
    cloud_name: ${general?.cloudName}
    api_key: ${general?.cloudApiKey}

publish_mode: simple

logo_url: ${logos?.markLogo}

slug:
  encoding: "ascii"
  clean_accents: true

collections:
  - name: post
    label: Posts
    folder: content/posts
    label_singular: Post
    description: >
      Markdown posts.
    create: true
    slug: "{{slug}}"
    fields:
      - { label: "Title", name: "title", widget: "string", required: true }
      - {
          label: "Publish Date",
          name: "date",
          widget: "datetime",
          format: "YYYY-MM-DD HH:mm:ss",
          required: true,
        }
      - { label: "Author", name: "author", widget: "string", default: "Boilerplate Times" }
      - {
          label: "Categories",
          name: "categories",
          widget: "list",
          required: true,
        }
      - { label: "Tag", name: "tag", widget: "list" }
      - {
          label: "Featured Image",
          name: "image",
          widget: image,
          required: true,
        }
      - {
          label: "Featured Post",
          name: "featuredPost",
          widget: "boolean",
          default: false,
        }
      - {
          label: "Draft Mode",
          name: "draft",
          widget: "boolean",
          default: false,
        }
      - { label: "Body", name: "body", widget: "markdown", required: true }
      - { label: "Type", name: "layout", widget: "hidden", default: "post" }
  - name: pages
    label: Pages
    label_singular: "Page"
    folder: content/pages
    create: true
    # adding a nested object will show the collection folder structure
    slug: "{{slug}}"
    fields:
      - { label: "Title", name: "title", widget: "string", required: true }
      - { label: "Body", name: "body", widget: "markdown", required: true }
      - { label: "Type", name: "layout", widget: "hidden", default: "page" }
      - {
          label: "Publish Date",
          name: "date",
          widget: "datetime",
          format: "YYYY-MM-DD HH:mm:ss",
          required: true,
        }
      - { label: "Description", name: pageDescription, widget: "string" }
  - name: settings
    label: "Settings"
    delete: false # Prevent users from deleting documents in this collection
    editor:
      preview: false
    files:
      - name: "business"
        label: "Business Settings"
        file: "content/cache/business.json"
        description: "Business Settings"
        fields:
          - label: "Brand Name"
            name: brandName
            widget: string
            required: true
          - label: "Brand Description"
            name: brandDescription
            widget: string
            required: true
            default: Boilerplate Times description.
          - label: "Brand Phone"
            name: brandPhone
            widget: string
            required: false
            default: "+1"
            hint: "+1 XXXXXXXX"
          - label: "Brand Email"
            name: brandEmail
            widget: string
            required: true
          - label: "Brand Keywords"
            name: brandKeywords
            widget: "list"
            required: false
      - name: "general"
        label: "Site Settings"
        file: "content/cache/general.json"
        description: "General Site Settings"
        fields:
          - label: "Publish Date"
            name: publishedDate
            widget: datetime
            format: "YYYY-MM-DD HH:mm:ss"
            required: false
          - label: "Site Url"
            name: siteUrl
            widget: string
            hint: "https://example.com"
            required: true
          - label: "Scope (not working)"
            name: scope
            widget: string
            hint: "https://example.com/blog - The path 'blog' that defines the set of all URLs."
            required: false
          - label: "I18n"
            name: i18n
            widget: string
            hint: "en-US"
            required: false
          - label: "Ads Client ID"
            name: adsClientID
            widget: string
            hint: "ca-pub-"
            required: false
          - label: "AdSense Slot"
            name: adsSlot
            widget: string
            hint: "xxxxxxxxxx"
            required: false
          - label: "AdSense Account"
            name: adsAccount
            widget: string
            hint: "sites-xxxxxxxxxx"
            required: false
          - label: "Google Analytics ID"
            name: gaID
            widget: string
            hint: "G-"
            required: false
          - label: "Cloudinary - Cloud Name (id)"
            name: cloudName
            widget: string
            hint: "xxxxxxxxx"
            required: false
          - label: "Cloudinary - Api Key"
            name: cloudApiKey
            widget: string
            hint: "xxxxxxxxx"
            required: false
          - label: "Dark Mode Switcher"
            name: darkModeSwitcher
            widget: boolean
            required: false
          - label: "Footer Text"
            name: footerText
            widget: string
            default: "Disclaimer: The content provided on this site is intended for general information purposes only and should not be considered a replacement for professional financial and/or medical advice. All materials, including text, graphics, images, and information, are subject to change without prior notice. The information, materials, terms, conditions, and descriptions presented on these pages are subject to change without prior notice."
            required: false
          - label: "Standard Feedback Subject"
            name: feedbackSubject
            widget: string
            required: false
            default: "Message Request"
            hint: "Message Request"
          - label: "Feedback Email"
            name: feedbackEmail
            widget: string
            required: false
            hint: "your@email.com"
          - label: "Feedback Success Message"
            name: successMessage
            widget: string
            required: false
            hint: "Thank you for your message. We will reach you soon."
          - label: "Feedback Error Message"
            name: errorMessage
            widget: string
            required: false
            hint: "Hmm... something is wrong, try again later or e-mail us: general@boilerplate-timess.com"
      - name: "theme"
        label: "Theme Settings"
        file: "content/cache/theme.json"
        description: "General Site Settings"
        fields:
          - label: "General Settings"
            name: "generalThemeSettings"
            widget: "object"
            fields:
              - {
                  label: "Theme Style (NOT WORKING)",
                  name: "themeStyle",
                  widget: select,
                  options: ["0", "1"],
                  required: true,
                  hint: "Default: 0",
                }
              - {
                  label: "Footer Style (NOT WORKING)",
                  name: "footerStyle",
                  widget: select,
                  options: ["0", "1"],
                  required: true,
                  hint: "Default: 0",
                }
          - label: "Theme Colors"
            name: "themeColors"
            widget: "object"
            fields:
              - {
                  label: "Main Brand Color",
                  name: "brand_color",
                  widget: "string",
                  required: true,
                  hint: "#b82632 - Main color.",
                }
              - {
                  label: "CTA Color",
                  name: "ctaColor",
                  widget: "string",
                  required: false,
                  hint: "#ffca0a - Call to Action color.",
                }
              - {
                  label: "Background Color",
                  name: "background_color",
                  widget: "string",
                  required: true,
                  hint: "#00ffc1 - Background color.",
                }
              - {
                  label: "Dark Brand Color",
                  name: "darkBrandColor",
                  widget: "string",
                  required: false,
                }
              - {
                  label: "Dark Secondary Color",
                  name: "secondaryColor",
                  widget: "string",
                  required: false,
                }
              - {
                  label: "Dark Background Color",
                  name: "darkBackgroundColor",
                  widget: "string",
                  required: false,
                }
          - label: "Header"
            name: "header"
            widget: "object"
            fields:
              - {
                  label: "Header Main Menu",
                  name: "headerMainMenu",
                  widget: select,
                  options: ["off", "right", "bottom"],
                  required: true,
                  hint: "Default: true",
                }
              - {
                  label: "Bottom Main Menu",
                  name: "bottomMainMenu",
                  widget: "boolean",
                  required: false,
                  hint: "Default: false",
                }
              - {
                  label: "Header Height",
                  name: "headerHeight",
                  widget: number,
                  default: 60,
                  value_type: "int",
                  min: 50,
                  max: 90,
                  required: false,
                  hint: "Default: 60px",
                }
              - {
                  label: "Header Logo Align",
                  name: "logoAlign",
                  widget: select,
                  options: ["left", "center"],
                  required: false,
                  hint: "Default: Left",
                }
          - label: "Pages settings"
            name: "pagesSettings"
            widget: "object"
            fields:
              - {
                  label: "Page Max-Width",
                  name: "pageMaxW",
                  widget: select,
                  options: ["960", "1024", "1100", "1344"],
                  default: "1100",
                  required: false,
                  hint: "Default:  1100px",
                }
              - {
                  label: "Page Header Padding",
                  name: "pageHeaderPadding",
                  widget: number,
                  default: 20,
                  value_type: "int",
                  min: 0,
                  max: 120,
                  required: false,
                  hint: "Default: 20px.",
                }
              - {
                  label: "Page Bottom Padding",
                  name: "pageBottomPadding",
                  widget: number,
                  default: 30,
                  value_type: "int",
                  min: 0,
                  max: 120,
                  required: false,
                  hint: "Default: 30px.",
                }
          - label: "Posts settings"
            name: "postsSettings"
            widget: "object"
            fields:
              - {
                  label: "Post Style Variation (NOT WORKING)",
                  name: "postStyleVariation",
                  widget: select,
                  options: ["0", "1"],
                  required: true,
                  hint: "Default: 0",
                }
              - {
                  label: "Posts to Show",
                  name: "postsToShow",
                  widget: number,
                  default: 9,
                  value_type: "int",
                  min: 1,
                  max: 9,
                  required: true,
                  hint: "Index page and category pages.",
                }
              - {
                  label: "Post Max-Width",
                  name: "postMaxW",
                  widget: select,
                  options: ["520", "720", "960", "1024", "1100"],
                  default: "1100",
                  required: false,
                  hint: "Default:  1100px",
                }
              - {
                  label: "Left Column - Table of Content",
                  name: "leftColumn",
                  widget: boolean,
                  default: true,
                  required: false,
                  hint: "Default: true.",
                }
              - {
                  label: "Right Column - Related Posts",
                  name: "rightColumn",
                  widget: boolean,
                  default: true,
                  required: false,
                  hint: "Default: true.",
                }
              - {
                  label: "Bottom Row - Related Posts",
                  name: "bottomRow",
                  widget: boolean,
                  default: true,
                  required: false,
                  hint: "Default: true.",
                }
              - {
                  label: "Ads Inside Large Posts (not working)",
                  name: "adsInsidePost",
                  widget: boolean,
                  default: false,
                  required: false,
                }
      - name: "logos"
        label: "Logos Upload"
        file: "content/cache/logos.json"
        description: "Logos Upload"
        fields:
          - label: "Main Logo"
            name: mainLogo
            widget: image
            required: true
            hint: "logo.png"
          - label: "Main Logo - WxH"
            name: mainLogoWH
            widget: string
            required: false
            default: "183x50"
            hint: "183x50"
          - label: "Favicon"
            name: faviconLogo
            widget: image
            required: true
            default: Boilerplate Times description.
            hint: "16x16.png"
          - label: "Mark Logo"
            name: markLogo
            widget: image
            required: true
            hint: "Breadcrumb and footer logomark."
          - label: "Shareable Card"
            name: cardLogo
            widget: image
            required: true
            hint: "Social media share image."
          - label: "Post Author Image"
            name: postAuthorLogo
            widget: "image"
            hint: "Squared author profile image."
            required: true
      - name: "mainMenu"
        label: "Main Menu"
        file: "content/cache/mainMenu.json"
        description: "Main Menu Settings"
        fields:
          - label: "Main Menu"
            label_singular: Item
            name: mainMenu
            allow_add: true
            allow_delete: true
            allow_multiple: true
            max: 6
            min: 1
            widget: "list"
            fields:
              - { label: "Label", name: label, widget: "string" }
              - { label: "Href", name: href, widget: "string" }
      - name: "linkTree"
        label: "Link Tree"
        file: "content/cache/linkTree.json"
        description: "Link Tree Settings"
        fields:
          - label: "Link Tree"
            label_singular: Item
            name: linkTree
            allow_add: true
            allow_delete: true
            allow_multiple: true
            max: 6
            min: 1
            widget: "list"
            fields:
              - { label: "Label", name: label, widget: "string" }
              - { label: "Href", name: href, widget: "string" }
      - name: "custom"
        label: "Custom Settings"
        file: "content/cache/custom.json"
        description: "Business Settings"
        fields:
          - label: "RampJS - Segment"
            name: rampSegment
            widget: string
            required: false
          - label: "RampJS - Test Mode"
            name: rampTestMode
            widget: boolean
            required: false
            default: false
          - label: "RampJS - Search Subdomain"
            name: rampSubdomain
            widget: string
            required: false
      - name: "version"
        label: "Version"
        file: "content/cache/version.json"
        description: "Version update"
        fields:
          - label: "Check to Update"
            name: update
            widget: boolean
            required: true
            default: false
          - label: "GitHub Repository"
            name: gitRepo
            widget: string
            hint: "miltonbolonha/boilerplate-times - git-username/repo-slug"
            required: true
          - label: "GitHub Username"
            name: gitUser
            widget: string
            hint: "miltonbolonha/boilerplate-times - git-username/repo-slug"
            required: true
          - label: "GitHub E-mail"
            name: gitEmail
            widget: string
            required: true
          - label: "Automatic Updates (not working yet)"
            name: automaticUpdates
            widget: boolean
            required: true
            default: false
            hint: "Automatic update check every Monday."
          - label: "Version"
            name: version
            widget: hidden
            required: false
          - label: "Next Version"
            name: nextVersion
            widget: hidden
            required: false
          - label: "Update System Message."
            name: message
            widget: hidden
            required: false
            hint: "Check to update. New version available: ${version.nextVersion}."
          - label: "Custom NextJS Source"
            name: customNextSource
            widget: string
            hint: "Set to your own custom \`core/src\` repository."
            required: false
          - label: "Beta Tester (not working yet)"
            name: beta
            widget: boolean
            required: true
            default: false
            hint: "Receive updates for the next version: ${version.version}."
`;

module.exports = { userAdmin };
