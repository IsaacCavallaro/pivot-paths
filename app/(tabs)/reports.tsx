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
import {
    ArrowLeft,
    TrendingUp,
    Calendar,
    Heart,
    BookOpen,
    Sparkles,
    BarChart3,
    Download,
    Share2,
    ChevronRight
} from 'lucide-react-native';
import { PieChart } from 'react-native-svg-charts';

import { useStorage } from '@/hooks/useStorage';
import { STORAGE_KEYS } from '@/utils/storageKeys';
import { storageService } from '@/utils/storageService';
import { MOOD_OPTIONS } from '@/utils/constants';

interface JournalEntry {
    id: string;
    pathTag: string;
    day: string; // Changed from number to string
    date: string; // Added date field
    content: string;
    mood?: string;
    timestamp: number; // This field is not in utils/interfaces.ts, but seems to be used here. I will keep it for now.
}

interface MoodStats {
    [key: string]: number;
}

interface CompletedPath {
    categoryId: string;
    pathId: string;
    pathName: string;
    completedDays: number;
    totalDays: number;
    completionDate: number;
}

// Add interfaces for the quiz results
interface DreamerResult {
    type: string;
    title: string;
    description: string;
    subtitle: string;
    color: string;
}

interface ValuesResult {
    primaryValue: string;
    title: string;
    description: string;
    color: string;
}

interface CuriosityResult {
    // Add the structure for curiosity result based on your data
    [key: string]: any;
}

// ADD INTERFACES FOR ENERGY AUDIT RESULTS
interface EnergyAuditResult {
    title?: string;
    description?: string;
    subtitle?: string;
    color?: string;
    [key: string]: any;
}

interface ReflectAndAdjustResult {
    title?: string;
    description?: string;
    subtitle?: string;
    color?: string;
    [key: string]: any;
}

// ADD INTERFACE FOR WHAT ENERGIZES YOU RESULT
interface WhatEnergizesYouResult {
    title?: string;
    description?: string;
    subtitle?: string;
    color?: string;
    [key: string]: any;
}

// ADD INTERFACE FOR DAY2 LEARNING STYLE RESULT
interface Day2LearningStyleResult {
    title?: string;
    description?: string;
    subtitle?: string;
    color?: string;
    [key: string]: any;
}

// ADD INTERFACE FOR DAY2 MONEY MINDSET RESULT
interface Day2MoneyMindsetResult {
    title?: string;
    description?: string;
    subtitle?: string;
    color?: string;
    [key: string]: any;
}

const screenWidth = Dimensions.get('window').width;

// Helper functions moved outside to avoid initialization issues
const formatPathTag = (pathTag: string): string => {
    if (!pathTag) return 'General';
    return pathTag
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const getMoodIcon = (mood: string) => {
    const moodOption = MOOD_OPTIONS.find(m => m.id === mood);
    return moodOption ? moodOption.icon : null;
};

const getMoodColor = (mood: string): string => {
    const moodOption = MOOD_OPTIONS.find(m => m.id === mood);
    return moodOption ? moodOption.color : '#928490';
};

const getMoodLabel = (mood: string): string => {
    const moodOption = MOOD_OPTIONS.find(m => m.id === mood);
    return moodOption ? moodOption.label : 'Neutral';
};

export default function ReportsScreen() {
    const router = useRouter();
    const [isPathCompleted, setIsPathCompleted] = useState(false);
    const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [completedDays, setCompletedDays] = useState(0);
    const [completedPaths, setCompletedPaths] = useState<CompletedPath[]>([]);
    const [selectedPath, setSelectedPath] = useState<CompletedPath | null>(null);

    // State variables for quiz results - with proper typing
    const [dreamBiggerChoices, setDreamBiggerChoices] = useState<{ [key: string]: string }>({});
    const [mythBusterMatchedPairs, setMythBusterMatchedPairs] = useState<number[]>([]);
    const [skillsQuizResult, setSkillsQuizResult] = useState<DreamerResult | null>(null);
    const [roleplayScenarioChoice, setRoleplayScenarioChoice] = useState<string | null>(null);
    const [valuesDiscoveryResult, setValuesDiscoveryResult] = useState<ValuesResult | null>(null);
    const [curiosityResult, setCuriosityResult] = useState<CuriosityResult | null>(null);
    // ADD STATE FOR ENERGY AUDIT RESULTS
    const [energyAuditResult, setEnergyAuditResult] = useState<EnergyAuditResult | null>(null);
    const [reflectAndAdjustResult, setReflectAndAdjustResult] = useState<ReflectAndAdjustResult | null>(null);
    // ADD STATE FOR WHAT ENERGIZES YOU RESULT
    const [whatEnergizesYouResult, setWhatEnergizesYouResult] = useState<WhatEnergizesYouResult | null>(null);
    // ADD STATE FOR DAY2 LEARNING STYLE RESULT
    const [day2LearningStyleResult, setDay2LearningStyleResult] = useState<Day2LearningStyleResult | null>(null);
    // ADD STATE FOR DAY2 MONEY MINDSET RESULT
    const [day2MoneyMindsetResult, setDay2MoneyMindsetResult] = useState<Day2MoneyMindsetResult | null>(null);

    useFocusEffect(
        useCallback(() => {
            loadReportData();
        }, [])
    );

    const formatPathIdToName = (pathId: string): string => {
        return pathId
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const loadReportData = async () => {
        try {
            setLoading(true);

            const categoryId = 'mindset';
            const pathId = 'discover-dream-life';
            const progressKey = `${categoryId}_${pathId}`;

            const savedProgress = await storageService.load<Record<string, number>>(STORAGE_KEYS.PATH_PROGRESS);
            const progressData = savedProgress || {};
            const currentCompletedDays = progressData[progressKey] || 0;
            setCompletedDays(currentCompletedDays);

            const pathCompleted = currentCompletedDays >= 7;
            setIsPathCompleted(pathCompleted);

            // Load all completed paths
            const completedPathsList: CompletedPath[] = [];
            Object.entries(progressData).forEach(([key, daysValue]) => {
                const [catId, pathId] = key.split('_');
                const totalDays = 7; // Assuming all paths have 7 days for now
                const days = daysValue as number; // Explicitly cast to number
                if (days >= totalDays) {
                    completedPathsList.push({
                        categoryId: catId,
                        pathId: pathId,
                        pathName: formatPathIdToName(pathId),
                        completedDays: days,
                        totalDays,
                        completionDate: Date.now() // You might want to store actual completion date
                    });
                }
            });
            setCompletedPaths(completedPathsList);

            // Load journal entries
            const rawEntries = await storageService.load<JournalEntry[]>(STORAGE_KEYS.JOURNAL_ENTRIES);
            if (rawEntries) {
                setJournalEntries(rawEntries);
            }

            // Load additional data from STORAGE_KEYS
            const loadedDreamBiggerChoices = await storageService.load<{ [key: string]: string }>(STORAGE_KEYS.DREAM_BIGGER_CHOICES);
            if (loadedDreamBiggerChoices) {
                setDreamBiggerChoices(loadedDreamBiggerChoices);
            }

            const loadedMythBusterMatchedPairs = await storageService.load<number[]>(STORAGE_KEYS.MYTH_BUSTER_MATCHED_PAIRS);
            if (loadedMythBusterMatchedPairs) {
                setMythBusterMatchedPairs(loadedMythBusterMatchedPairs);
            }

            const loadedSkillsQuizResult = await storageService.load<DreamerResult>(STORAGE_KEYS.DAY1_SKILLS_QUIZ_RESULT);
            if (loadedSkillsQuizResult) {
                setSkillsQuizResult(loadedSkillsQuizResult);
            }

            const loadedRoleplayScenarioChoice = await storageService.load<string>(STORAGE_KEYS.ROLEPLAY_SCENARIO_CHOICE);
            if (loadedRoleplayScenarioChoice) {
                setRoleplayScenarioChoice(loadedRoleplayScenarioChoice);
            }

            const loadedValuesDiscoveryResult = await storageService.load<ValuesResult>(STORAGE_KEYS.VALUES_DISCOVERY_RESULT);
            if (loadedValuesDiscoveryResult) {
                setValuesDiscoveryResult(loadedValuesDiscoveryResult);
            }

            const loadedCuriosityResult = await storageService.load<CuriosityResult>(STORAGE_KEYS.DAY7_CURIOSITY_RESULT);
            if (loadedCuriosityResult) {
                setCuriosityResult(loadedCuriosityResult);
            }

            // ADD LOADING FOR ENERGY AUDIT RESULTS
            const loadedEnergyAuditResult = await storageService.load<EnergyAuditResult>(STORAGE_KEYS.DAY1_ENERGY_AUDIT_RESULT);
            if (loadedEnergyAuditResult) {
                setEnergyAuditResult(loadedEnergyAuditResult);
            }

            const loadedReflectAndAdjustResult = await storageService.load<ReflectAndAdjustResult>(STORAGE_KEYS.DAY7_REFLECT_AND_ADJUST);
            if (loadedReflectAndAdjustResult) {
                setReflectAndAdjustResult(loadedReflectAndAdjustResult);
            }

            // ADD LOADING FOR WHAT ENERGIZES YOU RESULT
            const loadedWhatEnergizesYouResult = await storageService.load<WhatEnergizesYouResult>(STORAGE_KEYS.WHAT_ENERGIZES_YOU_RESULT);
            if (loadedWhatEnergizesYouResult) {
                setWhatEnergizesYouResult(loadedWhatEnergizesYouResult);
            }

            // ADD LOADING FOR DAY2 LEARNING STYLE RESULT
            const loadedDay2LearningStyleResult = await storageService.load<Day2LearningStyleResult>(STORAGE_KEYS.DAY2_LEARNING_STYLE_RESULT);
            if (loadedDay2LearningStyleResult) {
                setDay2LearningStyleResult(loadedDay2LearningStyleResult);
            }

            // ADD LOADING FOR DAY2 MONEY MINDSET RESULT
            const loadedDay2MoneyMindsetResult = await storageService.load<Day2MoneyMindsetResult>(STORAGE_KEYS.DAY2_MONEY_MINDSET_RESULT);
            if (loadedDay2MoneyMindsetResult) {
                setDay2MoneyMindsetResult(loadedDay2MoneyMindsetResult);
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
        if (selectedPath) {
            setSelectedPath(null);
        } else {
            router.push('/(tabs)');
        }
    };

    const handlePathSelect = (path: CompletedPath) => {
        setSelectedPath(path);
    };

    // Filter journal entries for the selected path - UPDATED
    const getFilteredJournalEntries = useMemo(() => {
        if (!selectedPath) return [];

        // Use the path title for more accurate filtering
        const selectedPathTitle = selectedPath.pathName.toLowerCase();

        return journalEntries.filter(entry => {
            if (!entry.pathTitle && !entry.pathTag) return false;

            const entryPathTitle = (entry.pathTitle || '').toLowerCase();
            const entryPathTag = (entry.pathTag || '').toLowerCase();

            // Match by path title (most accurate) or fallback to path tag
            return entryPathTitle === selectedPathTitle ||
                entryPathTitle.includes(selectedPathTitle) ||
                selectedPathTitle.includes(entryPathTitle) ||
                entryPathTag === selectedPath.pathId.toLowerCase();
        });
    }, [journalEntries, selectedPath]);

    const getMoodStats = (): MoodStats => {
        const stats: MoodStats = {};
        const entries = getFilteredJournalEntries;
        entries.forEach(entry => {
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
        const entries = getFilteredJournalEntries;

        // For selected path reports, we only show entries from that specific path
        if (selectedPath) {
            byPath[selectedPath.pathName] = entries;
        } else {
            // Fallback: group by path tag if no specific path selected
            entries.forEach(entry => {
                const path = entry.pathTag || 'general';
                if (!byPath[path]) {
                    byPath[path] = [];
                }
                byPath[path].push(entry);
            });
        }
        return byPath;
    };

    const getInsights = () => {
        const entries = getFilteredJournalEntries;
        const totalEntries = entries.length;
        const moodStats = getMoodStats();
        const mostCommonMood = getMostCommonMood();
        const entriesByPath = getEntriesByPath();
        const pathCount = Object.keys(entriesByPath).length;

        const entryLengths = entries.map(entry => entry.content.length);
        const avgLength = entryLengths.length > 0 ?
            Math.round(entryLengths.reduce((a, b) => a + b, 0) / entryLengths.length) : 0;

        return {
            totalEntries,
            moodStats,
            mostCommonMood,
            entriesByPath,
            pathCount,
            avgLength,
        };
    };

    const insights = useMemo(() => getInsights(), [getFilteredJournalEntries]);

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

    const exportReport = async () => {
        try {
            // Build mood distribution section
            const moodDistributionText = Object.entries(insights.moodStats).length > 0
                ? `Mood Distribution:\n${Object.entries(insights.moodStats)
                    .map(([mood, count]) => `${getMoodLabel(mood)}: ${count} entries (${((count / insights.totalEntries) * 100).toFixed(0)}%)`)
                    .join('\n')}`
                : 'Mood Distribution: No data available';

            // Build dreamer profile section
            const dreamerProfileText = skillsQuizResult || valuesDiscoveryResult
                ? `\n${skillsQuizResult ? `Dreamer Type: ${skillsQuizResult.title}\n${skillsQuizResult.description}` : ''}${valuesDiscoveryResult ? `\nCore Values: ${valuesDiscoveryResult.title}\n${valuesDiscoveryResult.description}` : ''}`
                : ' No data available';

            const reportText = `
Your Journal Insights Report - ${selectedPath?.pathName || 'All Journeys'}
============================

${moodDistributionText}

${dreamerProfileText}

Keep up the great work on your pivot journey!
        `.trim();

            await Share.share({
                message: reportText,
                title: `${selectedPath?.pathName || 'Journal'} Insights Report`
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to export report');
        }
    };

    const renderDreamerProfile = () => {
        if (!skillsQuizResult && !valuesDiscoveryResult) {
            return null;
        }

        return (
            <View style={styles.card}>
                <View style={styles.profileContainer}>
                    {/* Skills Quiz Result */}
                    {skillsQuizResult && (
                        <View style={styles.quizResultSection}>
                            <Text style={styles.profileSectionTitle}>Dreamer Type</Text>
                            <View style={[styles.resultCard, { borderLeftColor: skillsQuizResult.color || '#928490' }]}>
                                <Text style={styles.resultTitle}>{skillsQuizResult.title}</Text>
                                <Text style={styles.resultDescription}>{skillsQuizResult.description}</Text>
                                {skillsQuizResult.subtitle && (
                                    <View style={styles.subtitleContainer}>
                                        <Text style={styles.resultSubtitle}>{skillsQuizResult.subtitle}</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    )}

                    {/* Values Discovery Result */}
                    {valuesDiscoveryResult && (
                        <View style={styles.quizResultSection}>
                            <Text style={styles.profileSectionTitle}>Core Values</Text>
                            <View style={[styles.resultCard, { borderLeftColor: valuesDiscoveryResult.color || '#647C90' }]}>
                                <Text style={styles.resultTitle}>{valuesDiscoveryResult.title}</Text>
                                <Text style={styles.resultDescription}>{valuesDiscoveryResult.description}</Text>
                            </View>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    const renderCuriosityResult = () => {
        if (!curiosityResult) {
            return null;
        }

        return (
            <View style={styles.card}>
                <View style={styles.profileContainer}>
                    <View style={styles.quizResultSection}>
                        <Text style={styles.profileSectionTitle}>Curiosity Assessment</Text>
                        <View style={[styles.resultCard, { borderLeftColor: '#647C90' }]}>
                            <Text style={styles.resultTitle}>
                                {curiosityResult.title || 'Your Curiosity Profile'}
                            </Text>
                            <Text style={styles.resultDescription}>
                                {curiosityResult.description || 'Curiosity assessment completed'}
                            </Text>
                            {curiosityResult.subtitle && (
                                <View style={styles.subtitleContainer}>
                                    <Text style={styles.resultSubtitle}>{curiosityResult.subtitle}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const renderEnergyAuditResult = () => {
        if (!energyAuditResult && !reflectAndAdjustResult) {
            return null;
        }

        return (
            <View style={styles.card}>
                <View style={styles.profileContainer}>
                    {/* Energy Audit Result */}
                    {energyAuditResult && (
                        <View style={styles.quizResultSection}>
                            <Text style={styles.profileSectionTitle}>Energy Audit</Text>
                            <View style={[styles.resultCard, { borderLeftColor: energyAuditResult.color || '#647C90' }]}>
                                <Text style={styles.resultTitle}>
                                    {energyAuditResult.title || 'Your Energy Profile'}
                                </Text>
                                <Text style={styles.resultDescription}>
                                    {energyAuditResult.description || 'Energy audit assessment completed'}
                                </Text>
                                {energyAuditResult.subtitle && (
                                    <View style={styles.subtitleContainer}>
                                        <Text style={styles.resultSubtitle}>{energyAuditResult.subtitle}</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    )}

                    {/* Reflect and Adjust Result */}
                    {reflectAndAdjustResult && (
                        <View style={styles.quizResultSection}>
                            <Text style={styles.profileSectionTitle}>Reflect & Adjust</Text>
                            <View style={[styles.resultCard, { borderLeftColor: reflectAndAdjustResult.color || '#647C90' }]}>
                                <Text style={styles.resultTitle}>
                                    {reflectAndAdjustResult.title || 'Your Reflection'}
                                </Text>
                                <Text style={styles.resultDescription}>
                                    {reflectAndAdjustResult.description || 'Reflection and adjustment completed'}
                                </Text>
                                {reflectAndAdjustResult.subtitle && (
                                    <View style={styles.subtitleContainer}>
                                        <Text style={styles.resultSubtitle}>{reflectAndAdjustResult.subtitle}</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    // ADD FUNCTION TO RENDER WHAT ENERGIZES YOU RESULT
    const renderWhatEnergizesYouResult = () => {
        if (!whatEnergizesYouResult) {
            return null;
        }

        return (
            <View style={styles.card}>
                <View style={styles.profileContainer}>
                    <View style={styles.quizResultSection}>
                        <Text style={styles.profileSectionTitle}>What Energizes You</Text>
                        <View style={[styles.resultCard, { borderLeftColor: whatEnergizesYouResult.color || '#647C90' }]}>
                            <Text style={styles.resultTitle}>
                                {whatEnergizesYouResult.title || 'Your Energy Profile'}
                            </Text>
                            <Text style={styles.resultDescription}>
                                {whatEnergizesYouResult.description || 'Energy assessment completed'}
                            </Text>
                            {whatEnergizesYouResult.subtitle && (
                                <View style={styles.subtitleContainer}>
                                    <Text style={styles.resultSubtitle}>{whatEnergizesYouResult.subtitle}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    // ADD FUNCTION TO RENDER DAY2 LEARNING STYLE RESULT
    const renderDay2LearningStyleResult = () => {
        if (!day2LearningStyleResult) {
            return null;
        }

        return (
            <View style={styles.card}>
                <View style={styles.profileContainer}>
                    <View style={styles.quizResultSection}>
                        <Text style={styles.profileSectionTitle}>Learning Style</Text>
                        <View style={[styles.resultCard, { borderLeftColor: day2LearningStyleResult.color || '#647C90' }]}>
                            <Text style={styles.resultTitle}>
                                {day2LearningStyleResult.title || 'Your Learning Style'}
                            </Text>
                            <Text style={styles.resultDescription}>
                                {day2LearningStyleResult.description || 'Learning style assessment completed'}
                            </Text>
                            {day2LearningStyleResult.subtitle && (
                                <View style={styles.subtitleContainer}>
                                    <Text style={styles.resultSubtitle}>{day2LearningStyleResult.subtitle}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    // ADD FUNCTION TO RENDER DAY2 MONEY MINDSET RESULT
    const renderDay2MoneyMindsetResult = () => {
        if (!day2MoneyMindsetResult) {
            return null;
        }

        return (
            <View style={styles.card}>
                <View style={styles.profileContainer}>
                    <View style={styles.quizResultSection}>
                        <Text style={styles.profileSectionTitle}>Money Mindset</Text>
                        <View style={[styles.resultCard, { borderLeftColor: day2MoneyMindsetResult.color || '#647C90' }]}>
                            <Text style={styles.resultTitle}>
                                {day2MoneyMindsetResult.title || 'Your Money Mindset'}
                            </Text>
                            <Text style={styles.resultDescription}>
                                {day2MoneyMindsetResult.description || 'Money mindset assessment completed'}
                            </Text>
                            {day2MoneyMindsetResult.subtitle && (
                                <View style={styles.subtitleContainer}>
                                    <Text style={styles.resultSubtitle}>{day2MoneyMindsetResult.subtitle}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    // Conditionally render the appropriate component based on path name - UPDATED
    const renderPathSpecificContent = () => {
        if (!selectedPath) return null;

        if (selectedPath.pathName === 'Mindset Shift') {
            return renderCuriosityResult();
        } else if (selectedPath.pathName === 'Discover Dream Life') {
            return renderDreamerProfile();
        } else if (selectedPath.pathName === 'Work Life Balance') {
            return renderEnergyAuditResult();
        } else if (selectedPath.pathName === 'Map Your Direction') {
            return renderWhatEnergizesYouResult();
        } else if (selectedPath.pathName === 'Upskilling Pathfinder') {
            return renderDay2LearningStyleResult();
        } else if (selectedPath.pathName === 'Money Mindsets') {
            return renderDay2MoneyMindsetResult();
        }

        return null;
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
                            <Text style={styles.titleText}>
                                {selectedPath ? selectedPath.pathName : 'Reports'}
                            </Text>
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

    if (!isPathCompleted && completedPaths.length === 0) {
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
                        Complete a path to unlock your personalized journal insights report.
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
                    </View>
                </View>
            </View>
        );
    }

    // Show detailed report when a path is selected
    if (selectedPath) {
        return (
            <View style={styles.container}>
                <View style={[styles.stickyHeader, { backgroundColor: '#647C90' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>{selectedPath.pathName}</Text>
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
                                                        {getMoodLabel(mood)} ({count})
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                )}

                                {/* Detailed Mood Stats */}
                                <View style={styles.moodContainer}>
                                    <Text style={styles.dominantMood}>
                                        Most Common Mood: {getMoodLabel(insights.mostCommonMood)}
                                    </Text>
                                    <View style={styles.moodList}>
                                        {Object.entries(insights.moodStats)
                                            .sort((a, b) => b[1] - a[1])
                                            .map(([mood, count]) => {
                                                const MoodIcon = getMoodIcon(mood);
                                                return (
                                                    <View key={mood} style={styles.moodItem}>
                                                        {MoodIcon && <MoodIcon size={20} color={getMoodColor(mood)} />}
                                                        <Text style={styles.moodName}>
                                                            {getMoodLabel(mood)}
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
                                                );
                                            })}
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Conditionally render path-specific content */}
                        {renderPathSpecificContent()}

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
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Show completed paths list (no detailed reports visible)
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
                    {/* Completed Paths List */}
                    {completedPaths.length > 0 && (
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Sparkles size={24} color="#647C90" />
                                <Text style={styles.cardTitle}>Completed Journeys</Text>
                            </View>
                            <Text style={styles.completedPathsDescription}>
                                Tap on a completed journey to view your results and insights.
                            </Text>
                            {completedPaths.map((path, index) => (
                                <TouchableOpacity
                                    key={`${path.categoryId}_${path.pathId}`}
                                    style={[
                                        styles.pathItem,
                                        index < completedPaths.length - 1 && styles.pathItemBorder
                                    ]}
                                    onPress={() => handlePathSelect(path)}
                                >
                                    <View style={styles.pathItemContent}>
                                        <View style={styles.pathInfo}>
                                            <Text style={styles.pathName}>{path.pathName}</Text>
                                            <Text style={styles.pathCompletion}>
                                                Completed {new Date(path.completionDate).toLocaleDateString()}
                                            </Text>
                                        </View>
                                        <View style={styles.pathStats}>
                                            <Text style={styles.pathDays}>
                                                {path.completedDays}/{path.totalDays} days
                                            </Text>
                                            <ChevronRight size={20} color="#647C90" />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
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
    completedPathsDescription: {
        fontSize: 14,
        color: '#928490',
        marginBottom: 16,
        lineHeight: 20,
    },
    pathItem: {
        paddingVertical: 16,
    },
    pathItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#E2DED0',
    },
    pathItemContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    pathInfo: {
        flex: 1,
    },
    pathName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4E4F50',
        marginBottom: 4,
    },
    pathCompletion: {
        fontSize: 12,
        color: '#928490',
    },
    pathStats: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pathDays: {
        fontSize: 14,
        color: '#647C90',
        fontWeight: '500',
        marginRight: 8,
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
    moodName: {
        fontSize: 12,
        color: '#4E4F50',
        fontWeight: '500',
        width: 80,
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
    rawDataContainer: {
        marginTop: 10,
        backgroundColor: '#E2DED0',
        borderRadius: 12,
        padding: 15,
    },
    rawDataLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4E4F50',
        marginTop: 10,
        marginBottom: 5,
    },
    rawDataContent: {
        fontSize: 14,
        color: '#746C70',
        fontFamily: 'monospace',
        backgroundColor: '#F5F5F5',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    profileContainer: {
        marginTop: 10,
    },
    profileItem: {
        marginBottom: 15,
    },
    profileLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4E4F50',
        marginBottom: 5,
    },
    profileValue: {
        fontSize: 14,
        color: '#746C70',
        backgroundColor: '#E2DED0',
        padding: 10,
        borderRadius: 8,
    },
    valuesList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5,
    },
    valueTag: {
        backgroundColor: '#647C90',
        color: '#E2DED0',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
        fontSize: 13,
        fontWeight: '500',
    },
    quizResultSection: {
        marginBottom: 20,
    },
    profileSectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#647C90',
        marginBottom: 12,
    },
    resultCard: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#928490',
        marginBottom: 12,
    },
    resultTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#4E4F50',
        marginBottom: 8,
    },
    resultDescription: {
        fontSize: 14,
        color: '#746C70',
        lineHeight: 20,
        marginBottom: 8,
    },
    resultSubtitle: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#928490',
        lineHeight: 20,
    },
    subtitleContainer: {
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
    },
    valueTagContainer: {
        marginTop: 8,
    },
    insightSection: {
        backgroundColor: 'rgba(100, 124, 144, 0.1)',
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
    },
    insightTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#647C90',
        marginBottom: 8,
    },
    insightText: {
        fontSize: 14,
        color: '#4E4F50',
        lineHeight: 20,
        fontStyle: 'italic',
    },
});