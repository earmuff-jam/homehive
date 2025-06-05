## Developer setup and ease of guide.

Invoicer app is written in JS and is used to build invoices on the fly.

### Installation

To run locally, simply run `npm ci` in project root. A `dev version` should boot up. Ensure you have `.env` file filled with
required variables. View file `env.sample` to view a sample of the `.env` file.

`Note`
This should be enough to run the application locally, however some of the functions might not be readily available to the
developer. This setup generally is for quick testing, unit testing etc. To enable other features, continue below.

#### Netlify functions setup

To run `netlify functions` which incorporate some of the core procedures we should also install `netlify cli` in the host OS. To install `netlify cli` simply run `npm install -g netlify-cli` and run `netlify dev`. If you have already installed the CLI tool, then simply run the later command.

#### Firebase setup

The purpose of the firestore setup is to have some analytics to trace the user steps. This does not save the user information. However, it stores a general idea of where the user traveled during his / her visit which still is anonymous.\*\*\*\*

### Deployment and Git Tag

`Note`: Please ensure that we have the proper commit messages built. We need the commit
messages to be in the format of

```
[feature] - Added ability to add stamps to invoices by @mohit2530 in https://github.com/earmuff-jam/invoicer/pull/7

[bugfix] - 28: Add type to selected invoice by @mohit2530 in https://github.com/earmuff-jam/invoicer/pull/33

[improvement] - 53: Added support for FAQ section and Whats' New Section by @mohit2530 in https://github.com/earmuff-jam/invoicer/pull/54

```

We only support `feature`, `improvement`, or `bugfix` under the release notes section.
This rule should also be implemented over the github PR process as well.

Please follow the correct symantic tags for github. We tag the release, and we let github
do the versioning of the application. This keeps our effort uniform.

```
git tag <tagname> -a <!-- create new tag from here with description. -->
git push origin tags

```


### Steps to invoke the deployment approach

1. Navigate to the CI pipeline.

The main CI workflow - `https://github.com/earmuff-jam/invoicer/actions/workflows/main.yml`

The release note CI workflow - `https://github.com/earmuff-jam/invoicer/actions/workflows/prep-release-docs.yml`

3. Execute the Release docs workflow.

4. This should update the main branch with new release docs.

5. Verify release docs from `src/public` folder.

6. After this, run the git tag and execute release.

7. This is the format of the tag. `v<major>.<minor>.<patch>[-releaseCandidate]`

```
git checkout main
git pull
git tag | grep <last_tag>
git tag -a v1.3.0-rc1 -m "RC and/or version 1.3.0-rc1
git push origin v1.3.0-rc1

```


### Steps to invoke a patch release / update existing release

1. First thing first, make PR and merge that PR into main.

2. Once merged, we get new SHA Sum for the commit msg. This is not the same as the commit one. Be careful to get the right one.

3. You can also get it from main branch.

```
git fetch --all
git checkout main
git pull
git log
```

4. Create test branch and gear for deployment

Whereever we are targeting our fix to go in, we need to check that tag out. For eg, at this time of writing, we are trying to get
this patch into v1.3.0. We have a v1.3.0-rc1. Since we are targeting the release of v1.3.0 we should grep v1.3.0 tag.

```
git tag | grep v1.3

```
This lists all major | minor version of the application.


5. Checkout the latest release. Create a +1 branch from there.

```
git checkout v1.3.0-rc1

git checkout -b t1.3.0-rc2 <!-- creating new +1 tag -->

git push -u origin/t1.3.0-rc2
```

Generally, we do not push to the RC, we just create a new RC. So the above is a demonstration only. 


6. Create a hotfix branch from here.

```
git checkout -b hotfix-v1.3.0-rc2
git cherry-pick <commit hash - THIS IS THE SHA checksum hash>
git push -u origin hotfix-v1.3.0-rc2

```

7. Then create a PR. Your target is the tested branch above. NOT MASTER. Generally it should be like

BASE : main

COMPARE : <test_branch created above>

8. Wait until the PR is merged. Get approvals and proceed with deployment. Run the following cmd after that is done.

```
git checkout t1.3.0-rc2
git pull
git tag -a v1.3.0-rc2 -m "Hotfix Version v1.3.0-rc2"
git push origin v1.3.0-rc2

```

9. The pipeline should be built and everything should be good to go.