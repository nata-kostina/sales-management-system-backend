interface WithPriority {
    priority: number;
}
export const sortByPriority = (a: WithPriority, b: WithPriority, type: "asc" | "desc" = "asc"): number => {
    return type === "asc" ? a.priority - b.priority : b.priority - a.priority;
};

export const createDateForFile = (): string => {
    const date = new Date();

    const day = (`0${date.getDate()}`).slice(-2);
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const year = date.getFullYear();
    const hours = (`0${date.getHours()}`).slice(-2);
    const minutes = (`0${date.getMinutes()}`).slice(-2);
    const seconds = (`0${date.getSeconds()}`).slice(-2);

    return `${day}-${month}-${year}_${hours}_${minutes}_${seconds}`;
};

export const createDateForCsv = (value: string): string => {
    return new Date(+value).toISOString().split("T")[0];
};

const streets: string[] = ["Maple", "Oak", "Cedar", "Elm", "Pine", "Main", "Elmwood", "Park", "Washington", "Lake"];
const streetSuffixes: string[] = ["Street", "Avenue", "Road", "Boulevard", "Parkway", "Heights"];
const apartmentNumbers: string[] = ["101", "202", "303", "404", "505", "606", "707", "808", "909", "1001"];

export function generateRandomAddress(): string {
    // Generate a random street name
    const randomStreetIndex: number = Math.floor(Math.random() * streets.length);
    const randomStreet: string = streets[randomStreetIndex];

    // Generate a random street suffix
    const randomSuffixIndex: number = Math.floor(Math.random() * streetSuffixes.length);
    const randomSuffix: string = streetSuffixes[randomSuffixIndex];

    // Generate a random house number (between 1 and 100)
    const randomHouseNumber: number = Math.floor(Math.random() * 100) + 1;

    // Generate a random apartment number
    const randomApartmentNumber: string = apartmentNumbers[Math.floor(Math.random() * apartmentNumbers.length)];

    // Concatenate street, suffix, house number, and apartment number into a single string
    return `${randomStreet} ${randomSuffix} ${randomHouseNumber}, Apt. ${randomApartmentNumber}`;
}

export const monthNames = [
    "Jan", "Feb", "Mar", "Apr",
    "May", "Jun", "Jul", "Aug",
    "Sep", "Oct", "Nov", "Dec",
];
