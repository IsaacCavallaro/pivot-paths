import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Play, Filter, ExternalLink, Instagram, Youtube, Facebook, Linkedin, ChevronDown, ChevronUp, ArrowLeft, Heart, Star, Trophy } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const videoCategories = [
  { id: 'all', title: 'All Videos', color: '#647C90' },
  { id: 'stories', title: 'Career Stories', color: '#928490' },
  { id: 'tips', title: 'Transition Tips', color: '#746C70' },
  { id: 'wellness', title: 'Wellness', color: '#4E4F50' },
];

// Real YouTube videos from Pivot for Dancers
const videos = [
  {
    id: 'ZsvNvXLtcC4',
    title: 'Will you regret being a dancer? How Monica turned guilt into growth',
    description: 'Monica shares her journey of overcoming guilt and finding growth after leaving dance.',
    category: 'stories',
    duration: '15:32',
  },
  {
    id: 'tuBxpzNHWlU',
    title: 'How do you land a muggle job anyway? Career Change Workshop for Professional Dancers',
    description: 'A comprehensive workshop on transitioning from dance to traditional careers.',
    category: 'tips',
    duration: '45:18',
  },
  {
    id: 'rr5G_7E9ZcY',
    title: '"Why I Had to Walk Away From Dance" - Pivot Interview with Sakina Ibrahim',
    description: 'Sakina Ibrahim opens up about her decision to leave dance and what came next.',
    category: 'stories',
    duration: '28:45',
  },
  {
    id: 'dG-WzFlfBDY',
    title: 'My dance career was no longer working for me... This is what I did next',
    description: 'A personal story of recognizing when it\'s time to pivot and taking action.',
    category: 'stories',
    duration: '22:15',
  },
  {
    id: 'U7GJ6I-Cgdk',
    title: 'Why we left the stage to start over',
    description: 'Two dancers share their journey of leaving performance to build something new.',
    category: 'stories',
    duration: '18:30',
  },
];

const handleTermsPress = () => {
  console.log('Opening terms & conditions');
};

const handleSocialPress = (platform: string) => {
  console.log(`Opening ${platform}`);
};

export default function LearnScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);

  const filteredVideos = selectedCategory === 'all'
    ? videos
    : videos.filter(video => video.category === selectedCategory);

  const handleVideoPress = (videoId: string) => {
    // If the same video is clicked, collapse it. Otherwise, expand the new one
    setExpandedVideo(expandedVideo === videoId ? null : videoId);
  };

  const handleExternalLink = () => {
    console.log('Opening pivotfordancers.com');
  };

  const handleBackPress = () => {
    router.push('/(tabs)/');
  };

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      <View style={styles.stickyHeader}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeft size={28} color="#E2DED0" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.titleText}>Learn & Grow</Text>
          </View>
          {/* Empty view to balance the flex row */}
          <View style={styles.backButtonPlaceholder} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Content */}
        <View style={styles.content}>

          {/* Video List */}
          <View style={styles.videosContainer}>
            {filteredVideos.map((video, index) => {
              const isExpanded = expandedVideo === video.id;

              return (
                <View key={`${video.id}-${index}`} style={styles.videoCard}>
                  <LinearGradient
                    colors={['rgba(100, 124, 144, 0.1)', 'rgba(146, 132, 144, 0.1)']}
                    style={styles.videoGradient}
                  >
                    <TouchableOpacity
                      onPress={() => handleVideoPress(video.id)}
                      activeOpacity={0.9}
                      style={styles.videoHeader}
                    >
                      <View style={styles.videoContent}>

                        <View style={styles.videoInfo}>
                          <Text style={styles.videoTitle}>{video.title}</Text>
                          <Text style={styles.videoDescription}>{video.description}</Text>
                          <View style={styles.videoMeta}>
                            <Text style={styles.videoDuration}>{video.duration}</Text>
                            <View style={styles.categoryTag}>
                              <Text style={styles.categoryTagText}>
                                {videoCategories.find(c => c.id === video.category)?.title}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View style={styles.expandIcon}>
                          {isExpanded ? (
                            <ChevronUp size={20} color="#746C70" />
                          ) : (
                            <ChevronDown size={20} color="#746C70" />
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>

                    {/* Expanded Video Player - Inside the card */}
                    {isExpanded && (
                      <View style={styles.playerContainer}>
                        <YoutubePlayer
                          height={220}
                          play={false}
                          videoId={video.id}
                          onChangeState={(state: any) => {
                            // Handle state changes if needed
                            console.log('Video state:', state);
                          }}
                        />
                      </View>
                    )}
                  </LinearGradient>
                </View>
              );
            })}
          </View>

          {/* Course Promotion */}
          <View style={[styles.promotionContainer, { backgroundColor: '#647C90' }]}>
            <View style={styles.promotionContent}>
              <Text style={styles.promotionTitle}>Ready for More?</Text>
              <Text style={styles.promotionSubtitle}>
                Dive deeper with comprehensive courses and resources at pivotfordancers.com
              </Text>
              <TouchableOpacity style={styles.promotionButton} onPress={handleExternalLink}>
                <Text style={styles.promotionButtonText}>Explore Courses</Text>
                <ExternalLink size={16} color="#E2DED0" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2DED0',
  },
  stickyHeader: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: '#647C90',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  scrollView: {
    flex: 1,
    marginTop: 80, // Height of the sticky header
  },
  content: {
    paddingTop: 80,
    paddingBottom: 30,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 28, // Fixed width to match icon size
  },
  backButtonPlaceholder: {
    width: 28, // Same width as backButton for balance
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  titleText: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 25,
    color: '#E2DED0',
    textAlign: 'center',
  },
  subtitleText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#E2DED0',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#647C90',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  websiteButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: '#E2DED0',
    marginRight: 8,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
  },
  categoryText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
  },
  videosContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  videoCard: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  videoGradient: {
    // No padding here since we want the video player to extend to edges
  },
  videoHeader: {
    padding: 15,
  },
  videoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  videoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(226, 222, 208, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 16,
    color: '#4E4F50',
    marginBottom: 6,
    lineHeight: 22,
  },
  videoDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#746C70',
    lineHeight: 20,
    marginBottom: 10,
  },
  videoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoDuration: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: '#928490',
    marginRight: 10,
  },
  categoryTag: {
    backgroundColor: 'rgba(146, 132, 144, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryTagText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 10,
    color: '#746C70',
  },
  expandIcon: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  playerContainer: {
    backgroundColor: '#000',
    marginTop: 10,
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  promotionContainer: {
    margin: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  promotionContent: {
    alignItems: 'center',
  },
  promotionTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 20,
    color: '#E2DED0',
    marginBottom: 8,
  },
  promotionSubtitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: 'rgba(226, 222, 208, 0.9)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  promotionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(226, 222, 208, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  promotionButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: '#E2DED0',
    marginRight: 8,
  },
  headerContent: {
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  decorativeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  decorativeBadge: {
    backgroundColor: 'rgba(226, 222, 208, 0.1)',
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(226, 222, 208, 0.2)',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  footerSeparator: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#928490',
    marginHorizontal: 12,
  },
  footerLink: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: '#647C90',
    textDecorationLine: 'underline',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialIcon: {
    padding: 8,
  },
  heroImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
});