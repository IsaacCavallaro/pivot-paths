import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { ChevronRight, AlertTriangle, ArrowLeft, ChevronLeft, Plane, Briefcase, Heart, Check } from 'lucide-react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { useStorage } from '@/hooks/useStorage';
import { STORAGE_KEYS } from '@/utils/storageKeys';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';

interface EmergencyProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function Emergency({ onComplete, onBack }: EmergencyProps) {
    const [currentScreen, setCurrentScreen] = useState(-1);
    const { scrollViewRef, scrollToTop } = useScrollToTop();
    const [selectedChoice, setSelectedChoice] = useStorage<number | null>('EMERGENCY_SCENARIO_CHOICE', null);
    const [currentScenario, setCurrentScenario] = useStorage<number>('EMERGENCY_CURRENT_SCENARIO', 1);

    const handleStart = () => {
        setCurrentScreen(0);
        scrollToTop();
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        }
    };

    const goBack = () => {
        if (currentScreen === -1) {
            if (onBack) onBack();
        } else if (currentScreen === 0) {
            setCurrentScreen(-1);
        } else if (currentScreen === 1) {
            setCurrentScreen(0);
        } else if (currentScreen > 1 && currentScreen <= 12) {
            setCurrentScreen(currentScreen - 1);
        }
        scrollToTop();
    };

    const handleChoiceSelect = async (choiceNumber: number) => {
        await setSelectedChoice(choiceNumber);
        scrollToTop();
    };

    const handleContinue = () => {
        if (currentScreen === 2 && selectedChoice !== null) {
            setCurrentScreen(3);
        } else if (currentScreen === 3) {
            setCurrentScreen(4);
        } else if (currentScreen === 4) {
            setCurrentScreen(5);
        } else if (currentScreen === 5) {
            setCurrentScenario(2);
            setCurrentScreen(6);
        } else if (currentScreen === 6 && selectedChoice !== null) {
            setCurrentScreen(7);
        } else if (currentScreen === 7) {
            setCurrentScenario(3);
            setCurrentScreen(8);
        } else if (currentScreen === 8 && selectedChoice !== null) {
            setCurrentScreen(9);
        } else if (currentScreen === 9) {
            setCurrentScreen(10);
        } else if (currentScreen === 10) {
            setCurrentScreen(11);
        } else if (currentScreen === 11) {
            onComplete();
        } else {
            setCurrentScreen(currentScreen + 1);
        }
        scrollToTop();
    };

    const getResponseText = () => {
        if (currentScenario === 1) {
            switch (selectedChoice) {
                case 1:
                    return "The hustle is real! You're willing to bet on yourself, which is powerful. But starting a potential new job already in debt adds a layer of financial pressure that can dim the excitement.";
                case 2:
                    return "This is the reality for so many artists. The feeling of having to say 'no' to a big break because of money is one of the most frustrating parts of the industry. It can lead to burnout and resentment.";
                case 3:
                    return "Yes! Having a fund specifically for career opportunities allows you to say 'YES' without a second thought. You can focus 100% on nailing the audition, not on the receipt total.";
                default:
                    return "";
            }
        } else if (currentScenario === 2) {
            switch (selectedChoice) {
                case 1:
                case 2:
                    return "This is the classic trap. Without a buffer, it's incredibly difficult to take the initial leap into a new career, even if it has a much higher earning potential later. You're forced to prioritize short-term survival over long-term growth.";
                case 3:
                    return "This is strategic. Your emergency fund acts as a 'career transition bridge'. It gives you the runway to gain experience, prove your value, and ease into life as a full-time salaried employee without the constant financial anxiety.";
                default:
                    return "";
            }
        } else if (currentScenario === 3) {
            switch (selectedChoice) {
                case 1:
                case 2:
                    return "It's heartbreaking when financial stress compounds a family crisis. The guilt and worry about money can make it impossible to be fully present for your loved ones when they need you most.";
                case 3:
                    return "This is peace of mind. An emergency fund allows you to be there for your family immediately and without hesitation. It protects your relationships and your mental health during life's most difficult moments.";
                default:
                    return "";
            }
        }
        return "";
    };

    // NEW: Day 4 Welcome Screen
    if (currentScreen === -1) {
        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={handleBack} />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            <View style={commonStyles.introIconContainer}>
                                <View style={[styles.introIconGradient, { backgroundColor: '#928490' }]}>
                                    <AlertTriangle size={32} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={commonStyles.introTitle}>Your Financial Safety Net</Text>

                            <Text style={commonStyles.introDescription}>
                                Life is full of surprises. An emergency fund isn't just money in the bank… it's your ticket to handling a crisis with grace, not panic.
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                Let's walk through a few scenarios. Choose what you'd do, and we'll show you how a safety net changes the game.
                            </Text>

                            <View style={styles.celebrationBox}>
                                <Text style={styles.celebrationTitle}>What You'll Explore</Text>
                                <Text style={styles.celebrationItem}>• How to handle unexpected career opportunities</Text>
                                <Text style={styles.celebrationItem}>• Navigating career transitions with confidence</Text>
                                <Text style={styles.celebrationItem}>• Being there for family during emergencies</Text>
                                <Text style={styles.celebrationItem}>• Building financial peace of mind</Text>
                            </View>

                            <Text style={styles.welcomeFooter}>
                                Your emergency fund is more than just savings—it's your freedom to make choices that align with your values, not just your bank account.
                            </Text>

                            <PrimaryButton title="Begin Scenarios" onPress={handleStart} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Scenario 1 Intro
    if (currentScreen === 0) {
        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={goBack} />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            <View style={styles.scenarioIconContainer}>
                                <View style={[styles.scenarioIconGradient, { backgroundColor: '#928490' }]}>
                                    <Plane size={32} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={styles.scenarioTitle}>Scenario 1: The Unexpected Audition</Text>

                            <Text style={styles.scenarioText}>
                                It's a Tuesday afternoon. Your agent calls: there's a last-minute audition for a dream job tomorrow in Los Angeles. Flights and a hotel will cost at least $800. What do you do?
                            </Text>

                            <PrimaryButton title="See Your Options" onPress={handleContinue} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Scenario 1 Choices
    if (currentScreen === 1) {
        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={goBack} />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            <Text style={styles.choicesTitle}>What would you do?</Text>

                            <View style={styles.choicesContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.choiceButton,
                                        selectedChoice === 1 && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => handleChoiceSelect(1)}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.choiceContent}>
                                        {selectedChoice === 1 && (
                                            <View style={styles.selectedIndicator}>
                                                <Check size={16} color="#E2DED0" />
                                            </View>
                                        )}
                                        <Text style={[
                                            styles.choiceText,
                                            selectedChoice === 1 && styles.choiceTextSelected
                                        ]}>
                                            Put it all on a credit card. This opportunity is worth the debt!
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.choiceButton,
                                        selectedChoice === 2 && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => handleChoiceSelect(2)}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.choiceContent}>
                                        {selectedChoice === 2 && (
                                            <View style={styles.selectedIndicator}>
                                                <Check size={16} color="#E2DED0" />
                                            </View>
                                        )}
                                        <Text style={[
                                            styles.choiceText,
                                            selectedChoice === 2 && styles.choiceTextSelected
                                        ]}>
                                            Politely decline. You feel a pit in your stomach, but your bank account is already too tight.
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.choiceButton,
                                        selectedChoice === 3 && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => handleChoiceSelect(3)}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.choiceContent}>
                                        {selectedChoice === 3 && (
                                            <View style={styles.selectedIndicator}>
                                                <Check size={16} color="#E2DED0" />
                                            </View>
                                        )}
                                        <Text style={[
                                            styles.choiceText,
                                            selectedChoice === 3 && styles.choiceTextSelected
                                        ]}>
                                            You check your dedicated "Opportunity Fund", book the trip, and go to bed stress-free.
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <PrimaryButton
                                title="Continue"
                                onPress={handleContinue}
                                disabled={selectedChoice === null}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Scenario 1 Response
    if (currentScreen === 2) {
        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={goBack} />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            <Text style={styles.responseTitle}>Your Choice</Text>

                            <Text style={styles.responseText}>{getResponseText()}</Text>

                            <PrimaryButton title="Continue" onPress={handleContinue} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Scenario 1 Follow-up
    if (currentScreen === 3) {
        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={goBack} />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            <Text style={styles.followUpTitle}>The Big Picture</Text>

                            <Text style={styles.followUpText}>
                                An emergency fund turns a crisis or a huge opportunity into a simple, manageable event. It's the difference between reacting from a place of fear and responding from a place of power.
                            </Text>

                            <PrimaryButton title="Next Scenario" onPress={handleContinue} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Scenario 2 Intro
    if (currentScreen === 4) {
        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={goBack} />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            <View style={styles.scenarioIconContainer}>
                                <View style={[styles.scenarioIconGradient, { backgroundColor: '#928490' }]}>
                                    <Briefcase size={32} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={styles.scenarioTitle}>Scenario 2: The Sudden Career Pivot</Text>

                            <Text style={styles.scenarioText}>
                                You're unexpectedly injured and you've decided to pivot! You land an entry-level interview in a new field. The job offers huge opportunities for growth but initially, it's a pay cut. What's your move?
                            </Text>

                            <PrimaryButton title="See Your Options" onPress={handleContinue} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Scenario 2 Choices
    if (currentScreen === 5) {
        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={goBack} />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            <Text style={styles.choicesTitle}>What would you do?</Text>

                            <View style={styles.choicesContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.choiceButton,
                                        selectedChoice === 1 && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => handleChoiceSelect(1)}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.choiceContent}>
                                        {selectedChoice === 1 && (
                                            <View style={styles.selectedIndicator}>
                                                <Check size={16} color="#E2DED0" />
                                            </View>
                                        )}
                                        <Text style={[
                                            styles.choiceText,
                                            selectedChoice === 1 && styles.choiceTextSelected
                                        ]}>
                                            Panic and decline. You can't afford the pay cut, so you stay in the familiar grind of dance gigs.
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.choiceButton,
                                        selectedChoice === 2 && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => handleChoiceSelect(2)}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.choiceContent}>
                                        {selectedChoice === 2 && (
                                            <View style={styles.selectedIndicator}>
                                                <Check size={16} color="#E2DED0" />
                                            </View>
                                        )}
                                        <Text style={[
                                            styles.choiceText,
                                            selectedChoice === 2 && styles.choiceTextSelected
                                        ]}>
                                            Take the job but pile on extra teaching hours nights/weekends to make ends meet, risking burnout.
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.choiceButton,
                                        selectedChoice === 3 && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => handleChoiceSelect(3)}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.choiceContent}>
                                        {selectedChoice === 3 && (
                                            <View style={styles.selectedIndicator}>
                                                <Check size={16} color="#E2DED0" />
                                            </View>
                                        )}
                                        <Text style={[
                                            styles.choiceText,
                                            selectedChoice === 3 && styles.choiceTextSelected
                                        ]}>
                                            Confidently accept, knowing your emergency fund can cover the income gap for the first year.
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <PrimaryButton
                                title="Continue"
                                onPress={handleContinue}
                                disabled={selectedChoice === null}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Scenario 2 Response
    if (currentScreen === 6) {
        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={goBack} />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            <Text style={styles.responseTitle}>Your Choice</Text>

                            <Text style={styles.responseText}>{getResponseText()}</Text>

                            <PrimaryButton title="Next Scenario" onPress={handleContinue} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Scenario 3 Intro
    if (currentScreen === 7) {
        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={goBack} />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            <View style={styles.scenarioIconContainer}>
                                <View style={[styles.scenarioIconGradient, { backgroundColor: '#928490' }]}>
                                    <Heart size={32} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={styles.scenarioTitle}>Scenario 3: The Family Emergency</Text>

                            <Text style={styles.scenarioText}>
                                You get a call that a parent back home has had a medical emergency. You need to book a last-minute flight across the country and may need to stay for a while to help out. What is your first thought?
                            </Text>

                            <PrimaryButton title="See Your Options" onPress={handleContinue} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Scenario 3 Choices
    if (currentScreen === 8) {
        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={goBack} />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            <Text style={styles.choicesTitle}>What is your first thought?</Text>

                            <View style={styles.choicesContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.choiceButton,
                                        selectedChoice === 1 && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => handleChoiceSelect(1)}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.choiceContent}>
                                        {selectedChoice === 1 && (
                                            <View style={styles.selectedIndicator}>
                                                <Check size={16} color="#E2DED0" />
                                            </View>
                                        )}
                                        <Text style={[
                                            styles.choiceText,
                                            selectedChoice === 1 && styles.choiceTextSelected
                                        ]}>
                                            "How much will this cost?" Your first feeling is dread, overshadowing your concern.
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.choiceButton,
                                        selectedChoice === 2 && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => handleChoiceSelect(2)}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.choiceContent}>
                                        {selectedChoice === 2 && (
                                            <View style={styles.selectedIndicator}>
                                                <Check size={16} color="#E2DED0" />
                                            </View>
                                        )}
                                        <Text style={[
                                            styles.choiceText,
                                            selectedChoice === 2 && styles.choiceTextSelected
                                        ]}>
                                            "I need to ask my director for an advance on my pay." You feel uncomfortable adding a financial conversation to a stressful time.
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.choiceButton,
                                        selectedChoice === 3 && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => handleChoiceSelect(3)}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.choiceContent}>
                                        {selectedChoice === 3 && (
                                            <View style={styles.selectedIndicator}>
                                                <Check size={16} color="#E2DED0" />
                                            </View>
                                        )}
                                        <Text style={[
                                            styles.choiceText,
                                            selectedChoice === 3 && styles.choiceTextSelected
                                        ]}>
                                            "I'll book the next flight out." Your first and only thought is getting home.
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <PrimaryButton
                                title="Continue"
                                onPress={handleContinue}
                                disabled={selectedChoice === null}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Scenario 3 Response
    if (currentScreen === 9) {
        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={goBack} />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            <Text style={styles.responseTitle}>Your Choice</Text>

                            <Text style={styles.responseText}>{getResponseText()}</Text>

                            <PrimaryButton title="Continue to Conclusion" onPress={handleContinue} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Conclusion with Journal
    if (currentScreen === 10) {
        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={goBack} />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            <View style={commonStyles.introIconContainer}>
                                <View style={[styles.conclusionIconGradient, { backgroundColor: '#647C90' }]}>
                                    <AlertTriangle size={32} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={commonStyles.reflectionTitle}>Your Financial Safety Net</Text>

                            <Text style={commonStyles.reflectionDescription}>
                                An emergency fund isn't about being paranoid. It's about being prepared. It's the key that unlocks:
                            </Text>

                            <Text style={styles.conclusionBullet}>
                                • <Text style={styles.conclusionBold}>Career Opportunities</Text> without debt
                            </Text>
                            <Text style={styles.conclusionBullet}>
                                • <Text style={styles.conclusionBold}>Career Transitions</Text> without panic
                            </Text>
                            <Text style={styles.conclusionBullet}>
                                • <Text style={styles.conclusionBold}>Family Support</Text> without hesitation
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Your first goal is $500. Then go for one month's expenses. Then three. Start building your safety net today. You never know when you'll need to use it, but you'll always be glad it's there.
                            </Text>

                            <JournalEntrySection
                                pathTag="budgeting-for-dancers"
                                day="4"
                                category="finance"
                                pathTitle="Money Mindsets"
                                dayTitle="Emergency"
                                journalInstruction="Which emergency scenario resonated most with you, and what would having a financial safety net mean for your peace of mind?"
                                moodLabel=""
                                saveButtonText="Save Reflection"
                            />

                            <View style={styles.journalCallout}>
                                <Text style={styles.journalCalloutTitle}>Your Financial Future</Text>
                                <Text style={styles.journalCalloutText}>
                                    Remember, small consistent steps build your emergency fund. Even $20 per week adds up to over $1,000 in a year. Start where you are and build from there.
                                </Text>
                            </View>

                            <PrimaryButton title="Mark As Complete" onPress={onComplete} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    // Welcome Screen Styles
    celebrationBox: {
        width: '100%',
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(146, 132, 144, 0.2)',
    },
    celebrationTitle: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        marginBottom: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    celebrationItem: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 15,
        color: '#4E4F50',
        lineHeight: 24,
        marginBottom: 8,
    },
    welcomeFooter: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 15,
        color: '#928490',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 22,
    },
    // Icon Styles
    introIconGradient: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    scenarioIconContainer: {
        marginBottom: 24,
    },
    scenarioIconGradient: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    conclusionIconGradient: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    // Scenario Styles
    scenarioTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 24,
        fontWeight: '700',
    },
    scenarioText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    // Choices Styles
    choicesTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 30,
        fontWeight: '700',
    },
    choicesContainer: {
        gap: 16,
        marginBottom: 24,
    },
    choiceButton: {
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    choiceButtonSelected: {
        backgroundColor: 'rgba(146, 132, 144, 0.3)',
        borderColor: '#928490',
        borderWidth: 2,
    },
    choiceContent: {
        padding: 20,
        paddingRight: 50,
    },
    choiceText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        lineHeight: 24,
        textAlign: 'center',
    },
    choiceTextSelected: {
        color: '#4E4F50',
        fontWeight: '600',
    },
    selectedIndicator: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#928490',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Response Styles
    responseTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 25,
        fontWeight: '700',
    },
    responseText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    // Follow-up Styles
    followUpTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 25,
        fontWeight: '700',
    },
    followUpText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    // Conclusion Styles
    conclusionBullet: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        lineHeight: 24,
        marginBottom: 10,
        textAlign: 'left',
        width: '100%',
    },
    conclusionBold: {
        fontFamily: 'Montserrat-SemiBold',
    },
    // Journal Callout
    journalCallout: {
        width: '100%',
        backgroundColor: 'rgba(100, 124, 144, 0.1)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: 'rgba(100, 124, 144, 0.2)',
    },
    journalCalloutTitle: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 12,
        fontWeight: '600',
    },
    journalCalloutText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 15,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 22,
    },
});