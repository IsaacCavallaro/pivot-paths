import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Play, Filter, ExternalLink, Instagram, Youtube, Facebook, Linkedin, ChevronDown, ChevronUp, ArrowLeft, Heart, Star, Trophy } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

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

  const scaleValues = videos.map(() => useSharedValue(1));

  const handlePressIn = (index: number) => {
    scaleValues[index].value = withTiming(0.95, { duration: 150, easing: Easing.out(Easing.ease) });
  };

  const handlePressOut = (index: number) => {
    scaleValues[index].value = withTiming(1, { duration: 150, easing: Easing.out(Easing.ease) });
  };

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      <View style={[styles.stickyHeader, { backgroundColor: '#647C90' }]}>
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
                <Animated.View
                  key={`${video.id}-${index}`}
                  style={[
                    styles.videoCard,
                    useAnimatedStyle(() => ({
                      transform: [{ scale: scaleValues[index].value }],
                    })),
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => handleVideoPress(video.id)}
                    onPressIn={() => handlePressIn(index)}
                    onPressOut={() => handlePressOut(index)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.videoContentContainer, { backgroundColor: '#F5F5F5' }]}>
                      <View style={styles.videoHeader}>
                        <View style={styles.videoIconContainer}>
                          <View style={[styles.videoIconGradient, { backgroundColor: '#647C90' }]}>
                            <Play size={24} color="#E2DED0" />
                          </View>
                        </View>
                        <View style={styles.videoInfo}>
                          <Text style={styles.videoTitle}>{video.title}</Text>
                          <Text style={styles.videoDescription}>{video.description}</Text>
                          <View style={styles.videoMeta}>
                            <View style={styles.videoDurationBadge}>
                              <Text style={styles.videoDurationText}>{video.duration}</Text>
                            </View>
                            <View style={styles.categoryBadge}>
                              <Text style={styles.categoryBadgeText}>
                                {videoCategories.find(c => c.id === video.category)?.title}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View style={styles.expandIcon}>
                          {isExpanded ? (
                            <ChevronUp size={20} color="#647C90" />
                          ) : (
                            <ChevronDown size={20} color="#647C90" />
                          )}
                        </View>
                      </View>

                      {/* Expanded Video Player */}
                      {isExpanded && (
                        <View style={styles.playerContainer}>
                          <YoutubePlayer
                            height={220}
                            play={false}
                            videoId={video.id}
                            onChangeState={(state: any) => {
                              console.log('Video state:', state);
                            }}
                          />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>

          {/* Course Promotion */}
          <View style={[styles.promotionContainer, { backgroundColor: '#647C90' }]}>
            <View style={styles.promotionContent}>
              <Text style={styles.promotionTitle}>Ready for more?</Text>
              <Text style={styles.promotionSubtitle}>
                Dive deeper with comprehensive courses and resources at pivotfordancers.com
              </Text>
              <TouchableOpacity style={styles.promotionButton} onPress={handleExternalLink}>
                <Text style={styles.promotionButtonText}>Explore Courses</Text>
                <ExternalLink size={16} color="#E2DED0" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerLinks}>
              <TouchableOpacity onPress={handleExternalLink}>
                <Text style={styles.footerLink}>pivotfordancers.com</Text>
              </TouchableOpacity>
              <Text style={styles.footerSeparator}>|</Text>
              <TouchableOpacity onPress={handleTermsPress}>
                <Text style={styles.footerLink}>Terms & Conditions</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.socialIcons}>
              <TouchableOpacity style={styles.socialIcon} onPress={() => handleSocialPress('Instagram')}>
                <Instagram size={24} color="#647C90" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIcon} onPress={() => handleSocialPress('YouTube')}>
                <Youtube size={24} color="#647C90" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIcon} onPress={() => handleSocialPress('Facebook')}>
                <Facebook size={24} color="#647C90" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIcon} onPress={() => handleSocialPress('LinkedIn')}>
                <Linkedin size={24} color="#647C90" />
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  scrollView: {
    flex: 1,
    marginTop: 100,
  },
  content: {
    paddingBottom: 30,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 28,
  },
  backButtonPlaceholder: {
    width: 28,
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
  videosContainer: {
    paddingHorizontal: 24,
    paddingBottom: 30,
    paddingTop: 50,
  },
  videoCard: {
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  videoContentContainer: {
    padding: 24,
  },
  videoHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  videoIconContainer: {
    marginRight: 16,
  },
  videoIconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: '#647C90',
    marginBottom: 8,
    lineHeight: 24,
    fontWeight: '700',
  },
  videoDescription: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#928490',
    lineHeight: 20,
    marginBottom: 16,
  },
  videoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  videoDurationBadge: {
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#647C90',
  },
  videoDurationText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: '#647C90',
    fontWeight: '500',
  },
  categoryBadge: {
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#647C90',
  },
  categoryBadgeText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: '#647C90',
    fontWeight: '500',
  },
  expandIcon: {
    marginLeft: 12,
    justifyContent: 'center',
    minHeight: 56,
  },
  playerContainer: {
    backgroundColor: '#000',
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  promotionContainer: {
    marginHorizontal: 24,
    marginBottom: 48,
    borderRadius: 24,
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  promotionContent: {
    alignItems: 'center',
  },
  promotionTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 28,
    color: '#E2DED0',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '700',
  },
  promotionSubtitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 18,
    color: 'rgba(226, 222, 208, 0.8)',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 24,
  },
  promotionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#647C90',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E2DED0',
  },
  promotionButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#E2DED0',
    marginRight: 8,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: 'center',
    backgroundColor: '#E2DED0',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  footerSeparator: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#928490',
    marginHorizontal: 16,
  },
  footerLink: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#647C90',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialIcon: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(146, 132, 144, 0.1)',
  },
});