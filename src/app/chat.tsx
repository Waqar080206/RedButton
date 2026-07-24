import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type StepAnswer = {
  intro: string;
  steps: string[];
  citation: { doc: string; page: string };
};

type ChatMessage =
  | { id: string; sender: 'assistant'; kind: 'text'; text: string }
  | { id: string; sender: 'user'; kind: 'text'; text: string }
  | { id: string; sender: 'assistant'; kind: 'answer'; answer: StepAnswer }
  | { id: string; sender: 'assistant'; kind: 'escalation'; text: string };

const KEYWORD_RESPONSES: { keywords: string[]; answer: StepAnswer }[] = [
  {
    keywords: ['smoke', 'fire', 'overheat', 'hot', 'burning'],
    answer: {
      intro: 'Possible hydraulic overheat detected on the motor assembly.',
      steps: [
        'Hit the emergency stop on the control panel.',
        'Do not touch the motor housing — surface may exceed 80°C.',
        'Evacuate a 3m radius and ventilate the area.',
        'Wait for the thermal sensor to reset before restart.',
      ],
      citation: { doc: 'Hydraulic Press Manual', page: '84' },
    },
  },
  {
    keywords: ['jam', 'stuck', "won't stop", 'wont stop', 'grinding'],
    answer: {
      intro: 'Material jam detected in the feed mechanism.',
      steps: [
        'Press the yellow stop bar on the conveyor frame.',
        'Lock out power at the isolation switch before clearing debris.',
        'Manually rotate the feed wheel backward to release tension.',
        'Log the jam in the shift report before resuming.',
      ],
      citation: { doc: 'Conveyor Line SOP', page: '12' },
    },
  },
];

function replyId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function generateReply(userText: string): ChatMessage {
  const lower = userText.toLowerCase();
  const match = KEYWORD_RESPONSES.find((entry) =>
    entry.keywords.some((keyword) => lower.includes(keyword)),
  );

  if (match) {
    return { id: replyId(), sender: 'assistant', kind: 'answer', answer: match.answer };
  }

  return {
    id: replyId(),
    sender: 'assistant',
    kind: 'escalation',
    text: "This doesn't match confident guidance in the manual. Escalating to your on-site Safety Officer now.",
  };
}

const SUGGESTIONS = [
  { label: '🔥 Smoke from the motor', text: "There's smoke coming from the motor" },
  { label: '🔧 Machine won’t stop', text: 'The machine won’t stop and I hear grinding' },
  { label: '❓ Strange noise', text: 'I hear a strange noise from the conveyor' },
];

export default function ChatScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      kind: 'text',
      text: "Hi, I'm your AI safety assistant. Describe what's happening and I'll pull the right guidance from your equipment manuals.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/worker-dashboard');
  };

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isThinking) return;

    setMessages((prev) => [
      ...prev,
      { id: replyId(), sender: 'user', kind: 'text', text: trimmed },
    ]);
    setInput('');
    setIsThinking(true);

    setTimeout(() => {
      setMessages((prev) => [...prev, generateReply(trimmed)]);
      setIsThinking(false);
    }, 1100);
  };

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Go back">
            <Ionicons name="chevron-back" size={22} color="#0F1729" />
          </Pressable>

          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Emergency Chat</Text>
            <Text style={styles.headerSubtitle}>AI Safety Assistant</Text>
          </View>

          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live</Text>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={styles.messages}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isThinking && (
            <View style={[styles.bubble, styles.assistantBubble]}>
              <ActivityIndicator size="small" color="#E11900" />
              <Text style={styles.thinkingText}>Analyzing your report…</Text>
            </View>
          )}
        </ScrollView>

        {/* Suggestions */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.suggestionsRow}
          contentContainerStyle={styles.suggestionsContent}>
          {SUGGESTIONS.map((s) => (
            <Pressable
              key={s.label}
              style={styles.suggestionChip}
              onPress={() => sendMessage(s.text)}>
              <Text style={styles.suggestionText}>{s.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Composer */}
        <View style={styles.composer}>
          <Pressable style={styles.iconButton} accessibilityRole="button" accessibilityLabel="Attach photo">
            <Ionicons name="camera-outline" size={22} color="#5B6472" />
          </Pressable>
          <Pressable style={styles.iconButton} accessibilityRole="button" accessibilityLabel="Record voice">
            <Ionicons name="mic-outline" size={22} color="#5B6472" />
          </Pressable>

          <TextInput
            style={styles.input}
            placeholder="Describe the emergency…"
            placeholderTextColor="#98A2B3"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => sendMessage(input)}
            returnKeyType="send"
            multiline
          />

          <Pressable
            onPress={() => sendMessage(input)}
            disabled={!input.trim() || isThinking}
            accessibilityRole="button"
            accessibilityLabel="Send message">
            <LinearGradient
              colors={
                !input.trim() || isThinking ? ['#D9DCE3', '#D9DCE3'] : ['#F0331B', '#C51200']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sendButton}>
              <Ionicons name="arrow-up" size={20} color="#ffffff" />
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  if (message.sender === 'user') {
    return (
      <View style={[styles.bubble, styles.userBubble]}>
        <Text style={styles.userText}>{message.text}</Text>
      </View>
    );
  }

  if (message.kind === 'text') {
    return (
      <View style={[styles.bubble, styles.assistantBubble]}>
        <Text style={styles.assistantText}>{message.text}</Text>
      </View>
    );
  }

  if (message.kind === 'escalation') {
    return (
      <View style={[styles.bubble, styles.escalationBubble]}>
        <View style={styles.escalationHeader}>
          <MaterialCommunityIcons name="account-alert" size={18} color="#B45300" />
          <Text style={styles.escalationTitle}>Escalating to a human</Text>
        </View>
        <Text style={styles.escalationText}>{message.text}</Text>
      </View>
    );
  }

  const { answer } = message;
  return (
    <View style={[styles.bubble, styles.assistantBubble]}>
      <View style={styles.confidentHeader}>
        <Ionicons name="checkmark-circle" size={16} color="#22A55E" />
        <Text style={styles.confidentLabel}>Grounded answer</Text>
      </View>
      <Text style={styles.assistantText}>{answer.intro}</Text>

      <View style={styles.stepsList}>
        {answer.steps.map((step, index) => (
          <View key={step} style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>

      <View style={styles.citationRow}>
        <Ionicons name="document-text-outline" size={14} color="#2F6FE0" />
        <Text style={styles.citationText}>
          {answer.citation.doc} <Text style={styles.citationPage}>p. {answer.citation.page}</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  safeArea: {
    flex: 1,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F1729',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F1729',
  },
  headerSubtitle: {
    fontSize: 12.5,
    color: '#8A93A6',
    marginTop: 1,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(34,165,94,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#22A55E',
  },
  liveText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#22A55E',
  },

  /* Messages */
  messages: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
  },
  bubble: {
    maxWidth: '86%',
    borderRadius: 18,
    padding: 14,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#0F1729',
    borderBottomRightRadius: 4,
  },
  userText: {
    color: '#ffffff',
    fontSize: 15,
    lineHeight: 21,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#EDEEF3',
    borderBottomLeftRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  assistantText: {
    color: '#1F2733',
    fontSize: 15,
    lineHeight: 21,
    flexShrink: 1,
  },
  thinkingText: {
    color: '#5B6472',
    fontSize: 14,
    fontWeight: '600',
  },

  /* Confident answer */
  confidentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  confidentLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#22A55E',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  stepsList: {
    gap: 8,
    marginTop: 4,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  stepNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(225,25,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumberText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#E11900',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#1F2733',
  },
  citationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F1F5',
  },
  citationText: {
    fontSize: 12.5,
    color: '#2F6FE0',
    fontWeight: '600',
  },
  citationPage: {
    fontWeight: '800',
  },

  /* Escalation */
  escalationBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(245,165,36,0.1)',
    borderBottomLeftRadius: 4,
    gap: 6,
  },
  escalationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  escalationTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B45300',
  },
  escalationText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#7A4200',
  },

  /* Suggestions */
  suggestionsRow: {
    flexGrow: 0,
    marginBottom: 8,
  },
  suggestionsContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E7E9F0',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  suggestionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3A4356',
  },

  /* Composer */
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#EDEEF3',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    maxHeight: 100,
    minHeight: 40,
    fontSize: 15,
    color: '#0F1729',
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: '#F5F6FA',
    borderRadius: 20,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
