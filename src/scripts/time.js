// convert a date to YY-MM-DD format
module.exports.getDateFormatted = d => {
    let month = (d.getMonth() + 1).toString(), day = d.getDate().toString(), year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [year, month, day].join("-");
};

// milliseconds to time converter
module.exports.msToTime = ms => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 60));
    const hours = Math.floor(ms / (1000 * 60 * 60) % 60);
    const minutes = Math.floor(ms / (1000 * 60) % 60);
    const seconds = Math.floor(ms / (1000) % 60);

    let str = "";
    if (days) str = str + days + "d ";
    if (hours) str = str + hours + "h ";
    if (minutes) str = str + minutes + "m ";
    if (seconds) str = str + seconds + "s";

    return str || "0s";
};