import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { faker } from "@faker-js/faker";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateMockData = () => {
  const songs = Array.from({ length: 1000 }, (_, index) => ({
    song_id: index + 1,
    artist_id: faker.number.int({ min: 1, max: 500 }),
    date_streamed: faker.date.between({ from: "2024-02-01", to: "2024-08-31" }).toISOString().split("T")[0],
    song_name: faker.music.songName(),
  }));

  const users = Array.from({ length: 5000 }, (_, index) => ({
    user_id: index + 1,
    user_name: faker.person.fullName(),
    date_joined: faker.date.between({ from: "2024-02-01", to: "2024-08-27" }).toISOString().split("T")[0],
    last_song_streamed: faker.date.between({ from: "2024-05-12", to: "2024-08-31" }).toISOString().split("T")[0],
  }));

  const artists = Array.from({ length: 500 }, (_, index) => ({
    artist_id: index + 1,
    artist_name: faker.person.fullName(),
    joined_date: faker.date.between({ from: "2024-02-01", to: "2024-08-31" }).toISOString().split("T")[0],
    avatar: `https://i.pravatar.cc/150?img=${faker.number.int({ min: 1, max: 70 })}`,
  }));

  const streams = Array.from({ length: 100000 }, (_, index) => {
    const song_id = faker.number.int({ min: 1, max: 1000 });
    const song_name = songs[song_id - 1].song_name;
    const artist_id = songs[song_id - 1].artist_id;
    const artist_name = artists[artist_id - 1].artist_name;
    const user_id = faker.number.int({ min: 1, max: 5000 });
    const user_name = users[user_id - 1].user_name;
    return {
      id: index + 1,
      song_id: faker.number.int({ min: 1, max: 1000 }),
      song_name,
      artist_name,
      user_id: faker.number.int({ min: 1, max: 5000 }),
      user_name,
      stream_date: faker.date.between({ from: "2024-02-01", to: "2024-08-31" }).toISOString().split("T")[0],
      revenue_source: Math.random() < 0.5 ? "ads" : "subscription",
    };
  });

  const revenue = Array.from({ length: 2000 }, () => ({
    revenue_date: faker.date.between({ from: "2024-02-01", to: "2024-08-31" }).toISOString().split("T")[0],
    subscription_revenue: faker.number.float({ min: 10, max: 100, multipleOf: 0.01 }),
    ad_revenue: faker.number.float({ min: 1, max: 20, multipleOf: 0.01 }),
  }));

  return {
    songs,
    users,
    artists,
    streams,
    revenue,
  };
};

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function getMonthNamesBetweenDates(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const months = [];

  while (start <= end) {
    const month = monthNames[start.getMonth()];
    const year = start.getFullYear();
    months.push(`${month} ${year}`);

    // Move to the next month
    start.setMonth(start.getMonth() + 1);
  }

  return months;
}

export const createDateFromMonthAndDate = (monthYearString: string, day: number) => {
  const [monthName, year] = monthYearString.split(" ");

  // Create a map of month names to their corresponding month numbers (0-11)
  const monthMap = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
  };

  // Get the month number from the month name
  const month = monthMap[monthName];

  // Create the Date object
  const date = new Date(year, month, day);
  return date;
};
