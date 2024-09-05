const fs = require("fs");
const path = require("path");
const { faker } = require("@faker-js/faker");

const filePath = path.join(__dirname, "../api/data.json");

const generateMockData = () => {
  const songs = Array.from({ length: 1000 }, (_, index) => ({
    song_id: index + 1,
    artist_id: faker.number.int({ min: 1, max: 500 }),
    date_streamed: faker.date.between({ from: "2023-07-01", to: "2024-08-31" }).toISOString().split("T")[0],
    song_name: faker.music.songName(),
    cover: faker.image.url({ width: 640, height: 640, category: "music" }),
  }));

  const artists = Array.from({ length: 500 }, (_, index) => ({
    artist_id: index + 1,
    artist_name: faker.person.fullName(),
    joined_date: faker.date.between({ from: "2023-07-01", to: "2024-08-31" }).toISOString().split("T")[0],
    avatar: `https://i.pravatar.cc/150?img=${faker.number.int({ min: 1, max: 70 })}`,
  }));

  const users = Array.from({ length: 5000 }, (_, index) => {
    const song_id = faker.number.int({ min: 1, max: 1000 });
    const song_name = songs[song_id - 1].song_name;
    const artist_id = songs[song_id - 1].artist_id;
    const artist_name = artists[artist_id - 1].artist_name;
    return {
      user_id: index + 1,
      user_name: faker.person.fullName(),
      date_joined: faker.date.between({ from: "2023-07-01", to: "2024-08-27" }).toISOString().split("T")[0],
      last_song_streamed: faker.date.between({ from: "2023-10-12", to: "2024-08-31" }).toISOString().split("T")[0],
      last_song_streamed_id: song_id,
      last_song_streamd_name: song_name,
      last_song_artist_id: artist_id,
      last_song_artist_name: artist_name,
    };
  });

  const revenue = Array.from({ length: 2000 }, () => {
    const song_id = faker.number.int({ min: 1, max: 1000 });
    const song_name = songs[song_id - 1].song_name;
    const artist_id = songs[song_id - 1].artist_id;
    const artist_name = artists[artist_id - 1].artist_name;
    return {
      revenue_date: faker.date.between({ from: "2023-07-01", to: "2024-08-31" }).toISOString().split("T")[0],
      subscription_revenue: faker.number.float({ min: 10, max: 100, multipleOf: 0.01 }),
      ad_revenue: faker.number.float({ min: 1, max: 20, multipleOf: 0.01 }),
      song_id,
      song_name,
      artist_id,
      artist_name,
    };
  });

  const streams = Array.from({ length: 100000 }, (_, index) => {
    const song_id = faker.number.int({ min: 1, max: 1000 });
    const song_name = songs[song_id - 1].song_name;
    const artist_id = songs[song_id - 1].artist_id;
    const artist_name = artists[artist_id - 1].artist_name;
    const user_id = faker.number.int({ min: 1, max: 5000 });
    const user_name = users[user_id - 1].user_name;
    return {
      id: index,
      song_id,
      song_name,
      artist_id,
      artist_name,
      user_id,
      user_name,
      stream_date: faker.date.between({ from: "2023-07-01", to: "2024-08-31" }).toISOString().split("T")[0],
      revenue_source: Math.random() < 0.5 ? "ads" : "subscriptions",
    };
  });

  return {
    users,
    artists,
    songs,
    revenue,
    streams,
  };
};

fs.access(filePath, fs.constants.F_OK, (err) => {
  if (err) {
    // File does not exist, create it with initial structure
    const initialData = {};
    fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2), "utf8");
    console.log("data.json file created.");
  }

  // Read the JSON file
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the JSON file:", err);
      return;
    }

    // Parse the JSON data
    let jsonData = JSON.parse(data);

    // Add generated users to the JSON data
    jsonData = generateMockData(); // Generate 10 fake users

    // Stringify the JSON data to prepare it for saving
    const updatedJsonData = JSON.stringify(jsonData, null, 2);

    // Write the updated JSON data back to the file
    fs.writeFile(filePath, updatedJsonData, "utf8", (err) => {
      if (err) {
        console.error("Error writing the JSON file:", err);
        return;
      }
      console.log("JSON file has been updated with fake data.");
    });
  });
});
