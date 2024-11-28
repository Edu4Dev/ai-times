const path = require("path");
const fs = require("fs-extra");
const version = require("../../../../content/cache/version.json");

const commonUpdateYML = `name: Common Update core/src from nextjs-source

on: workflow_call

jobs:
  update-core-src:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4.1.1
        with:
          token: \${{ inputs.pat_token }}

      - name: Remove old core/src files
        run: rm -rf core/src

      - name: Clone nextjs-source repository
        env:
          GITHUB_TOKEN: \${{ inputs.pat_token }}
        run: |
          git clone --depth 1 https://$GITHUB_TOKEN@github.com/${
            version.customNextSource && version.customNextSource !== ""
              ? version.customNextSource
              : "schindyguy/nextjs-source"
          }.git temp-source
          mkdir core/src
          cp -R temp-source/* core/src/
          rm -rf temp-source

      - name: Commit changes if there are any
        run: |
          npm install
          npm run build
          git config --global user.name '${version.gitUser}'
          git config --global user.email '${version.gitEmail}'
          git add core/src/
          git add content/public/*.xml content/cache/*.json .github/workflows/*.yml
          if git diff-index --quiet HEAD --; then
            echo "No changes to commit"
          else
            git commit -m "✔️ [Auto Commit]: Staging before rebase"
          fi

      - name: Pull with rebase
        run: git pull --rebase

      - name: Push changes
        env:
          GITHUB_TOKEN: \${{ inputs.pat_token }}
        run: |
          if git diff-index --quiet HEAD --; then
            echo "No changes to push"
          else
            git push https://$GITHUB_TOKEN@github.com/${version.gitUser}/${
  version.gitRepo
}.git HEAD:master
          fi
`;
const monthlyUpdateYML = `name: Update core/src from nextjs-source

on:
  schedule:
    - cron: "0 8 1-7 * 1" # Every first monday at 08am

jobs:
  call-common-update:
    uses: ./.github/workflows/common-update-core-src.yml
`;

const userUpdateYML = `name: Update core/src from nextjs-source

on:
  push:
    paths:
      - "content/cache/version.json"

jobs:
  check-and-update:
    runs-on: ubuntu-latest
    permissions:
      actions: write
      contents: read

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4.1.1
        with:
          token: \${{ secrets.PAT }}

      - name: Echo Repository Name
        run: |
          echo "\${{ github.event.repository.name }}"
          echo "\${{ github.actor }}"
          echo "\${{ github.action_repository }}"
          echo "\${{ github.event_name }}"
          echo "\${{ github.repository }}"
          echo "\${{ github.repository_owner }}"
          echo foi

      - name: Check version.json for update trigger
        id: check_update
        run: |
          UPDATE=$(jq -r '.update' content/cache/version.json)
          if [ "$UPDATE" != "true" ]; then
            echo "No update required. Exiting..."
            exit 0
          fi

      - name: Remove old core/src files
        if: \${{ steps.check_update.outcome == 'success' }}
        run: rm -rf core/src

      - name: Clone nextjs-source repository
        env:
          GITHUB_TOKEN: \${{ secrets.PAT }}
        run: |
          git clone --depth 1 https://$GITHUB_TOKEN@github.com/${
            version.customNextSource && version.customNextSource !== ""
              ? version.customNextSource
              : "schindyguy/nextjs-source"
          }.git temp-source
          mkdir core/src
          cp -R temp-source/* core/src/
          rm -rf temp-source
          
      - name: Reset update trigger
        if: \${{ steps.check_update.outcome == 'success' }}
        run: |
          npm install
          npm run build
          git config --global user.name '${version.gitUser}'
          git config --global user.email '${version.gitEmail}'
          jq '.update = false' content/cache/version.json > temp.json
          mv temp.json content/cache/version.json
          git add content/cache/version.json
          git add .github/workflows/*.yml
          git commit -m "Reset update trigger"
          git push https://$GITHUB_TOKEN@github.com/${version.gitUser}/${
  version.gitRepo
}.git
`;

async function writeCommomUpdate() {
  const commonFilePath = path.join(
    __dirname,
    "../../../../.github/workflows/common-update-core-src.yml"
  );

  // Verificar se o arquivo já existe
  if (fs.existsSync(commonFilePath)) {
    try {
      fs.unlinkSync(commonFilePath);
    } catch (error) {
      console.log(error);
      console.error(`Error deleting file ${file}`, error);
    }
  }

  try {
    return fs.writeFileSync(commonFilePath, commonUpdateYML);
  } catch (error) {
    console.log(error);
    console.log(`❌ [UPDATE SYSTEM]: Workflow ERROR.`);
    return process.exit(1);
  }
}

async function writeMonthlyUpdateYML() {
  const monthlyFilePath = path.join(
    __dirname,
    "../../../../.github/workflows/update-core-src-first-monday.yml"
  );
  if (version.automaticUpdates === false) {
    // Verificar se o arquivo já existe
    if (fs.existsSync(monthlyFilePath)) {
      try {
        fs.unlinkSync(monthlyFilePath);
      } catch (error) {
        console.log(error);
        console.error(`Error deleting file ${file}`, error);
      }
    }

    return console.log(`☮️ [🔄 - AUTO UPDATE] - No, tks.`);
  }

  const commonFilePath = path.join(
    __dirname,
    "../../../../.github/workflows/common-update-core-src.yml"
  );

  // Verificar se o arquivo já existe
  if (!fs.existsSync(commonFilePath)) {
    try {
      await writeCommomUpdate();
    } catch (error) {
      console.log(error);
      console.error(`Error creating file ${file}`, error);
    }
  }

  // Verificar se o arquivo já existe
  if (fs.existsSync(monthlyFilePath)) {
    try {
      fs.unlinkSync(monthlyFilePath);
    } catch (error) {
      console.log(error);
      console.error(`Error deleting file ${file}`, error);
    }
  }

  try {
    return fs.writeFileSync(monthlyFilePath, monthlyUpdateYML);
  } catch (error) {
    console.log(error);
    console.log(`❌ [MONTHLY UPDATE]: Monthly workflow ERROR.`);
    return process.exit(1);
  }
}

async function writeUserUpdateYML() {
  const userFilePath = path.join(
    __dirname,
    "../../../../.github/workflows/update-core-src-user-trigger.yml"
  );

  const commonFilePath = path.join(
    __dirname,
    "../../../../.github/workflows/common-update-core-src.yml"
  );

  // Verificar se o commom arquivo não já existe
  if (!fs.existsSync(commonFilePath)) {
    try {
      await writeCommomUpdate();
    } catch (error) {
      console.log(error);
      console.error(`Error creating file ${file}`, error);
    }
  }

  // Verificar se o arquivo já existe
  if (fs.existsSync(userFilePath)) {
    try {
      if (version.update === false) {
        return fs.unlinkSync(userFilePath);
      } else {
        fs.unlinkSync(userFilePath);
      }
    } catch (error) {
      console.log(error);
      console.error(`Error deleting file ${file}`, error);
    }
  }

  try {
    return fs.writeFileSync(userFilePath, userUpdateYML);
  } catch (error) {
    console.log(error);
    console.log(`❌ [USER UPDATE]: User workflow ERROR.`);
    return process.exit(1);
  }
}

module.exports = {
  writeCommomUpdate,
  writeMonthlyUpdateYML,
  writeUserUpdateYML,
};
