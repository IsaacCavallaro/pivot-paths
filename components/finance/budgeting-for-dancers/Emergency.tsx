import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, AlertTriangle, ArrowLeft, ChevronLeft, Plane, Briefcase, Heart } from 'lucide-react-native';

interface EmergencyProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function Emergency({ onComplete, onBack }: EmergencyProps) {
    const [currentScreen, setCurrentScreen] = useState(0); // 0 = intro, 1-12 = scenario screens
    const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
    const [currentScenario, setCurrentScenario] = useState(1); // 1, 2, or 3

    const handleStart = () => {
        setCurrentScreen(1);
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        }
    };

    const goBack = () => {
        if (currentScreen === 0) {
            handleBack();
        } else if (currentScreen === 1) {
            setCurrentScreen(0);
        } else if (currentScreen > 1 && currentScreen <= 12) {
            setCurrentScreen(currentScreen - 1);
        }
    };

    const handleChoiceSelect = (choiceNumber: number) => {
        setSelectedChoice(choiceNumber);
        // Move to response screen based on current scenario
        if (currentScenario === 1) {
            setCurrentScreen(4);
        } else if (currentScenario === 2) {
            setCurrentScreen(8);
        } else if (currentScenario === 3) {
            setCurrentScreen(11);
        }
    };

    const handleContinue = () => {
        if (currentScreen === 0) {
            setCurrentScreen(1);
        } else if (currentScreen === 1) {
            setCurrentScreen(2);
        } else if (currentScreen === 2) {
            setCurrentScreen(3);
        } else if (currentScreen === 3 && selectedChoice !== null) {
            // After choice response, go to follow-up
            setCurrentScreen(5);
        } else if (currentScreen === 5) {
            // End of scenario 1, start scenario 2
            setCurrentScenario(2);
            setCurrentScreen(6);
        } else if (currentScreen === 6) {
            setCurrentScreen(7);
        } else if (currentScreen === 7 && selectedChoice !== null) {
            // After choice response, go to follow-up
            setCurrentScreen(8);
        } else if (currentScreen === 8) {
            // End of scenario 2, start scenario 3
            setCurrentScenario(3);
            setCurrentScreen(9);
        } else if (currentScreen === 9) {
            setCurrentScreen(10);
        } else if (currentScreen === 10 && selectedChoice !== null) {
            // After choice response, go to follow-up
            setCurrentScreen(11);
        } else if (currentScreen === 11) {
            // Go to conclusion
            setCurrentScreen(12);
        } else if (currentScreen === 12) {
            onComplete();
        } else {
            setCurrentScreen(currentScreen + 1);
        }
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

    const getHeaderColor = () => {
        if (currentScreen === 0) return '#928490';
        if (currentScreen >= 1 && currentScreen <= 5) return '#928490'; // Scenario 1
        if (currentScreen >= 6 && currentScreen <= 8) return '#928490'; // Scenario 2
        if (currentScreen >= 9 && currentScreen <= 11) return '#928490'; // Scenario 3
        return '#647C90'; // Conclusion
    };

    const getHeaderTitle = () => {
        if (currentScreen === 0) return "Emergency!";
        if (currentScreen === 1) return "Scenario 1";
        if (currentScreen === 2) return "Your Options";
        if (currentScreen === 3) return "Your Choice";
        if (currentScreen === 4) return "The Big Picture";
        if (currentScreen === 5) return "Scenario 2";
        if (currentScreen === 6) return "Your Options";
        if (currentScreen === 7) return "Your Choice";
        if (currentScreen === 8) return "Scenario 3";
        if (currentScreen === 9) return "Your Options";
        if (currentScreen === 10) return "Your Choice";
        if (currentScreen === 11) return "Conclusion";
        return "Emergency!";
    };

    // Intro Screen (Screen 1)
    if (currentScreen === 0) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: getHeaderColor() }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>{getHeaderTitle()}</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.introCard}>
                            <View style={styles.introIconContainer}>
                                <View style={[styles.introIconGradient, { backgroundColor: getHeaderColor() }]}>
                                    <AlertTriangle size={32} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={styles.introTitle}>Emergency!</Text>

                            <Text style={styles.introDescription}>
                                Life is full of surprises. An emergency fund isn't just money in the bank… it's your ticket to handling a crisis with grace, not panic.
                            </Text>

                            <Text style={styles.introDescription}>
                                Let's walk through a few scenarios. Choose what you'd do, and we'll show you how a safety net changes the game.
                            </Text>

                            <TouchableOpacity
                                style={styles.startButton}
                                onPress={handleStart}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.startButtonContent, { backgroundColor: getHeaderColor() }]}>
                                    <Text style={styles.startButtonText}>Begin</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Scenario 1 Intro (Screen 2)
    if (currentScreen === 1) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: getHeaderColor() }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>{getHeaderTitle()}</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.scenarioCard}>
                            <Text style={styles.scenarioTitle}>Scenario 1: The Unexpected Audition</Text>

                            <Text style={styles.scenarioText}>
                                It's a Tuesday afternoon. Your agent calls: there's a last-minute audition for a dream job tomorrow in Los Angeles. Flights and a hotel will cost at least $800. What do you do?
                            </Text>

                            <TouchableOpacity
                                style={styles.continueButton}
                                onPress={handleContinue}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.continueButtonContent, { backgroundColor: getHeaderColor() }]}>
                                    <Text style={styles.continueButtonText}>See Your Options</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Scenario 1 Choices (Screen 3)
    if (currentScreen === 2) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: getHeaderColor() }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>{getHeaderTitle()}</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.choicesCard}>
                            <Text style={styles.choicesTitle}>What would you do?</Text>

                            <View style={styles.choicesContainer}>
                                <TouchableOpacity
                                    style={styles.choiceButton}
                                    onPress={() => handleChoiceSelect(1)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.choiceText}>
                                        Put it all on a credit card. This opportunity is worth the debt!
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.choiceButton}
                                    onPress={() => handleChoiceSelect(2)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.choiceText}>
                                        Politely decline. You feel a pit in your stomach, but your bank account is already too tight.
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.choiceButton}
                                    onPress={() => handleChoiceSelect(3)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.choiceText}>
                                        You check your dedicated "Opportunity Fund", book the trip, and go to bed stress-free.
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Scenario 1 Response (Screen 4)
    if (currentScreen === 3) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: getHeaderColor() }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>{getHeaderTitle()}</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.responseCard}>
                            <Text style={styles.responseTitle}>Your Choice</Text>

                            <Text style={styles.responseText}>{getResponseText()}</Text>

                            <TouchableOpacity
                                style={styles.continueButton}
                                onPress={handleContinue}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.continueButtonContent, { backgroundColor: getHeaderColor() }]}>
                                    <Text style={styles.continueButtonText}>Continue</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Scenario 1 Follow-up (Screen 5)
    if (currentScreen === 4) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: getHeaderColor() }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>{getHeaderTitle()}</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.followUpCard}>
                            <Text style={styles.followUpTitle}>The Big Picture</Text>

                            <Text style={styles.followUpText}>
                                An emergency fund turns a crisis or a huge opportunity into a simple, manageable event. It's the difference between reacting from a place of fear and responding from a place of power.
                            </Text>

                            <TouchableOpacity
                                style={styles.continueButton}
                                onPress={handleContinue}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.continueButtonContent, { backgroundColor: getHeaderColor() }]}>
                                    <Text style={styles.continueButtonText}>Next Scenario</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Scenario 2 Intro (Screen 6)
    if (currentScreen === 5) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: getHeaderColor() }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>{getHeaderTitle()}</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.scenarioCard}>
                            <View style={styles.scenarioIconContainer}>
                                <View style={[styles.scenarioIconGradient, { backgroundColor: getHeaderColor() }]}>
                                    <Briefcase size={32} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={styles.scenarioTitle}>Scenario 2: The Sudden Career Pivot</Text>

                            <Text style={styles.scenarioText}>
                                You're unexpectedly injured and you've decided to pivot! You land an entry-level interview in a new field. The job offers huge opportunities for growth but initially, it's a pay cut. What's your move?
                            </Text>

                            <TouchableOpacity
                                style={styles.continueButton}
                                onPress={handleContinue}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.continueButtonContent, { backgroundColor: getHeaderColor() }]}>
                                    <Text style={styles.continueButtonText}>See Your Options</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Scenario 2 Choices (Screen 7)
    if (currentScreen === 6) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: getHeaderColor() }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>{getHeaderTitle()}</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.choicesCard}>
                            <Text style={styles.choicesTitle}>What would you do?</Text>

                            <View style={styles.choicesContainer}>
                                <TouchableOpacity
                                    style={styles.choiceButton}
                                    onPress={() => handleChoiceSelect(1)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.choiceText}>
                                        Panic and decline. You can't afford the pay cut, so you stay in the familiar grind of dance gigs.
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.choiceButton}
                                    onPress={() => handleChoiceSelect(2)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.choiceText}>
                                        Take the job but pile on extra teaching hours nights/weekends to make ends meet, risking burnout.
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.choiceButton}
                                    onPress={() => handleChoiceSelect(3)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.choiceText}>
                                        Confidently accept, knowing your emergency fund can cover the income gap for the first year.
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Scenario 2 Response (Screen 8)
    if (currentScreen === 7) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: getHeaderColor() }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>{getHeaderTitle()}</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.responseCard}>
                            <Text style={styles.responseTitle}>Your Choice</Text>

                            <Text style={styles.responseText}>{getResponseText()}</Text>

                            <TouchableOpacity
                                style={styles.continueButton}
                                onPress={handleContinue}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.continueButtonContent, { backgroundColor: getHeaderColor() }]}>
                                    <Text style={styles.continueButtonText}>Next Scenario</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Scenario 3 Intro (Screen 9)
    if (currentScreen === 8) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: getHeaderColor() }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>{getHeaderTitle()}</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.scenarioCard}>
                            <View style={styles.scenarioIconContainer}>
                                <View style={[styles.scenarioIconGradient, { backgroundColor: getHeaderColor() }]}>
                                    <Heart size={32} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={styles.scenarioTitle}>Scenario 3: The Family Emergency</Text>

                            <Text style={styles.scenarioText}>
                                You get a call that a parent back home has had a medical emergency. You need to book a last-minute flight across the country and may need to stay for a while to help out. What is your first thought?
                            </Text>

                            <TouchableOpacity
                                style={styles.continueButton}
                                onPress={handleContinue}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.continueButtonContent, { backgroundColor: getHeaderColor() }]}>
                                    <Text style={styles.continueButtonText}>See Your Options</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Scenario 3 Choices (Screen 10)
    if (currentScreen === 9) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: getHeaderColor() }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>{getHeaderTitle()}</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.choicesCard}>
                            <Text style={styles.choicesTitle}>What is your first thought?</Text>

                            <View style={styles.choicesContainer}>
                                <TouchableOpacity
                                    style={styles.choiceButton}
                                    onPress={() => handleChoiceSelect(1)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.choiceText}>
                                        "How much will this cost?" Your first feeling is dread, overshadowing your concern.
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.choiceButton}
                                    onPress={() => handleChoiceSelect(2)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.choiceText}>
                                        "I need to ask my director for an advance on my pay." You feel uncomfortable adding a financial conversation to a stressful time.
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.choiceButton}
                                    onPress={() => handleChoiceSelect(3)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.choiceText}>
                                        "I'll book the next flight out." Your first and only thought is getting home.
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Scenario 3 Response (Screen 11)
    if (currentScreen === 10) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: getHeaderColor() }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>{getHeaderTitle()}</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.responseCard}>
                            <Text style={styles.responseTitle}>Your Choice</Text>

                            <Text style={styles.responseText}>{getResponseText()}</Text>

                            <TouchableOpacity
                                style={styles.continueButton}
                                onPress={handleContinue}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.continueButtonContent, { backgroundColor: getHeaderColor() }]}>
                                    <Text style={styles.continueButtonText}>Conclusion</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Conclusion (Screen 12)
    if (currentScreen === 11) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: getHeaderColor() }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={goBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>{getHeaderTitle()}</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.conclusionCard}>
                            <View style={styles.conclusionIconContainer}>
                                <View style={[styles.conclusionIconGradient, { backgroundColor: getHeaderColor() }]}>
                                    <AlertTriangle size={32} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={styles.conclusionTitle}>Your Financial Safety Net</Text>

                            <Text style={styles.conclusionText}>
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

                            <Text style={styles.conclusionText}>
                                Your first goal is $500. Then go for one month's expenses. Then three. Start building your safety net today. You never know when you'll need to use it, but you'll always be glad it's there.
                            </Text>

                            <Text style={styles.conclusionClosing}>
                                Come back tomorrow for more.
                            </Text>

                            <TouchableOpacity
                                style={styles.completeButton}
                                onPress={onComplete}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.completeButtonContent, { backgroundColor: getHeaderColor() }]}>
                                    <Text style={styles.completeButtonText}>Mark As Complete</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    return null;
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
    introCard: {
        marginHorizontal: 24,
        marginTop: 50,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    introIconContainer: {
        marginBottom: 24,
    },
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
    introTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '700',
    },
    introDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#928490',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
    },
    startButton: {
        borderRadius: 30,
        overflow: 'hidden',
    },
    startButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#E2DED0',
    },
    startButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#E2DED0',
        marginRight: 8,
        fontWeight: '600',
    },
    scenarioCard: {
        marginHorizontal: 24,
        marginTop: 50,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
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
    continueButton: {
        borderRadius: 30,
        overflow: 'hidden',
    },
    continueButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#E2DED0',
    },
    continueButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#E2DED0',
        marginRight: 8,
        fontWeight: '600',
    },
    choicesCard: {
        marginHorizontal: 24,
        marginTop: 50,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
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
    },
    choiceButton: {
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 16,
        padding: 20,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    choiceText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        lineHeight: 24,
        textAlign: 'center',
    },
    responseCard: {
        marginHorizontal: 24,
        marginTop: 50,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
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
    followUpCard: {
        marginHorizontal: 24,
        marginTop: 50,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
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
    conclusionCard: {
        marginHorizontal: 24,
        marginTop: 50,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    conclusionIconContainer: {
        marginBottom: 24,
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
    conclusionTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 25,
        fontWeight: '700',
    },
    conclusionText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
    },
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
    conclusionClosing: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 32,
        marginTop: 20,
        fontWeight: '600',
    },
    completeButton: {
        borderRadius: 30,
        overflow: 'hidden',
    },
    completeButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#E2DED0',
    },
    completeButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#E2DED0',
        marginRight: 8,
        fontWeight: '600',
    },
});