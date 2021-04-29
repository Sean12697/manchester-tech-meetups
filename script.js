require('dotenv').config();

let fs = require('fs-extra'),
    shell = require('shelljs'),
    beautify = require('beautify'),
    moment = require('moment'),
    ical = require('ical-generator').default,
    dataGatherClass = require(`${__dirname}/_data/dataGather`),
    htmlConverter = require(`${__dirname}/_static/scripts/dataToHTML`),
    indexLayout = require(`${__dirname}/_layout/index`),
    config = require(`./config.json`);

    require('events').EventEmitter.prototype._maxListeners = 0;

let cal = ical({domain: 'https://events.compiledmcr.com/', name: 'CompiledMCR Events (Manchester Tech Meetups)'});

// Moving static files to site
shell.mkdir('-p', `${__dirname}/_site`);
shell.rm('-rf', `${__dirname}/_site/*`);
fs.copySync(`${__dirname}/_static`, `${__dirname}/_site`);
fs.copySync(`${__dirname}/_data/sources/groupIds`, `${__dirname}/_site/data`);

// Creating Data
shell.mkdir('-p', `${__dirname}/_exports`);
shell.mkdir('-p', `${__dirname}/_site/data`);
let dataGather = new dataGatherClass();

dataGather.getData().then(data => {
        // Got data and images
        fs.writeFileSync(`${__dirname}/_exports/groups.json`, beautify(JSON.stringify(data[0]), { format: 'json' }), () => {});
        fs.writeFileSync(`${__dirname}/_exports/events.json`, beautify(JSON.stringify(data[1]), { format: 'json' }), () => {});
        // Output
        fs.writeFileSync(`${__dirname}/_site/data/groups.json`, beautify(JSON.stringify(data[0]), { format: 'json' }), () => {});
        fs.writeFileSync(`${__dirname}/_site/data/groups.txt`, data[0].map(group => `- [${group.name}](${group.link})`).join(" \n"), () => {});
        fs.writeFileSync(`${__dirname}/_site/data/events.json`, beautify(JSON.stringify(data[1]), { format: 'json' }), () => {});
        // Creating HTML
        let eventsHTML = data[1].map(htmlConverter.eventHTML).join(""),
            groupsHTML = data[0].map(htmlConverter.groupHTML).join("");
        let index = indexLayout(eventsHTML, groupsHTML, config);
        fs.writeFileSync(`${__dirname}/_site/index.html`, index, () => {});
        // Create Calender
        data[1].forEach(event => {
            cal.createEvent({
                start: moment(event.startTimeISO),
                end: moment(event.endTimeISO),
                summary: event.name,
                description: `Source:\n${event.link}\n\n${event.desc.length > 280 ? event.desc.substr(0, 280) : event.desc}`,
                location: event.location,
                url: event.link
            });
        });
        fs.writeFileSync("./_site/data/events.ical", cal.toString(), () => {});
});