import { injectable } from 'tsyringe';
import { Server as SocketIoServer, Socket } from 'socket.io';
import { ConversationEvents } from './constants/conversation.constants';

@injectable()
export class ConversationGateway {
  private io: SocketIoServer | null = null;
  private activeUsers: Map<string, { socketId: string, userId: string, userType: 'regulator' | 'control_center' }> = new Map();

  constructor() {}

  // Initialize with the Socket.IO server instance
  init(io: SocketIoServer) {
    this.io = io;
    this.setupEventHandlers();
    console.log('ConversationGateway initialized and event handlers set up.');
  }

  private setupEventHandlers() {
    if (!this.io) {
      console.error('Socket.IO server instance not available in ConversationGateway setup.');
      return;
    }

    this.io.on('connection', (socket: Socket) => {
      console.log(`ConversationGateway handling connection: ${socket.id}`);

      // Handle user authentication
      socket.on('user.connected', (data: { userId: string, userType: 'regulator' | 'control_center' }) => {
        console.log(`User connected: ${data.userId}, type: ${data.userType}`);
        
        // Store user connection info
        this.activeUsers.set(data.userId, {
          socketId: socket.id,
          userId: data.userId,
          userType: data.userType
        });
        
        // Join user-specific room
        socket.join(`user_${data.userId}`);
      });

      // Handle message sending
      socket.on(ConversationEvents.ON_MESSAGE_SENT, async (data: { 
        message: string, 
        senderId: string, 
        receiverId: string,
        conversationId?: string,
        attachments?: Array<{ type: string, url: string }>
      }) => {
        console.log(`Message sent:`, data);
        
        try {
          // Validate data
          if (!data.message || !data.senderId || !data.receiverId) {
            throw new Error('Invalid message data');
          }
          
          // Store message in database (would be implemented in a handler)
          // For now, we'll just simulate successful storage
          const messageId = `msg_${Date.now()}`;
          const timestamp = new Date();
          
          // Create message object
          const messageObj = {
            id: messageId,
            message: data.message,
            senderId: data.senderId,
            receiverId: data.receiverId,
            conversationId: data.conversationId || `conv_${data.senderId}_${data.receiverId}`,
            timestamp,
            attachments: data.attachments || [],
            status: 'sent'
          };
          
          // Emit to sender as confirmation
          socket.emit(ConversationEvents.EMIT_MESSAGE_SENT, {
            ...messageObj,
            status: 'sent'
          });
          
          // Emit to receiver if they're online
          const receiverInfo = this.activeUsers.get(data.receiverId);
          if (receiverInfo) {
            this.io?.to(`user_${data.receiverId}`).emit(ConversationEvents.EMIT_MESSAGE_RECEIVED, {
              ...messageObj,
              status: 'delivered'
            });
          }
          
        } catch (error) {
          console.error('Error processing message:', error);
          socket.emit('conversation.error', {
            message: error instanceof Error ? error.message : 'Error sending message',
            timestamp: new Date()
          });
        }
      });

      // Handle user disconnection
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        
        // Find and remove the disconnected user
        for (const [userId, info] of this.activeUsers.entries()) {
          if (info.socketId === socket.id) {
            console.log(`Removing user ${userId}`);
            this.activeUsers.delete(userId);
            break;
          }
        }
      });
    });
  }

  // Get active users - useful for monitoring
  getActiveUsers() {
    return Array.from(this.activeUsers.entries()).map(([userId, info]) => ({
      userId,
      socketId: info.socketId,
      userType: info.userType
    }));
  }
} 