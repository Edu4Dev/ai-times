const cron = (cronSchedule) => `
name: Trigger Netlify Build

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
          GITHUB_TOKEN: \${{ github.token }}
          GH_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        run: |
          git config --global user.name 'Milton Bolonha'
          git config --global user.email 'miltonbolonha@gmail.com'
          git pull
          git add content/public/*.xml .github/workflows/*.yml
          git status
          git commit -m '✔️ [Cron Job]: Post generated files commited.'
          git push https://miltonbolonha:\${{ secrets.GITHUB_TOKEN }}@github.com/schindyguy/wx.git HEAD:master

`;

module.exports = cron;
