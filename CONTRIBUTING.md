# Contributing to @dargmuesli/nuxt-cookie-control

## Your Questions
Please consider asking questions in [Discussions](https://github.com/dargmuesli/nuxt-cookie-control/discussions) or help networks like [StackOverflow](https://stackoverflow.com/questions/tagged/spotify-web-api-java) using the label `@dargmuesli/nuxt-cookie-control`.
Posting your question there will result in quick and helpful answers.

Issues should only be used to file bug reports and ask questions that are targeted specifically at **this** project's source code.

## Information Quality
Every constructive contribution is highly appreciated.
They help to keep this project up-to-date and running, especially because currently only voluntary maintainers and contributors take care of this repository.

At the same time it is strongly recommended to follow certain guidelines when making contributions to open source projects like this one.
They ensure fast processing times and stable releases.

Before changing anything in the code base, make sure to look into [the project's README](https://github.com/dargmuesli/nuxt-cookie-control/blob/master/README.md) and its [CHANGELOG](https://github.com/dargmuesli/nuxt-cookie-control/blob/master/CHANGELOG.md).
This project's code follows simple and consistent code conventions, which should be easy to grasp.
If not: always try to build the project on your machine first to catch mistakes!
It saves your time to be in the clear about those conventions as it significantly lowers the probability to receive change requests from maintainers and thereby the time until merge.

Issues that do not provide enough information, that are unclear or not understandable will be closed until more qualitative information is provided.

## Contribution Completeness
A contribution has to be *complete* to get accepted.
If you cannot complete the requirements, you're welcome to ask for help.
But bear in mind that this can take some time.

A complete contribution implements a feature or a bug fix and keeps all [automated checks](https://github.com/dargmuesli/nuxt-cookie-control/actions) green! They should stay green as long as you can build the project on your machine.

## Contribution Flow
1. Create a fork from this repository
1. Create a branch in your fork in which you develop your contribution (one branch per feature/fix)
1. Make sure your contribution follows the contribution guidelines above
1. Create meaningful, well-separated and [well-named](https://commitlint.io/) commits
1. Create a pull request from your feature branch to the correct branch of this project

## Features

### Locales
To contribute new locales, please follow these instructions:

1. add a locale file like `src/runtime/locale/pl.ts`
2. import and export it in `src/runtime/locale/index.ts`
3. add it to the `Locale` type in `src/runtime/types.ts`
4. add it to the list of supported locales in the `README.md`

In general, please name all locales in accordance with the [ISO 639-1 standard](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes).
