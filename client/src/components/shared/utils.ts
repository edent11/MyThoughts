export const calcTimePassed = (createdAt: Date): string => {

    var postTime: Date;
    var now: Date;

    postTime = new Date(createdAt);
    now = new Date(Date.now());

    // Calculate the difference in milliseconds
    const differenceMs = now.getTime() - postTime.getTime();

    // Convert milliseconds to days
    const differenceDays = Math.floor(differenceMs / (1000 * 60 * 60 * 24));

    if (differenceDays > 0) {
        return `${differenceDays} days ago`;
    }

    // Convert milliseconds to days
    const differenceSeconds = Math.floor(differenceMs / 1000);

    // Convert seconds to minutes
    const differenceMinutes = Math.floor(differenceSeconds / 60);

    // Convert minutes to hours
    const differenceHours = Math.floor(differenceMinutes / 60);


    if (differenceHours > 0) {
        return `${differenceHours} hours ago`;
    }

    if (differenceMinutes > 0) {
        return `${differenceMinutes} minutes ago`;

    }

    return `${differenceSeconds} seconds ago`;

}