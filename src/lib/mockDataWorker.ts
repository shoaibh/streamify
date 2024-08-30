import { faker } from "@faker-js/faker";

const CHUNK_SIZE = 10000; // Adjust based on performance needs

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const generateChunk = (start: number, end: number, songs: any[], users: any[], artists: any[]) => {
  return Array.from({ length: end - start }, (_, index) => {
    const song_id = faker.number.int({ min: 1, max: 1000 });
    const song_name = songs[song_id - 1].song_name;
    const artist_id = songs[song_id - 1].artist_id;
    const artist_name = artists[artist_id - 1].artist_name;
    const user_id = faker.number.int({ min: 1, max: 5000 });
    const user_name = users[user_id - 1].user_name;
    return {
      id: start + index + 1,
      song_id,
      song_name,
      artist_name,
      user_id,
      user_name,
      stream_date: faker.date.between({ from: "2023-07-01", to: "2024-08-31" }).toISOString().split("T")[0],
      revenue_source: Math.random() < 0.5 ? "ads" : "subscriptions",
    };
  });
};

const generateMockData = () => {
  const songs = Array.from({ length: 1000 }, (_, index) => ({
    song_id: index + 1,
    artist_id: faker.number.int({ min: 1, max: 500 }),
    date_streamed: faker.date.between({ from: "2023-07-01", to: "2024-08-31" }).toISOString().split("T")[0],
    song_name: faker.music.songName(),
  }));

  const users = Array.from({ length: 5000 }, (_, index) => ({
    user_id: index + 1,
    user_name: faker.person.fullName(),
    date_joined: faker.date.between({ from: "2023-07-01", to: "2024-08-27" }).toISOString().split("T")[0],
    last_song_streamed: faker.date.between({ from: "2023-10-12", to: "2024-08-31" }).toISOString().split("T")[0],
  }));

  const artists = Array.from({ length: 500 }, (_, index) => ({
    artist_id: index + 1,
    artist_name: faker.person.fullName(),
    joined_date: faker.date.between({ from: "2023-07-01", to: "2024-08-31" }).toISOString().split("T")[0],
    avatar: `https://i.pravatar.cc/150?img=${faker.number.int({ min: 1, max: 70 })}`,
  }));

  const revenue = Array.from({ length: 2000 }, () => ({
    revenue_date: faker.date.between({ from: "2023-07-01", to: "2024-08-31" }).toISOString().split("T")[0],
    subscription_revenue: faker.number.float({ min: 10, max: 100, multipleOf: 0.01 }),
    ad_revenue: faker.number.float({ min: 1, max: 20, multipleOf: 0.01 }),
  }));

  self.postMessage({ type: "metadata", data: { songs, users, artists, revenue } });

  for (let i = 0; i < 100000; i += CHUNK_SIZE) {
    const streamChunk = generateChunk(i, Math.min(i + CHUNK_SIZE, 100000), songs, users, artists);
    self.postMessage({ type: "chunk", data: streamChunk });
  }

  self.postMessage({ type: "complete" });
};

self.onmessage = () => {
  generateMockData();
};
