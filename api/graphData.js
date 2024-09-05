import fs from "fs";
import path from "path";

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
export function getMonthNamesBetweenDates(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const months = [];

  while (start <= end) {
    const month = monthNames[start.getMonth()];
    const year = start.getFullYear();
    months.push(`${month} ${year}`);

    start.setMonth(start.getMonth() + 1);
  }

  return months;
}

export const createDateFromMonthAndDate = (monthYearString, day) => {
  // Default to "August 2024" if no monthYearString is provided
  if (!monthYearString) {
    monthYearString = "August 2024";
  }

  const [monthName, yearString] = monthYearString.split(" ");
  const year = parseInt(yearString, 10);

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

  // Ensure that the month name is valid
  const month = monthMap[monthName];
  if (month === undefined) {
    throw new Error(`Invalid month name: ${monthName}`);
  }

  // Create the Date object
  return new Date(year, month, day);
};

export function getLastMonthDate(date) {
  const lastMonthDate = new Date(date);
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  return lastMonthDate;
}

const filePath = path.join(process.cwd(), "api", "data.json");
let data = null;

export default function handler(req, res) {
  if (req.method === "POST") {
    const { fromDate, toDate, artistId } = req.body;

    if (data === null) {
      data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }

    const songFrequency = data?.streams
      ?.filter((song) => {
        const lastStreamedDate = new Date(song.stream_date);
        let filterCnd = lastStreamedDate >= new Date(fromDate) && lastStreamedDate <= new Date(toDate);

        if (artistId) {
          filterCnd = filterCnd && Number(song.artist_id) === Number(artistId);
        }
        return filterCnd;
      })
      .reduce((acc, stream) => {
        const { song_id } = stream;
        if (!acc[song_id]) {
          acc[song_id] = 0;
        }
        acc[song_id]++;
        return acc;
      }, {});

    const result = [];
    if (!artistId) {
      const months = getMonthNamesBetweenDates(fromDate, toDate);

      if (months.length <= 1) {
        months.unshift(monthNames[fromDate.getMonth() - 1]);
      }

      months.forEach((month) => {
        const thatDate = createDateFromMonthAndDate(month, new Date(fromDate).getDate());
        const lastMonthDate = getLastMonthDate(thatDate);

        const totalUsersThatMonth = data?.users.filter((user) => {
          const dateJoined = new Date(user.date_joined);
          return dateJoined <= thatDate;
        }).length;

        const activeUsersThatMonth = data?.users.filter((user) => {
          const dateJoined = new Date(user.last_song_streamed);
          return dateJoined <= thatDate && dateJoined >= lastMonthDate;
        }).length;
        result.push({ month, totalUsers: totalUsersThatMonth, activeUsers: activeUsersThatMonth });
      });
    }

    const revenueBetweenDates = data?.revenue.filter((r) => {
      let filterCnd = new Date(r.revenue_date) <= new Date(toDate) && new Date(r.revenue_date) >= new Date(fromDate);
      if (artistId) {
        filterCnd = filterCnd && Number(r.artist_id) === Number(artistId);
      }
      return filterCnd;
    });

    const totalRevenue = revenueBetweenDates.reduce((acc, curr) => acc + curr.subscription_revenue + curr.ad_revenue, 0).toFixed(2);
    const subsRevenue = revenueBetweenDates.reduce((acc, curr) => acc + curr.subscription_revenue, 0);
    const adsRevenue = revenueBetweenDates.reduce((acc, curr) => acc + curr.ad_revenue, 0);

    const songEntries = Object.entries(songFrequency);

    songEntries.sort((a, b) => b[1] - a[1]);

    const top5Songs = songEntries.slice(0, 5);

    const songResult = [];

    top5Songs.forEach((song_id) => {
      const song = data.songs.find((song) => {
        return song.song_id === Number(song_id[0]);
      });
      if (song) songResult.push({ songName: song.song_name, streams: song_id[1] });
    });

    res.status(200).json({
      userGraphData: result,
      totalRevenue,
      subsRevenue,
      adsRevenue,
      chartData: songResult,
    });
  }
}
