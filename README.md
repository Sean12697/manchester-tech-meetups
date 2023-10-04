# CompiledMCR Events (Manchester Tech Meetups)

This is an aggregator for groups / events across a variety of services, which is then outputted on a website, in a JSON format, and a iCal file (which can be added/shown in a calendar).

OLD VERSION: [https://github.com/Sean12697/MeetupManchesterTech](https://github.com/Sean12697/MeetupManchesterTech)

## Table of Contents

- [CompiledMCR Events (Manchester Tech Meetups)](#compiledmcr-events-manchester-tech-meetups)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
    - [Prerequisites/required software](#prerequisites/required-software)
      - [Nodejs](#nodejs)
        - [install NodeJS by download](#install-nodejs-by-download)
        - [install NodeJS by package manager](#install-nodejs-by-package-manager)
      - [Npm](#npm)
      - [Project dependencies](#project-dependencies)
  - [Configuration](#configuration)
    - [Sources](#sources)
      - [Meetup](#meetup)
      - [EventBrite](#eventbrite)
      - [Google Calendar](#google-calendar)
    - [Github Action](#github-action)
      - [If Statement](#if-statement)
      - [Build Hook](#build-hook)
  - [Usage](#usage)
  - [Deploying](#deploying)
  - [Contributing](#contributing)

## Installation

### Prerequisites/required software

To install the rest of the software you need (dependencies), you will need to have NodeJS and npm installed:

####NodeJS

NodeJS can be installed either by direct download or through your favourite supported package manager

#####install NodeJS by download

Go to the download page and follow the instructions there:

- [NodeJS download page](https://nodejs.org/en/download/)

#####install NodeJS by package manager

There are a lot of options, thankfully the NodeJS team made a page that goes through most of them

- [NodeJS package manager article](https://nodejs.org/en/download/package-manager/)

####Npm

Npm should already be included, if it is not then please either create an issue so we can document how to get it on your system or search online for how to do it on your system

#### Project dependencies

Run the following command at the root of the project to download all the dependencies:

```
npm i
```

## Configuration

If you wish to modify the project you will likely wish to modify the following aspects.

### Sources

The source code that pulls in the groups/events from the various sources can be found in [~/_data/dataGather.js](_data/dataGather.js).

This script requires the declaration of class files specified with a `getData()` function that returns a 2D array of `[ [group], [event] ]`.

#### Meetup

The Meetup class uses group IDs from [~/_data/sources/groupIds/meetup.js](_data/sources/groupIds/meetup.js) for now, which can be updated/replaced with ease (no other API requirements).

#### EventBrite

The EventBrite class uses organizations objects from [~/_data/sources/groupIds/eventbrite.js](_data/sources/groupIds/eventbrite.js) for now, which can be updated/replaced with ease.

<del>Eventbrite does require an API key, which can be found on [their website](https://www.eventbrite.com/platform/api-keys/), although a Public key is being used in this example which works.</del>

As of 12/12/19 there has been a ["Event Search API Shut Down"](https://www.eventbrite.com/platform/docs/changelog), which means an API Key/Token is required, which can be found on [their website](https://www.eventbrite.com/platform/api-keys/). This can be set under the environment variables as `EVENTBRITE_TOKEN`, or set as the only parameter for the Eventbrite setup in the `dataGather`.

#### Google Calendar

The Google Calendar class can be found [~/_data/sources/googleCalendar.js](_data/sources/googleCalendar.js), which can be initialized with another Calendar ID, with the example of the TechNW calendar below:

```
this.googleCalendar = new googleCalendar("a73q3trj8bssqjifgolb1q8fr4@group.calendar.google.com", "https://technw.uk/calendar", "TechNW", googleCalendarKey)
```

### Github Action

Once deployed, where `npm start` is ran, there is no built in / automated way to update the website and pull new events by default. There are many solutions for this, often involving some type of cron job to rebuild the website on a daily basis, which is recommended due to events finishing and the potential of new events being added.

Within this repository there is a [Github Action](https://github.com/features/actions) called [main.yml](~/.github/workflows/main.yml), to configure the Cron job there are two main steps, changing the the repo name in the if statement and placing the build hook into the repositories secrets.

```yaml
      - if: github.repository == "inevitable-team/compiled-mcr-events"
        name: Curl request
        run: curl -X POST -d {} ${{ secrets.BUILD_HOOK }}
```

<i>It must be noted that this is currently setup to work with the Repository being hosted on GitHub (to take advantage of Github Actions & Repository Secrets) and being deployed to Netlify.</i>

<i>If you do intend to use a different pipeline it is recommended to modify the code for this, or get in touch if you are facing any issues.</i>

#### If Statement

The line that includes `inevitable-team/compiled-mcr-events` should be changed to match the main repo's name, this is to ensure that any forks of the project do not attempt to trigger the cron job as well.

#### Build Hook

If you visit `https://app.netlify.com/sites/${ netlify_project_name }/settings/deploys#build-hooks` you will find the area to generate your build hook, this "give you a unique URL you can use to trigger a build".

If you wish to learn more about Build Hooks visit the [Netlify Docs](https://docs.netlify.com/configure-builds/build-hooks/).

## Usage

Once installed and configured, you can then run the following command:

```
npm run start
```

Which will then generate the website in the `_site` folder, along with the following files within that folder:

- ical: ~/data/events.ical
- Events JSON: ~/data/events.json
- Groups JSON: ~/data/groups.json

## Deploying

If you wish to deploy this as a service, the recommended way would be to push it to [Netlify](https://www.netlify.com), with `npm start` as the build command and `_site` as the build directory.

## Contributing

This project is part of the much greater CompiledMCR project (infrastructure below), meaning potentially only minor PR's will be accepted for refinements, feature updates and bug fixes.

If you do wish to fork it for another city, please do link back and a central Compiled website will be constructed soon.

![CompiledMCR Project Infrastructure](https://i.imgur.com/80G49TU.png)
