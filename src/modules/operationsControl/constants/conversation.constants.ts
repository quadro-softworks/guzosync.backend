export class ConversationEvents {
  // Common Events
  static readonly ON_CONNECTION = 'connection';
  static readonly ON_DISCONNECTION = 'disconnect';
  
  // Conversation Events
  static readonly ON_MESSAGE_SENT = 'conversation.message_sent';
  static readonly EMIT_MESSAGE_SENT = 'conversation.message_sent.confirmation';
  static readonly EMIT_MESSAGE_RECEIVED = 'conversation.message_received';
  static readonly EMIT_CONVERSATION_ERROR = 'conversation.error';
} 