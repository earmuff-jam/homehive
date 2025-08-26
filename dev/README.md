## Developer setup and ease of guide.

RentWorks app is written in React and is used to build invoices on the fly. It is also used to setup rental reminders via email and
also provides support to "stripe payment services" via webhook and db connectivity supported by Firebase for ARPS system (Automatic Payment Reminder System)

### Installation

To run locally, simply run `npm ci` in project root. A `dev version` should boot up. Ensure you have `.env` file filled with
required variables. View file `env.sample` to view a sample of the `.env` file.

`Note`
This should be enough to run the application locally, however some of the functions might not be readily available to the
developer. This setup generally is for quick testing, unit testing etc. To enable other features, continue below.

### [FOMO] Extra Architecture and Software Overhaul

Need to test something specific during dev environment? Look below.

#### Test Netlify functions in dev environment

To run `netlify functions` which incorporate some of the core procedures we should also install `netlify cli` in the host OS. To install `netlify cli` simply run `npm install -g netlify-cli` and run `netlify dev`. If you have already installed the CLI tool, then simply run the later command.

#### Test Update Release Notes github action

To test the github action of "updating a release note" we should ensure the correct launch.json configuration from `.vscode/launch.json`. This file ensures node is able to debug this function with ease.

#### Firebase analytics information

The purpose of the firestore setup is to have some analytics to trace the user steps. This does not save the user information. However, it stores a general idea of where the user traveled during his / her visit which still is anonymous.\*\*\*\*

#### Stripe Payment Services Local CLI Setup

To install stripe locally, to test webhook listeners, you need to have the local cli installed for stripe. Use command `brew install stripe/stripe-cli/stripe` to achieve this. Follow guide listed within here `https://docs.stripe.com/stripe-cli#install` to complete the local CLI install. After a successful install, we should be able to easily forward the webhook to respond to any api calls / requests.

```
stripe login ## if you have not
stripe listen --forward-to localhost:4242/webhook
stripe trigger payment_intent.succeeded ## any event to trigger the listener to
```

After the above commands are run, the stripe function that listens to the trigger should be invoked. This is also a good test for webhook handlers.

`Note:`

To test webhook handler locally while running `dev` in UI, forward the webhook handler with the api key like below. Run `netlify dev` in new terminal. Run `debug mode` and `attach netlify functions` from `dev/lauch.json`. This allows you to run the UI, and assume the same workflow as a client. When stripe recieves the webhook handler request, it forwards the api call to localhost:9999 which is also our debug port. If all works out, you should hit your breakpoint.

```
stripe listen --api-key sk_test_xxx --forward-to http://localhost:9999/.netlify/functions/0011_fetch_stripe_webhook
```

#### Test webhook handler functions

1. Run command `node --inspect-brk /opt/homebrew/bin/netlify functions:serve` in terminal.
2. Update your local launch.json file to be like out `dev/launch.json`.
3. Set breakpoints in your function.
4. Run your stripe cli to forward api calls `stripe listen --forward-to http://localhost:9999/.netlify/functions/0011_fetch_stripe_webhook`
5. trigger event - `stripe trigger payment_intent.succeeded`
6. Breakpoint should hit.
7. For all webhook notifications, when you listen at step 4, you should get a secret key. Use that key for env variable `VITE_AUTH_STRIPE_WEBHOOK_SECRET` as we need it to properly execute a webhook event.

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
