import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, Linking } from 'react-native';
import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useScrollToTop, useFocusEffect } from '@react-navigation/native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Play, Filter, ExternalLink, Instagram, Youtube, Facebook, Linkedin, ChevronDown, ChevronUp, ArrowLeft, Heart, Star, Trophy } from 'lucide-react-native';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const videoCategories = [
  { id: 'stories', title: 'Career Stories', color: '#928490' },
  { id: 'data', title: 'Data', color: '#746C70' },
];

// Updated YouTube videos from Pivot for Dancers
const videos = [
  {
    id: '16JMiSPzlBE',
    title: 'How a ski mountain helped Elise let go of her dance career',
    category: 'stories',
    duration: '32:21',
  },
  {
    id: 'a_U9pZr03zI',
    title: 'Kelsey didn\'t wait around for her dance career to inevitably end',
    category: 'stories',
    duration: '26:17',
  },
  {
    id: 'D6b1OD2q55A',
    title: 'Shocking data reveals that dancers retire much earlier than expected...',
    category: 'data',
    duration: '8:15',
  },
  {
    id: '1J26CRRwr-k',
    title: 'If a recession is coming, are dancers really ready?',
    category: 'data',
    duration: '5:42',
  },
  {
    id: 'ZsvNvXLtcC4',
    title: 'Will you regret being a dancer? How Monica turned guilt into growth',
    category: 'stories',
    duration: '26:03',
  },
  {
    id: 'FJRbh7AI9HQ',
    title: 'Are we done telling dancers not to have a backup plan? Rachel is proof that you can',
    category: 'stories',
    duration: '30:29',
  },
  {
    id: 'tnPkI_ezUto',
    title: 'Missing the magic of the stage? Here\'s how Ali is finding meaning beyond her ballet career',
    category: 'stories',
    duration: '27:28',
  },
  {
    id: '7EUfZS8mQtk',
    title: 'How Demi\'s roller skating hobby turned into 500K followers on Instagram',
    category: 'stories',
    duration: '22:36',
  },
];

const handleSocialPress = (url: string) => {
  Linking.openURL(url);
};

export default function LearnScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('stories');
  const [expandedVideo, setExpandedVideo] = useState<string | null>(videos[0]?.id || null);

  // Add this scroll ref for tab navigation
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);

  // Add this to scroll to top when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Scroll to top when screen is focused
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ y: 0, animated: false });
      }

      // Reset the first video to be expanded when screen comes into focus
      setExpandedVideo(videos[0]?.id || null);
    }, [])
  );

  const filteredVideos = videos.filter(video => video.category === selectedCategory);

  const handleVideoPress = (videoId: string) => {
    // If the same video is clicked, collapse it. Otherwise, expand the new one
    setExpandedVideo(expandedVideo === videoId ? null : videoId);
  };

  const handleExternalLink = () => {
    Linking.openURL('https://pivotfordancers.com/products/how-to-pivot/');
  };

  const handleBackPress = () => {
    router.push('/(tabs)/');
  };

  const scaleValue = useSharedValue(1);

  const handlePressIn = () => {
    scaleValue.value = withTiming(0.95, { duration: 150, easing: Easing.out(Easing.ease) });
  };

  const handlePressOut = () => {
    scaleValue.value = withTiming(1, { duration: 150, easing: Easing.out(Easing.ease) });
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

      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Content */}
        <View style={styles.content}>
          {/* Category Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScrollContent}
            style={styles.categoryScroll}
          >
            {videoCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && styles.categoryButtonActive,
                  { borderColor: category.color }
                ]}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category.id && styles.categoryButtonTextActive,
                    { color: selectedCategory === category.id ? '#E2DED0' : category.color }
                  ]}
                >
                  {category.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Video List */}
          <View style={styles.videosContainer}>
            {filteredVideos.map((video, index) => {
              const isExpanded = expandedVideo === video.id;

              return (
                <View
                  key={`${video.id}-${index}`}
                  style={styles.videoCard}
                >
                  <TouchableOpacity
                    onPress={() => handleVideoPress(video.id)}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
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
                            height={160}
                            play={false}
                            videoId={video.id}
                            webViewStyle={styles.youtubeWebView}
                            webViewProps={{
                              allowsFullscreenVideo: false,
                            }}
                            onChangeState={(state: any) => {
                              console.log('Video state:', state);
                            }}
                          />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          {/* Course Promotion */}
          <View style={[styles.promotionContainer, { backgroundColor: '#647C90' }]}>
            <View style={styles.promotionContent}>
              <Text style={styles.promotionTitle}>Ready for more?</Text>
              <Text style={styles.promotionSubtitle}>
                Dive deeper with our part self-help book and part action-focused career resource tailored specifically for professional dancers.
              </Text>
              <TouchableOpacity style={styles.promotionButton} onPress={handleExternalLink}>
                <Text style={styles.promotionButtonText}>Learn More</Text>
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
            </View>
            <View style={styles.socialIcons}>
              <TouchableOpacity style={styles.socialIcon} onPress={() => handleSocialPress('https://www.instagram.com/pivotfordancers')}>
                <Instagram size={24} color="#647C90" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIcon} onPress={() => handleSocialPress('https://www.youtube.com/@pivotfordancers')}>
                <Youtube size={24} color="#647C90" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIcon} onPress={() => handleSocialPress('https://www.facebook.com/pivotfordancers/')}>
                <Facebook size={24} color="#647C90" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIcon} onPress={() => handleSocialPress('https://www.linkedin.com/company/pivotfordancers/')}>
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
  categoryScroll: {
    marginBottom: 24,
  },
  categoryScrollContent: {
    paddingHorizontal: 24,
    paddingTop: 30,
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: '#E2DED0',
  },
  categoryButtonActive: {
    backgroundColor: '#647C90',
  },
  categoryButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryButtonTextActive: {
    color: '#E2DED0',
  },
  videosContainer: {
    paddingHorizontal: 24,
    paddingBottom: 30,
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
    width: '100%',
  },
  youtubeWebView: {
    alignSelf: 'stretch',
  },
  promotionContainer: {
    marginHorizontal: 24,
    marginBottom: 0,
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