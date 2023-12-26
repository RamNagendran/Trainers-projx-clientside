export const sortByDataTime = (a, b) => {
    
    const dateA = new Date(a.createdat_updatedat);
    const dateB = new Date(b.createdat_updatedat);
    
    // Compare the dates, with the most recent date first
    if (dateA > dateB) return -1;
    if (dateA < dateB) return 1;
    return 0;
};