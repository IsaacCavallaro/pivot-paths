import React, { useState, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    RefreshControl,
    Share,
    Alert
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    ArrowLeft,
    TrendingUp,
    Calendar,
    Heart,
    BookOpen,
    Sparkles,
    BarChart3,
    Download,
    Share2
} from 'lucide-react-native';
import { PieChart, BarChart } from 'react-native-svg-charts';

interface JournalEntry {
    id: string;
    pathTag: string;
    day: number;
    content: string;
    mood?: string;
    timestamp: number;
}

interface MoodStats {
    [key: string]: number;
}

const screenWidth = Dimensions.get('window').width;

export default function ReportsScreen() {
    const router = useRouter();
    const [isPathCompleted, setIsPathCompleted] = useState(false);
    const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [completedDays, setCompletedDays] = useState(0);

    useFocusEffect(
        useCallback(() => {
            loadReportData();
        }, [])
    );

    const loadReportData = async () => {
        try {
            setLoading(true);

            const categoryId = 'mindset';
            const pathId = 'discover-dream-life';
            const progressKey = `${categoryId}_${pathId}`;

            const savedProgress = await AsyncStorage.getItem('pathProgress');
            const progressData = savedProgress ? JSON.parse(savedProgress) : {};
            const currentCompletedDays = progressData[progressKey] || 0;
            setCompletedDays(currentCompletedDays);

            const pathCompleted = currentCompletedDays >= 7;
            setIsPathCompleted(pathCompleted);

            if (pathCompleted) {
                const raw = await AsyncStorage.getItem('journalEntries');
                if (raw) {
                    const parsedEntries = JSON.parse(raw);
                    setJournalEntries(parsedEntries);
                }
            }

            setLoading(false);
        } catch (error) {
            console.error('Error loading report data:', error);
            setLoading(false);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadReportData();
        setRefreshing(false);
    }, []);

    const handleBackPress = () => {
        router.push('/(tabs)');
    };

    const getMoodStats = (): MoodStats => {
        const stats: MoodStats = {};
        journalEntries.forEach(entry => {
            if (entry.mood) {
                stats[entry.mood] = (stats[entry.mood] || 0) + 1;
            }
        });
        return stats;
    };

    const getMostCommonMood = (): string => {
        const stats = getMoodStats();
        let maxMood = '';
        let maxCount = 0;

        Object.entries(stats).forEach(([mood, count]) => {
            if (count > maxCount) {
                maxCount = count;
                maxMood = mood;
            }
        });

        return maxMood || 'neutral';
    };

    const getEntriesByPath = () => {
        const byPath: { [key: string]: JournalEntry[] } = {};
        journalEntries.forEach(entry => {
            const path = entry.pathTag || 'general';
            if (!byPath[path]) {
                byPath[path] = [];
            }
            byPath[path].push(entry);
        });
        return byPath;
    };

    const formatPathTag = (pathTag: string): string => {
        if (!pathTag) return 'General';
        return pathTag
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const getMoodEmoji = (mood: string): string => {
        const emojiMap: { [key: string]: string } = {
            angry: '😠',
            sad: '😢',
            neutral: '😐',
            happy: '😊',
            excited: '😄',
            loved: '❤️'
        };
        return emojiMap[mood] || '😐';
    };

    const getMoodColor = (mood: string): string => {
        const colorMap: { [key: string]: string } = {
            angry: '#DC2626',
            sad: '#2563EB',
            neutral: '#CA8A04',
            happy: '#16A34A',
            excited: '#7C3AED',
            loved: '#DB2777'
        };
        return colorMap[mood] || '#928490';
    };

    const getInsights = () => {
        const totalEntries = journalEntries.length;
        const moodStats = getMoodStats();
        const mostCommonMood = getMostCommonMood();
        const entriesByPath = getEntriesByPath();
        const pathCount = Object.keys(entriesByPath).length;

        const entryLengths = journalEntries.map(entry => entry.content.length);
        const avgLength = entryLengths.length > 0 ?
            Math.round(entryLengths.reduce((a, b) => a + b, 0) / entryLengths.length) : 0;

        const timeOfDay = journalEntries.map(entry => {
            const hour = new Date(entry.timestamp).getHours();
            if (hour < 6) return 'Night';
            if (hour < 12) return 'Morning';
            if (hour < 18) return 'Afternoon';
            return 'Evening';
        });

        const timeStats = timeOfDay.reduce((acc, time) => {
            acc[time] = (acc[time] || 0) + 1;
            return acc;
        }, {} as { [key: string]: number });

        const favoriteTime = Object.keys(timeStats).length > 0 ?
            Object.keys(timeStats).reduce((a, b) => timeStats[a] > timeStats[b] ? a : b) : 'Evening';

        return {
            totalEntries,
            moodStats,
            mostCommonMood,
            entriesByPath,
            pathCount,
            avgLength,
            timeStats,
            favoriteTime
        };
    };

    const insights = useMemo(() => getInsights(), [journalEntries]);

    // Data for react-native-svg-charts
    const getMoodPieData = () => {
        const stats = getMoodStats();
        return Object.entries(stats).map(([mood, count]) => ({
            value: count,
            svg: { fill: getMoodColor(mood) },
            key: `pie-${mood}`,
            arc: { outerRadius: '100%', cornerRadius: 5 }
        }));
    };

    const getTimeBarData = () => {
        const times = ['Morning', 'Afternoon', 'Evening', 'Night'];
        return times.map(time => ({
            value: insights.timeStats[time] || 0,
            svg: { fill: '#647C90' },
            key: `bar-${time}`
        }));
    };

    const exportReport = async () => {
        try {
            const reportText = `
Your Journal Insights Report
============================

Total Entries: ${insights.totalEntries}
Categories: ${insights.pathCount}
Most Common Mood: ${insights.mostCommonMood}
Average Entry Length: ${insights.avgLength} characters
Favorite Writing Time: ${insights.favoriteTime}

Mood Distribution:
${Object.entries(insights.moodStats)
                    .map(([mood, count]) => `${getMoodEmoji(mood)} ${mood}: ${count} entries (${((count / insights.totalEntries) * 100).toFixed(0)}%)`)
                    .join('\n')}

Entries by Category:
${Object.entries(insights.entriesByPath)
                    .map(([path, entries]) => `${formatPathTag(path)}: ${entries.length} entries`)
                    .join('\n')}

Keep up the great work on your journaling journey! 📝✨
            `.trim();

            await Share.share({
                message: reportText,
                title: 'My Journal Insights Report'
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to export report');
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={[styles.stickyHeader, { backgroundColor: '#647C90' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>Reports</Text>
                        </View>
                        <View style={styles.backButtonPlaceholder} />
                    </View>
                </View>
                <View style={styles.centerContent}>
                    <Text style={styles.loadingText}>Loading report...</Text>
                </View>
            </View>
        );
    }

    if (!isPathCompleted) {
        return (
            <View style={styles.container}>
                <View style={[styles.stickyHeader, { backgroundColor: '#647C90' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>Reports</Text>
                        </View>
                        <View style={styles.backButtonPlaceholder} />
                    </View>
                </View>
                <View style={styles.centerContent}>
                    <Sparkles size={64} color="#928490" />
                    <Text style={styles.emptyTitle}>Complete Your Path</Text>
                    <Text style={styles.emptyText}>
                        Finish the "Discover Your Dream Life" path to unlock your personalized journal insights report.
                    </Text>
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            <View
                                style={[
                                    styles.progressFill,
                                    { width: `${(completedDays / 7) * 100}%` }
                                ]}
                            />
                        </View>
                        <Text style={styles.progressText}>
                            {completedDays} of 7 days completed
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={[styles.stickyHeader, { backgroundColor: '#647C90' }]}>
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                        <ArrowLeft size={28} color="#E2DED0" />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.titleText}>Reports</Text>
                    </View>
                    <TouchableOpacity style={styles.exportButton} onPress={exportReport}>
                        <Share2 size={20} color="#E2DED0" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#647C90']}
                    />
                }
            >
                <View style={styles.content}>
                    <Text style={styles.reportTitle}>Your Journey Insights</Text>
                    <Text style={styles.reportSubtitle}>Discover Your Dream Life</Text>

                    {/* Summary Card */}
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryHeader}>
                            <TrendingUp size={24} color="#647C90" />
                            <Text style={styles.summaryTitle}>Overview</Text>
                        </View>
                        <View style={styles.statsGrid}>
                            <View style={styles.statBox}>
                                <Text style={styles.statNumber}>{insights.totalEntries}</Text>
                                <Text style={styles.statLabel}>Total Entries</Text>
                            </View>
                            <View style={styles.statBox}>
                                <Text style={styles.statNumber}>{insights.pathCount}</Text>
                                <Text style={styles.statLabel}>Categories</Text>
                            </View>
                            <View style={styles.statBox}>
                                <Text style={styles.statNumber}>{insights.avgLength}</Text>
                                <Text style={styles.statLabel}>Avg Length</Text>
                            </View>
                        </View>
                    </View>

                    {/* Mood Analysis */}
                    {Object.keys(insights.moodStats).length > 0 && (
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Heart size={24} color="#647C90" />
                                <Text style={styles.cardTitle}>Mood Analysis</Text>
                            </View>

                            {/* Mood Distribution Pie Chart */}
                            {getMoodPieData().length > 0 && (
                                <View style={styles.chartContainer}>
                                    <Text style={styles.chartTitle}>Mood Distribution</Text>
                                    <View style={styles.pieChartWrapper}>
                                        <PieChart
                                            style={{ height: 200, width: 200 }}
                                            data={getMoodPieData()}
                                            innerRadius={'40%'}
                                            padAngle={0.02}
                                        />
                                        <View style={styles.pieChartCenter}>
                                            <Text style={styles.pieChartCenterText}>
                                                {insights.totalEntries}
                                            </Text>
                                            <Text style={styles.pieChartCenterLabel}>Total</Text>
                                        </View>
                                    </View>
                                    <View style={styles.pieLegend}>
                                        {Object.entries(insights.moodStats).map(([mood, count]) => (
                                            <View key={mood} style={styles.legendItem}>
                                                <View
                                                    style={[
                                                        styles.legendColor,
                                                        { backgroundColor: getMoodColor(mood) }
                                                    ]}
                                                />
                                                <Text style={styles.legendText}>
                                                    {mood.charAt(0).toUpperCase() + mood.slice(1)} ({count})
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}

                            {/* Detailed Mood Stats */}
                            <View style={styles.moodContainer}>
                                <Text style={styles.dominantMood}>
                                    Most Common Mood: {getMoodEmoji(insights.mostCommonMood)} {insights.mostCommonMood.charAt(0).toUpperCase() + insights.mostCommonMood.slice(1)}
                                </Text>
                                <View style={styles.moodList}>
                                    {Object.entries(insights.moodStats)
                                        .sort((a, b) => b[1] - a[1])
                                        .map(([mood, count]) => (
                                            <View key={mood} style={styles.moodItem}>
                                                <Text style={styles.moodEmoji}>{getMoodEmoji(mood)}</Text>
                                                <Text style={styles.moodName}>
                                                    {mood.charAt(0).toUpperCase() + mood.slice(1)}
                                                </Text>
                                                <View style={styles.moodBar}>
                                                    <View
                                                        style={[
                                                            styles.moodBarFill,
                                                            {
                                                                width: `${(count / insights.totalEntries) * 100}%`,
                                                                backgroundColor: getMoodColor(mood)
                                                            }
                                                        ]}
                                                    />
                                                </View>
                                                <Text style={styles.moodCount}>{count}</Text>
                                                <Text style={styles.moodPercentage}>
                                                    {((count / insights.totalEntries) * 100).toFixed(0)}%
                                                </Text>
                                            </View>
                                        ))}
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Writing Patterns */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <BarChart3 size={24} color="#647C90" />
                            <Text style={styles.cardTitle}>Writing Patterns</Text>
                        </View>
                        <View style={styles.patternsGrid}>
                            <View style={styles.patternItem}>
                                <Text style={styles.patternValue}>
                                    {insights.avgLength}
                                </Text>
                                <Text style={styles.patternLabel}>Avg Length</Text>
                            </View>
                            <View style={styles.patternItem}>
                                <Text style={styles.patternValue}>
                                    {insights.favoriteTime}
                                </Text>
                                <Text style={styles.patternLabel}>Favorite Time</Text>
                            </View>
                        </View>

                        {/* Time of Day Chart */}
                        {Object.keys(insights.timeStats).length > 0 && (
                            <View style={styles.chartContainer}>
                                <Text style={styles.chartTitle}>Entries by Time of Day</Text>
                                <BarChart
                                    style={{ height: 200, width: screenWidth - 80 }}
                                    data={getTimeBarData()}
                                    contentInset={{ top: 20, bottom: 20, left: 10, right: 10 }}
                                    spacing={0.2}
                                    gridMin={0}
                                />
                                <View style={styles.barChartLabels}>
                                    {['Morning', 'Afternoon', 'Evening', 'Night'].map((time, index) => (
                                        <Text key={index} style={styles.barChartLabel}>{time}</Text>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>

                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <BookOpen size={24} color="#647C90" />
                            <Text style={styles.cardTitle}>Entries by Category</Text>
                        </View>
                        {Object.entries(insights.entriesByPath).map(([path, entries]) => (
                            <View key={path} style={styles.pathSection}>
                                <Text style={styles.pathTitle}>{formatPathTag(path)}</Text>
                                <Text style={styles.pathCount}>{entries.length} entries</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Calendar size={24} color="#647C90" />
                            <Text style={styles.cardTitle}>Recent Entries</Text>
                        </View>
                        {journalEntries.slice(0, 3).map((entry) => (
                            <View key={entry.id} style={styles.entryPreview}>
                                <View style={styles.entryPreviewHeader}>
                                    <Text style={styles.entryPath}>{formatPathTag(entry.pathTag)}</Text>
                                    {entry.mood && (
                                        <Text style={styles.entryMood}>{getMoodEmoji(entry.mood)}</Text>
                                    )}
                                </View>
                                <Text style={styles.entryContent} numberOfLines={2}>
                                    {entry.content}
                                </Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.exportCard}>
                        <Download size={32} color="#647C90" />
                        <Text style={styles.exportTitle}>Share Your Progress</Text>
                        <Text style={styles.exportText}>
                            Export and share your journal insights with others or keep for your records.
                        </Text>
                        <TouchableOpacity style={styles.exportButtonLarge} onPress={exportReport}>
                            <Share2 size={20} color="#E2DED0" />
                            <Text style={styles.exportButtonText}>Export Report</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.completionCard}>
                        <Sparkles size={32} color="#E2DED0" />
                        <Text style={styles.completionTitle}>Congratulations! 🎉</Text>
                        <Text style={styles.completionText}>
                            You've completed the "Discover Your Dream Life" path. Keep journaling to track your continued growth and insights!
                        </Text>
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
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        marginTop: 100,
    },
    loadingText: {
        fontSize: 16,
        color: '#746C70',
        textAlign: 'center',
    },
    emptyTitle: {
        fontSize: 24,
        color: '#647C90',
        fontWeight: '700',
        marginTop: 20,
        marginBottom: 12,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#928490',
        textAlign: 'center',
        lineHeight: 24,
    },
    progressContainer: {
        marginTop: 20,
        width: '100%',
    },
    progressBar: {
        height: 8,
        backgroundColor: '#E2DED0',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#647C90',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 14,
        color: '#928490',
        textAlign: 'center',
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
        marginTop: 60,
    },
    content: {
        paddingHorizontal: 24,
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
        fontSize: 25,
        fontWeight: '700',
        color: '#E2DED0',
        textAlign: 'center',
    },
    exportButton: {
        padding: 4,
    },
    reportTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 8,
    },
    reportSubtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 30,
    },
    summaryCard: {
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    summaryTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#647C90',
        marginLeft: 8,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statBox: {
        flex: 1,
        backgroundColor: '#E2DED0',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '700',
        color: '#647C90',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#928490',
        fontWeight: '500',
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#647C90',
        marginLeft: 8,
    },
    chartContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4E4F50',
        marginBottom: 16,
        textAlign: 'center',
    },
    pieChartWrapper: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    pieChartCenter: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pieChartCenterText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#4E4F50',
    },
    pieChartCenterLabel: {
        fontSize: 12,
        color: '#928490',
        marginTop: 2,
    },
    pieLegend: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 8,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 8,
        marginVertical: 4,
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 6,
    },
    legendText: {
        fontSize: 12,
        color: '#4E4F50',
        fontWeight: '500',
    },
    moodContainer: {
        marginTop: 12,
    },
    dominantMood: {
        fontSize: 18,
        fontWeight: '600',
        color: '#4E4F50',
        marginBottom: 16,
        textAlign: 'center',
    },
    moodList: {
        marginTop: 8,
    },
    moodItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    moodEmoji: {
        fontSize: 20,
        width: 24,
    },
    moodName: {
        fontSize: 12,
        color: '#4E4F50',
        fontWeight: '500',
        width: 60,
        marginLeft: 8,
    },
    moodBar: {
        flex: 1,
        height: 6,
        backgroundColor: '#E2DED0',
        borderRadius: 3,
        overflow: 'hidden',
        marginLeft: 8,
    },
    moodBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    moodCount: {
        fontSize: 12,
        color: '#928490',
        fontWeight: '600',
        width: 20,
        textAlign: 'right',
        marginLeft: 8,
    },
    moodPercentage: {
        fontSize: 10,
        color: '#928490',
        fontWeight: '500',
        width: 35,
        textAlign: 'right',
        marginLeft: 4,
    },
    patternsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    patternItem: {
        flex: 1,
        backgroundColor: '#E2DED0',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    patternValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#647C90',
        marginBottom: 4,
    },
    patternLabel: {
        fontSize: 12,
        color: '#928490',
        fontWeight: '500',
        textAlign: 'center',
    },
    barChartLabels: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: screenWidth - 80,
        marginTop: 8,
    },
    barChartLabel: {
        fontSize: 11,
        color: '#4E4F50',
        fontWeight: '500',
    },
    pathSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E2DED0',
    },
    pathTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4E4F50',
    },
    pathCount: {
        fontSize: 14,
        color: '#928490',
        fontWeight: '500',
    },
    entryPreview: {
        backgroundColor: '#E2DED0',
        borderRadius: 12,
        padding: 16,
        marginTop: 12,
    },
    entryPreviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    entryPath: {
        fontSize: 13,
        color: '#647C90',
        fontWeight: '600',
    },
    entryMood: {
        fontSize: 20,
    },
    entryContent: {
        fontSize: 14,
        color: '#4E4F50',
        lineHeight: 20,
    },
    exportCard: {
        backgroundColor: '#647C90',
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    exportTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#E2DED0',
        marginTop: 12,
        marginBottom: 8,
        textAlign: 'center',
    },
    exportText: {
        fontSize: 14,
        color: '#E2DED0',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },
    exportButtonLarge: {
        flexDirection: 'row',
        backgroundColor: '#928490',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    exportButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#E2DED0',
        marginLeft: 8,
    },
    completionCard: {
        backgroundColor: '#928490',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    completionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#E2DED0',
        marginTop: 12,
        marginBottom: 8,
        textAlign: 'center',
    },
    completionText: {
        fontSize: 14,
        color: '#E2DED0',
        textAlign: 'center',
        lineHeight: 20,
    },
}); 