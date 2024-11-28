const version = require("../../../../../content/settings/version");

const schedulePost = (cronSchedule, version) => `
name: Commit Cron Job To Trigger Netlify Build

on:
  schedule:
    - cron: '${cronSchedule}'
  workflow_dispatch:

permissions: write-all

jobs:
  build_and_commit:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4.1.1
        with:
          # Fine-grained PAT with contents:write and workflows:write
          # scopes
          token: \${{ secrets.PAT }}

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm install

      - name: Sync project n Create JSON/XML files
        run: npm run sync && npm run build

      - name: Commit and push changes
        env:
          GITHUB_TOKEN: \${{ secrets.PAT }}
        run: |
          git config --global user.name '${version.gitUser}'
          git config --global user.email '${version.gitEmail}'
          git pull
          git add content/public/*.xml .github/workflows/*.yml
          git status
          git commit -m '✔️ [Cron Job]: Post generated files commited.'
          git push https://$GITHUB_TOKEN@github.com/${version.gitUser}/${version.gitRepo}.git HEAD:master
`;

const gptSchedule = (
  cronSchedule
) => `name: "[🤰 DIGEST IT]: Automatic Prompt to Post - This baby is yours!"

on:
  workflow_dispatch:
  schedule:
    - cron: '${cronSchedule}'

jobs:
  convert:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4.1.1
        with:
          token: \${{ secrets.PAT }}

      - name: "Create env file"
        run: |
          touch core/.env
          echo CHATGPT_API_KEY=\${{ secrets.CHATGPT_API_KEY }} >> core/.env
          echo CLOUDINARY_API_SECRET=\${{ secrets.CLOUDINARY_API_SECRET }} >> core/.env
          cat core/.env

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm install

      - name: "[🤰 DIGEST IT]: autoPost() - This baby is yours!"
        run: npm run autogpt

      - name: Commit and push changes
        run: |
          git config --global user.name '${version.gitUser}'
          git config --global user.email '${version.gitEmail}'
          git pull
          git add core content .github
          git status
          if git diff-index --quiet HEAD --; then
              echo "No changes to commit"
              git clean -f
              exit 0
          else
              git commit -m "✔️ [🤰 DIGEST IT]: cron('autogpt:${cronSchedule}')"
          fi

      - name: Push changes
        env:
          GITHUB_TOKEN: \${{ secrets.PAT }}
        run: |
          git push https://$GITHUB_TOKEN@github.com/${version.gitUser}/${version.gitRepo}.git HEAD:master
`;

const cron = (cronSchedule, type) => {
  switch (type) {
    case "gptSchedule":
      return gptSchedule(cronSchedule);
    default:
      return schedulePost(cronSchedule, type);
  }
};

module.exports = cron;
