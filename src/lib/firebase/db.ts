import { Listing, User, Trade } from "@/types";
import DemoManager from "@/lib/demo-manager";

// Dummy Unsubscribe function type matching Firebase's signature
type Unsubscribe = () => void;

function createDummyUnsubscribe(): Unsubscribe {
    return () => { };
}

export const DBService = {
    // USERS
    async createUserProfile(user: User) {
        DemoManager.adminUpdateUser(user);
    },

    async getUserProfile(uid: string): Promise<User | null> {
        return DemoManager.getMockUser();
    },

    async updateUserProfile(uid: string, updates: Partial<User>): Promise<void> {
        DemoManager.adminUpdateUser(updates);
    },

    async addCoinsToUser(uid: string, amount: number, reason: string): Promise<void> {
        const user = DemoManager.getMockUser();
        DemoManager.adminUpdateUser({ coins: (user.coins || 0) + amount });
    },

    subscribeToUserProfile(uid: string, callback: (user: User | null) => void): Unsubscribe {
        const unsubscribe = DemoManager.subscribe((user) => callback(user));
        return unsubscribe;
    },

    // SMART BAGS
    async createSmartBag(data: { qrCode: string; userId: string; ownerName?: string }): Promise<string> {
        return "mock-bag-123";
    },

    async getUserSmartBags(userId: string): Promise<any[]> {
        return [];
    },

    async updateSmartBagStatus(bagId: string, status: string, extraData?: Record<string, any>): Promise<void> {
        // Mock
    },

    async getSmartBagById(bagId: string): Promise<any | null> {
        return { id: bagId, status: 'scanned', qrCode: 'mock-qr' };
    },

    async getSmartBagByQR(qrCode: string): Promise<any | null> {
        return { id: 'mock-bag-123', status: 'registered', qrCode };
    },

    subscribeToSmartBag(bagId: string, callback: (bag: any | null) => void): Unsubscribe {
        callback({ id: bagId, status: 'registered' });
        return createDummyUnsubscribe();
    },

    subscribeToUserSmartBags(userId: string, callback: (bags: any[]) => void): Unsubscribe {
        callback([]);
        return createDummyUnsubscribe();
    },

    // LISTINGS
    async createListing(listingData: Omit<Listing, 'id' | 'createdAt'>) {
        const newListing = { ...listingData, id: `listing-${Date.now()}`, createdAt: new Date() };
        DemoManager.adminAddListing(newListing);
        return newListing.id;
    },

    async getListings(): Promise<Listing[]> {
        return DemoManager.getMockListings() as Listing[];
    },

    async getListingById(id: string): Promise<Listing | null> {
        return DemoManager.getListingById(id) as Listing | null;
    },

    async getUserListings(userId: string): Promise<Listing[]> {
        return (DemoManager.getMockListings() as Listing[]).filter(l => l.seller && l.seller.id === userId);
    },

    async deleteListing(listingId: string, userId: string): Promise<boolean> {
        DemoManager.adminDeleteListing(listingId);
        return true;
    },

    async updateListingStatus(listingId: string, status: 'available' | 'sold' | 'pending'): Promise<boolean> {
        DemoManager.adminUpdateListing(listingId, { status });
        return true;
    },

    async updateListing(listingId: string, userId: string, updates: Partial<Listing>): Promise<boolean> {
        DemoManager.adminUpdateListing(listingId, updates);
        return true;
    },

    // MESSAGES & CONVERSATIONS
    async getConversations(userId: string) {
        return Object.values(DemoManager.getMockMessages() || {});
    },

    async getMessages(conversationId: string) {
        return DemoManager.getConversation(conversationId) || [];
    },

    async sendMessage(
        conversationId: string,
        senderId: string,
        text: string,
        messageType: 'text' | 'offer' | 'system' | 'image' | 'qr' = 'text',
        offerAmount?: number
    ) {
        const msg = {
            id: `msg-${Date.now()}`,
            senderId,
            text,
            type: messageType,
            timestamp: new Date(),
            read: false,
            ...(offerAmount ? { offerAmount, offerStatus: 'pending' } : {})
        };
        DemoManager.addMessage(senderId, msg);
        return msg.id;
    },

    async sendOffer(conversationId: string, senderId: string, amount: number, listingTitle?: string) {
        return await this.sendMessage(conversationId, senderId, `I'd like to offer ${amount} coins`, 'offer', amount);
    },

    async updateOfferStatus(
        conversationId: string,
        messageId: string,
        status: 'accepted' | 'declined' | 'countered',
        counterAmount?: number,
        offerAmount?: number,
        listingId?: string,
        listingTitle?: string,
        sellerId?: string,
        buyerId?: string
    ) {
        // mock
        return;
    },

    async sendQRMessage(conversationId: string, qrData: any) {
        // mock
        return;
    },

    async createConversation(
        participant1: string,
        participant2: string,
        listingId?: string,
        listingTitle?: string,
        listingImage?: string,
        listingPrice?: number,
        sellerName?: string,
        sellerAvatar?: string
    ) {
        return `conv-${Date.now()}`;
    },

    async findOrCreateConversation(
        userId: string,
        sellerId: string,
        listingId?: string,
        listingTitle?: string,
        listingImage?: string,
        listingPrice?: number,
        sellerName?: string,
        sellerAvatar?: string
    ): Promise<string> {
        return `conv-${sellerId}`;
    },

    subscribeToMessages(
        conversationId: string,
        callback: (messages: any[]) => void
    ): Unsubscribe {
        callback(DemoManager.getConversation(conversationId) || []);
        return createDummyUnsubscribe();
    },

    // TRADES
    async createTrade(tradeData: Omit<Trade, 'id' | 'createdAt'>): Promise<string> {
        DemoManager.addTrade({ ...tradeData, id: `trade-${Date.now()}`, createdAt: new Date() });
        return `trade-${Date.now()}`;
    },

    async getUserTrades(userId: string): Promise<Trade[]> {
        return DemoManager.getMockTrades() as Trade[];
    },

    async updateTradeStatus(
        tradeId: string,
        status: 'accepted' | 'declined' | 'completed',
        additionalData?: Record<string, any>
    ) {
        DemoManager.adminUpdateTrade(tradeId, { status, ...additionalData });
    },

    // COIN TRANSFER (Atomic Transaction)
    async transferCoins(fromUserId: string, toUserId: string, amount: number) {
        const user = DemoManager.getMockUser();
        if (fromUserId === user.uid) {
             DemoManager.adminUpdateUser({ coins: (user.coins || 0) - amount });
        } else if (toUserId === user.uid) {
             DemoManager.adminUpdateUser({ coins: (user.coins || 0) + amount });
        }
        return { success: true };
    },

    // NOTIFICATIONS
    async getNotifications(userId: string, limitCount: number = 50): Promise<any[]> {
        return DemoManager.getMockNotifications();
    },

    subscribeToNotifications(userId: string, callback: (notifications: any[]) => void): Unsubscribe {
        callback(DemoManager.getMockNotifications());
        return createDummyUnsubscribe();
    },

    async markNotificationRead(notificationId: string): Promise<void> {
        // mock
    },

    async markAllNotificationsRead(userId: string): Promise<void> {
        // mock
    },

    async createNotification(data: any): Promise<string> {
        DemoManager.addNotification({ id: `notif-${Date.now()}`, ...data, read: false });
        return `notif-${Date.now()}`;
    },

    async getUnreadNotificationCount(userId: string): Promise<number> {
        return DemoManager.getMockNotifications().filter(n => !n.read).length;
    }
};
