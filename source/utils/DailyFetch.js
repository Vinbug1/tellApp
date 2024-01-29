// VerseService.js

import axios from 'axios';

const API_BASE_URL = 'https://api.scripture.api.bible/v1/bibles';

const getDailyVerse = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/verse-of-the-day`);
    console.log("checking daily verse",response);
    const verse = response.data.data;

    return {
      book: verse.reference.split(' ')[0],
      chapter: parseInt(verse.reference.split(' ')[1]),
      verse: parseInt(verse.reference.split(' ')[2]),
      text: verse.content,
    };
  } catch (error) {
    console.error('Error fetching daily verse:', error);
    return null;
  }
};

export { getDailyVerse };
