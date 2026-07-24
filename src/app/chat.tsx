import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { MaxContentWidth } from '@/constants/theme';
import { Citation, sendChatMessage } from '@/services/chat';

const COMPOSER_FLOAT_GAP = 16;
const COMPOSER_RESERVED_SPACE = 96;
const SESSION_STORAGE_KEY = 'redbutton.chat_session_id';

type ChatMessage =
  | { id: string; sender: 'assistant'; kind: 'text'; text: string }
  | { id: string; sender: 'user'; kind: 'text'; text: string }
  | { id: string; sender: 'assistant'; kind: 'answer'; text: string; citations: Citation[] }
  | { id: string; sender: 'assistant'; kind: 'escalation'; text: string }
  | { id: string; sender: 'assistant'; kind: 'error'; text: string };

function replyId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const SUGGESTIONS = [
  { label: '🔥 Smoke from the motor', text: "There's smoke coming from the motor" },
  { label: '🔧 Machine won’t stop', text: 'The machine won’t stop and I hear grinding' },
  { label: '❓ Strange noise', text: 'I hear a strange noise from the conveyor' },
];

export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(SESSION_STORAGE_KEY).then((stored) => {
      if (stored) setSessionId(stored);
    });
  }, []);

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/worker-dashboard');
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isThinking) return;

    setMessages((prev) => [
      ...prev,
      { id: replyId(), sender: 'user', kind: 'text', text: trimmed },
    ]);
    setInput('');
    setIsThinking(true);

    try {
      const res = await sendChatMessage(trimmed, { sessionId });
      setSessionId(res.session_id);
      AsyncStorage.setItem(SESSION_STORAGE_KEY, res.session_id);

      setMessages((prev) => [
        ...prev,
        res.found_in_manuals
          ? {
              id: replyId(),
              sender: 'assistant',
              kind: 'answer',
              text: res.answer,
              citations: res.citations,
            }
          : { id: replyId(), sender: 'assistant', kind: 'escalation', text: res.answer },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: replyId(),
          sender: 'assistant',
          kind: 'error',
          text: 'Could not reach the assistant. Check your connection and try again.',
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
          style={[styles.suggestionsRow, { marginBottom: COMPOSER_RESERVED_SPACE + insets.bottom }]}
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
      </SafeAreaView>

      {/* Composer */}
      <View
        style={[styles.composerWrap, { bottom: insets.bottom + COMPOSER_FLOAT_GAP }]}
        pointerEvents="box-none">
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
      </View>
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

  if (message.kind === 'error') {
    return (
      <View style={[styles.bubble, styles.errorBubble]}>
        <View style={styles.escalationHeader}>
          <MaterialCommunityIcons name="alert-circle-outline" size={18} color="#B42318" />
          <Text style={styles.errorTitle}>Connection problem</Text>
        </View>
        <Text style={styles.errorText}>{message.text}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.bubble, styles.answerBubble]}>
      <View style={styles.confidentHeader}>
        <Ionicons name="checkmark-circle" size={16} color="#22A55E" />
        <Text style={styles.confidentLabel}>Grounded answer</Text>
      </View>
      <Text style={styles.assistantText}>{message.text}</Text>

      {message.citations.length > 0 && (
        <View style={styles.citationsList}>
          {message.citations.map((citation, index) => (
            <View key={`${citation.filename}-${citation.chunk_index}-${index}`} style={styles.citationRow}>
              <Ionicons name="document-text-outline" size={14} color="#2F6FE0" />
              <Text style={styles.citationText}>
                {citation.filename} <Text style={styles.citationPage}>chunk {citation.chunk_index}</Text>
              </Text>
            </View>
          ))}
        </View>
      )}
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
  answerBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#EDEEF3',
    borderBottomLeftRadius: 4,
    gap: 6,
  },
  citationsList: {
    gap: 4,
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F1F5',
  },
  citationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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

  /* Error */
  errorBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(180,35,24,0.08)',
    borderBottomLeftRadius: 4,
    gap: 6,
  },
  errorTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B42318',
  },
  errorText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#7A2015',
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
  composerWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 22,
    shadowColor: '#0F1729',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
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
