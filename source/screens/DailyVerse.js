// DailyVerse.js
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import BibleApi from './BibleApi';

const DailyVerse = () => {
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);

  const getDailyVerse = async () => {
    try {
      const verseOfTheDay = await BibleApi.getVerseOfTheDay();
      setVerse(verseOfTheDay);
    } catch (error) {
      console.error('Error fetching daily verse:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDailyVerse();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={{ left:-115,fontSize: 13, fontWeight: '700', marginBottom: -5 }}>
            Daily Bible Verse
          </Text>
          <Text style={{ padding: 14, textAlign: 'center' }}>{verse?.text}</Text>
          <Text style={{left:-140, marginTop:-5, fontStyle: 'normal',fontWeight:"600", color:"#000A83"  }}>
            {verse?.reference}
          </Text>
        </>
      )}
    </View>
  );
};

export default DailyVerse;
