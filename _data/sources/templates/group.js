module.exports = class group {
    constructor(id, name, desc, link, img, members, sinceLast, untilNext, source, ad) {
        this.id = id;
        this.name = name;
        this.desc = desc.replace(/(<([^>]+)>)/ig, "");
        this.link = link;
        this.img = img;
        this.members = members;
        this.sinceLast = sinceLast;
        this.untilNext = untilNext;
        this.source = source;
        this.ad = ad;
    }
}