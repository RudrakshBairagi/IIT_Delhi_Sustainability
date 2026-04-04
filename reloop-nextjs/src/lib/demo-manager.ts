import { User } from '@/types';

// Event emitter for syncing updates
type Listener = (user: User) => void;

// Mock data generator for frontend demo purposes
// This bridges the gap for features not yet migrated to Firebase
class DemoManagerService {
    private _isDemoMode = true;
    private _listeners: Listener[] = [];
    private _version = 0; // Increment on every update for change detection
    private _storageKey = 'reloop_demo_data';

    // Initial default user state
    private _defaultUser: User = {
        uid: 'demo-user-123',
        name: 'Demo User',
        email: 'demo@reloop.com',
        avatar: 'https://ui-avatars.com/api/?name=Demo+User',
        coins: 450,
        xp: 2800,
        level: 3,
        levelTitle: 'Sapling',
        itemsTraded: 12,
        co2Saved: 25.5,
        badges: ['early-adopter'],
        campus: 'Main Campus',
        streak: 5
    };

    private _mockUser: User;

    constructor() {
        this._mockUser = { ...this._defaultUser };

        // Initialize from localStorage if available (client-side only)
        if (typeof window !== 'undefined') {
            this.loadState();

            // Listen for cross-tab updates
            window.addEventListener('storage', (e) => {
                if (e.key === this._storageKey) {
                    console.log('[DemoManager] Syncing from storage event');
                    this.loadState();
                    this.notifyListeners(false); // don't write back to storage loop
                }
            });
        }
    }

    private loadState() {
        try {
            const stored = localStorage.getItem(this._storageKey);
            if (stored) {
                const data = JSON.parse(stored);
                if (data.user) {
                    this._mockUser = data.user;
                    // Could also load other state like listings, trades etc. if we persisted them
                }
            }
        } catch (e) {
            console.error('[DemoManager] Error loading state', e);
        }
    }

    private saveState() {
        if (typeof window === 'undefined') return;

        try {
            const data = {
                user: this._mockUser,
                timestamp: Date.now()
            };
            localStorage.setItem(this._storageKey, JSON.stringify(data));
        } catch (e) {
            console.error('[DemoManager] Error saving state', e);
        }
    }

    // Subscribe to user updates
    subscribe(listener: Listener): () => void {
        this._listeners.push(listener);
        // Immediately notify new subscriber with current state
        listener(this._mockUser);

        // Return unsubscribe function
        return () => {
            this._listeners = this._listeners.filter(l => l !== listener);
        };
    }

    // Notify all listeners of user update
    private notifyListeners(save: boolean = true) {
        this._version++;
        if (save) this.saveState();
        this._listeners.forEach(listener => listener(this._mockUser));
    }

    get version() {
        return this._version;
    }

    get isEnabled() {
        return this._isDemoMode;
    }

    get user() {
        return this._mockUser;
    }

    getStreak() {
        return this._mockUser.streak || 1;
    }

    getMockLeaderboard() {
        return [
            { uid: '1', name: 'Alex Johnson', level: 8, xp: 8450, avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson' },
            { uid: '2', name: 'Sarah Chen', level: 7, xp: 7200, avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen' },
            { uid: '3', name: 'Mike Smith', level: 6, xp: 6100, avatar: 'https://ui-avatars.com/api/?name=Mike+Smith' }
        ];
    }

    saveScan(result: any) {
        console.log('Use Firebase to persist scan result', result);
    }

    simulateDelay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getMockScanResult() {
        return {
            success: true,
            classification: 'safe',
            xpEarned: 15,
            item: {
                objectName: 'Mock Item',
                category: 'Other',
                confidence: 0.9,
                estimatedCoins: 50,
                co2Savings: 2.5,
                upcycleIdeas: [],
                recyclable: true
            }
        };
    }

    getMockUser(): User {
        return this._mockUser;
    }

    // ===== MESSAGING (Mock for now) =====
    private _mockMessages = [
        {
            id: 'msg-1',
            senderId: 'user-abc',
            senderName: 'Priya Sharma',
            senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
            lastMessage: 'Is the lamp still available?',
            timestamp: new Date(Date.now() - 3600000),
            unread: true,
            listingTitle: 'Vintage Desk Lamp',
            listingImage: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200&h=200&fit=crop',
            listingPrice: 750,
            conversationType: 'marketplace' as const
        },
        {
            id: 'msg-2',
            senderId: 'user-xyz',
            senderName: 'Rahul Mehta',
            senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
            lastMessage: 'Thanks for the trade!',
            timestamp: new Date(Date.now() - 86400000),
            unread: false,
            listingTitle: 'MacBook Pro 2019',
            listingImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop',
            listingPrice: 45000,
            conversationType: 'marketplace' as const
        },
        {
            id: 'msg-3',
            senderId: 'user-diy-1',
            senderName: 'Sneha Kapoor',
            senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
            lastMessage: 'Love your lamp project! How did you wire it?',
            timestamp: new Date(Date.now() - 7200000),
            unread: true,
            projectId: 'project-1',
            projectTitle: 'Boho Lamp From Bottles',
            conversationType: 'community' as const
        },
        {
            id: 'msg-4',
            senderId: 'user-diy-2',
            senderName: 'Vikram Agarwal',
            senderAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
            lastMessage: 'Want to collab on the pallet table?',
            timestamp: new Date(Date.now() - 172800000),
            unread: false,
            projectId: 'project-3',
            projectTitle: 'Pallet Coffee Table',
            conversationType: 'community' as const
        },
    ];

    private _conversations: Record<string, any[]> = {
        'user-abc': [
            { id: 'chat-1', senderId: 'user-abc', text: 'Hey, is the lamp still available?', timestamp: new Date(Date.now() - 7200000), isOwn: false },
            { id: 'chat-2', senderId: 'demo-user-123', text: 'Yes it is! Would you like to meet up?', timestamp: new Date(Date.now() - 3600000), isOwn: true },
        ],
        'user-xyz': [
            { id: 'chat-3', senderId: 'user-xyz', text: 'Thanks for the trade!', timestamp: new Date(Date.now() - 86400000), isOwn: false },
        ],
        'user-diy-1': [
            { id: 'chat-4', senderId: 'user-diy-1', text: 'Love your lamp project! How did you wire it?', timestamp: new Date(Date.now() - 7200000), isOwn: false },
        ],
        'user-diy-2': [
            { id: 'chat-5', senderId: 'user-diy-2', text: 'Want to collab on the pallet table?', timestamp: new Date(Date.now() - 172800000), isOwn: false },
        ],
    };

    getMockMessages() {
        return this._mockMessages;
    }

    getConversation(contactId: string) {
        // Try contactId directly, then try sender ID from message lookup
        if (this._conversations[contactId]) {
            return this._conversations[contactId];
        }
        // Look up by message id to get the sender id
        const msg = this._mockMessages.find(m => m.id === contactId);
        if (msg && this._conversations[msg.senderId]) {
            return this._conversations[msg.senderId];
        }
        return [];
    }

    addMessage(contactId: string, message: any) {
        // Find the actual sender ID if contactId is a message ID
        let actualContactId = contactId;
        const msg = this._mockMessages.find(m => m.id === contactId);
        if (msg) {
            actualContactId = msg.senderId;
        }
        if (!this._conversations[actualContactId]) {
            this._conversations[actualContactId] = [];
        }
        this._conversations[actualContactId].push(message);
    }

    markConversationRead(contactId: string) {
        // Support both message id and sender id
        let msg = this._mockMessages.find(m => m.id === contactId);
        if (!msg) {
            msg = this._mockMessages.find(m => m.senderId === contactId);
        }
        if (msg) msg.unread = false;
        this.notifyListeners();
    }

    // ===== NOTIFICATIONS (Mock) =====
    private _mockNotifications = [
        { id: 'notif-1', type: 'trade', icon: 'swap_horiz', title: 'Trade Completed!', message: 'Your trade with Emma was successful', read: false, timestamp: new Date(Date.now() - 1800000), actionUrl: '/trade-history' },
        { id: 'notif-2', type: 'achievement', icon: 'emoji_events', title: 'New Badge Earned', message: 'You earned the "Eco Warrior" badge!', read: false, timestamp: new Date(Date.now() - 7200000) },
        { id: 'notif-3', type: 'coin', icon: 'monetization_on', title: '+50 Coins', message: 'Reward for your first listing', read: true, timestamp: new Date(Date.now() - 86400000) },
        { id: 'notif-4', type: 'system', icon: 'info', title: 'Welcome to ReLoop!', message: 'Start by scanning an item to earn coins', read: true, timestamp: new Date(Date.now() - 172800000) },
    ];

    getMockNotifications() {
        return this._mockNotifications;
    }

    // ===== TRADE HISTORY (Mock) =====
    private _mockTransactions = [
        { id: 'tx-1', type: 'TRADE', itemName: 'Vintage Desk Lamp', partnerName: 'Emma Watson', partnerAvatar: 'https://ui-avatars.com/api/?name=Emma+Watson', coins: 75, status: 'completed', createdAt: new Date(Date.now() - 86400000) },
        { id: 'tx-2', type: 'SCAN', itemName: 'Old Textbooks', coins: 25, status: 'completed', createdAt: new Date(Date.now() - 172800000) },
    ];

    getMockTransactions() {
        return this._mockTransactions;
    }

    // ===== TRADE HISTORY (Mock) =====
    private _mockTrades = [
        { id: 'trade-1', listingId: 'listing-1', listingTitle: 'Vintage Desk Lamp', listingImage: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200&h=200&fit=crop', sellerId: 'demo-user-123', sellerName: 'You', sellerAvatar: 'https://ui-avatars.com/api/?name=Demo+User&background=4ce68a&color=fff', traderId: 'user-abc', traderName: 'Emma Watson', traderAvatar: 'https://ui-avatars.com/api/?name=Emma+Watson', status: 'completed', offeredCoins: 75, co2Saved: 2.5, createdAt: new Date(Date.now() - 86400000) },
        { id: 'trade-2', listingId: 'listing-2', listingTitle: 'Textbook Bundle', listingImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=200&fit=crop', sellerId: 'demo-user-123', sellerName: 'You', sellerAvatar: 'https://ui-avatars.com/api/?name=Demo+User&background=4ce68a&color=fff', traderId: 'user-xyz', traderName: 'John Doe', traderAvatar: 'https://ui-avatars.com/api/?name=John+Doe', status: 'pending', offeredItem: 'Coffee Maker', createdAt: new Date(Date.now() - 172800000) },
        { id: 'trade-3', listingId: 'listing-3', listingTitle: 'Bike Accessories', listingImage: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=200&h=200&fit=crop', sellerId: 'user-other', sellerName: 'Mike Johnson', sellerAvatar: 'https://ui-avatars.com/api/?name=Mike+Johnson', traderId: 'demo-user-123', traderName: 'You', traderAvatar: 'https://ui-avatars.com/api/?name=Demo+User&background=4ce68a&color=fff', status: 'pending', offeredCoins: 50, createdAt: new Date(Date.now() - 259200000) },
    ];

    getMockTrades() {
        return this._mockTrades;
    }

    // ===== REWARDS (Mock) =====
    private _mockRewards = [
        { id: 'reward-1', title: '10% Campus Cafe', description: 'Coffee discount for eco-warriors', icon: '☕', cost: 100, category: 'voucher' as const, available: true },
        { id: 'reward-2', title: 'ReLoop Sticker Pack', description: 'Show off your sustainability', icon: '🎨', cost: 50, category: 'merch' as const, available: true },
        { id: 'reward-3', title: 'Plant a Tree', description: 'We plant a tree in your name', icon: '🌳', cost: 200, category: 'donation' as const, available: true },
        { id: 'reward-4', title: 'Premium Badge', description: 'Exclusive profile badge', icon: '🏅', cost: 150, category: 'merch' as const, available: true },
        { id: 'reward-5', title: 'Book Store 15% Off', description: 'Discount at campus bookstore', icon: '📚', cost: 75, category: 'voucher' as const, available: true },
        { id: 'reward-6', title: 'Ocean Cleanup Donation', description: 'Remove 1lb plastic from ocean', icon: '🌊', cost: 100, category: 'donation' as const, available: true },
    ];

    private _redeemedRewards: string[] = [];

    getMockRewards() {
        return this._mockRewards;
    }

    getRedeemedRewards(): string[] {
        return this._redeemedRewards;
    }

    redeemReward(rewardId: string, cost: number): boolean {
        if (this._mockUser.coins >= cost && !this._redeemedRewards.includes(rewardId)) {
            this._mockUser.coins -= cost;
            this._redeemedRewards.push(rewardId);
            return true;
        }
        return false;
    }

    // ===== MAKEOVER ARTISTS (Mock) =====
    getArtistProfiles() {
        return [
            { id: 'artist-1', name: 'Maya Chen', avatar: 'https://ui-avatars.com/api/?name=Maya+Chen&background=f472b6&color=fff', rating: 4.9, completedJobs: 45, specialties: ['Furniture', 'Decor'] },
            { id: 'artist-2', name: 'Alex Rivera', avatar: 'https://ui-avatars.com/api/?name=Alex+Rivera&background=a78bfa&color=fff', rating: 4.7, completedJobs: 32, specialties: ['Clothing', 'Accessories'] },
            { id: 'artist-3', name: 'Sam Taylor', avatar: 'https://ui-avatars.com/api/?name=Sam+Taylor&background=60a5fa&color=fff', rating: 4.8, completedJobs: 28, specialties: ['Electronics', 'Cases'] },
        ];
    }

    createMakeoverRequest(title: string, image: string, coins: number) {
        console.log('[DemoManager] Makeover request created:', { title, image, coins });
        return { id: `makeover-${Date.now()}`, title, image, coins, status: 'pending' };
    }

    // ===== LISTINGS (Mock) =====
    private _mockListings = [
        { id: 'listing-1', title: 'Vintage Desk Lamp', description: 'Beautiful brass lamp, perfect for study desk', price: 750, category: 'Home', condition: 'Good', status: 'available' as const, images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400'], seller: { id: 'user-abc', name: 'Priya', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' }, isTopImpact: true, co2Saved: 15, createdAt: new Date() },
        { id: 'listing-2', title: 'MacBook Pro 2019', description: 'Great condition laptop, 16GB RAM, 512GB SSD', price: 45000, category: 'Electronics', condition: 'Like New', status: 'available' as const, images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'], seller: { id: 'user-xyz', name: 'Rahul', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' }, isTopImpact: false, co2Saved: 30, createdAt: new Date() },
        { id: 'listing-3', title: 'Engineering Textbooks', description: 'Complete set of 3rd year mechanical engineering books', price: 1200, category: 'Books', condition: 'Good', status: 'available' as const, images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'], seller: { id: 'demo-user-123', name: 'You', avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=4ce68a&color=fff' }, isTopImpact: true, co2Saved: 8, createdAt: new Date() },
        { id: 'listing-4', title: 'Acoustic Guitar', description: 'Yamaha F310, slight scratches but plays beautifully', price: 5500, category: 'Other', condition: 'Fair', status: 'available' as const, images: ['https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400'], seller: { id: 'user-guitar', name: 'Ananya', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' }, isTopImpact: false, co2Saved: 12, createdAt: new Date() },
        { id: 'listing-5', title: 'Study Table', description: 'Wooden study table with drawers, moving out sale', price: 2000, category: 'Home', condition: 'Good', status: 'available' as const, images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400'], seller: { id: 'demo-user-123', name: 'You', avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=4ce68a&color=fff' }, isTopImpact: true, co2Saved: 20, createdAt: new Date() },
    ];

    getListingById(id: string) {
        return this._mockListings.find(l => l.id === id) || null;
    }

    getMockListings() {
        return this._mockListings;
    }

    // ===== TRADES (Mock) =====
    addTrade(trade: any) {
        this._mockTrades.push(trade);
        console.log('[DemoManager] Trade added:', trade.id);
        return trade;
    }

    // ===== USER UPDATE (Mock) =====
    updateUser(updates: Partial<typeof this._mockUser>) {
        Object.assign(this._mockUser, updates);
        console.log('[DemoManager] User updated:', updates);
        return this._mockUser;
    }

    // ===== NOTIFICATIONS (Mock) =====
    addNotification(notification: any) {
        this._mockNotifications.unshift(notification);
        console.log('[DemoManager] Notification added:', notification.id);
        return notification;
    }

    // ===== RECYCLE ZONES (Mock) =====
    getRecycleZones() {
        return [
            { id: 'zone-1', name: 'Campus Eco Center', location: 'Building A, Ground Floor', distance: '0.2 mi', hours: '8am - 8pm', acceptedMaterials: ['electronics', 'plastics', 'paper'] },
            { id: 'zone-2', name: 'Library Drop-off', location: 'Main Library Entrance', distance: '0.4 mi', hours: '24/7', acceptedMaterials: ['books', 'paper', 'cardboard'] },
            { id: 'zone-3', name: 'Student Union', location: 'East Wing', distance: '0.3 mi', hours: '7am - 10pm', acceptedMaterials: ['clothing', 'textiles', 'household'] },
        ];
    }

    sendToRecycling(itemTitle: string, zoneId: string) {
        console.log('[DemoManager] Recycling scheduled:', { itemTitle, zoneId });
        this._mockUser.xp += 10;
        this._mockUser.coins += 5;
        return { success: true, xpEarned: 10, coinsEarned: 5 };
    }

    // ===== SCAN HISTORY (Mock) =====
    private _scanHistory: any[] = [];

    getScanHistory() {
        return this._scanHistory;
    }

    // ===== DEMO MODE (Mock) =====
    setMode(enabled: boolean) {
        this._isDemoMode = enabled;
        console.log('[DemoManager] Demo mode:', enabled);
    }

    getMode() {
        return this._isDemoMode;
    }

    resetAll() {
        this._mockUser.coins = 150;
        this._mockUser.xp = 340;
        this._mockNotifications = [];
        this._mockTrades = [];
        this._scanHistory = [];
        this._redeemedRewards = [];
        console.log('[DemoManager] All data reset');
    }

    // ===== SUCCESS STORIES (Mock) =====
    private _mockStories = [
        { id: 'story-1', title: 'My First Upcycle', author: 'Emma', authorAvatar: 'https://ui-avatars.com/api/?name=Emma', avatar: 'https://ui-avatars.com/api/?name=Emma', content: 'Turned old jeans into a trendy bag!', excerpt: 'Creative upcycling project', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', likes: 45, co2Saved: 8, campus: 'MIT', itemsTraded: 5, category: 'Upcycling' as const, createdAt: new Date() },
        { id: 'story-2', title: 'Zero Waste Week', author: 'Jake', authorAvatar: 'https://ui-avatars.com/api/?name=Jake', avatar: 'https://ui-avatars.com/api/?name=Jake', content: 'Completed a full week without any waste!', excerpt: 'A week-long sustainability journey', image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400', likes: 78, co2Saved: 15, campus: 'Stanford', itemsTraded: 12, category: 'Lifestyle' as const, createdAt: new Date() },
    ];

    getSuccessStories() {
        return this._mockStories;
    }

    getStoryById(id: string) {
        return this._mockStories.find(s => s.id === id) || null;
    }

    // ===== COMMUNITY GOALS (Mock) =====
    getCommunityGoals() {
        return [
            { id: 'goal-1', title: '1000 Items Traded', current: 734, target: 1000, reward: '50 coins', icon: 'swap_horiz' },
            { id: 'goal-2', title: 'Save 500kg CO2', current: 312, target: 500, reward: '100 coins', icon: 'eco' },
        ];
    }

    // ===== LEADERBOARD/RANKINGS (Mock) =====
    getLeaderboard() {
        return [
            { rank: 1, name: 'EcoChampion', avatar: 'https://ui-avatars.com/api/?name=Eco+Champion&background=22c55e&color=fff', xp: 2450, co2Saved: 89 },
            { rank: 2, name: 'GreenWarrior', avatar: 'https://ui-avatars.com/api/?name=Green+Warrior&background=3b82f6&color=fff', xp: 2180, co2Saved: 76 },
            { rank: 3, name: 'SustainableX', avatar: 'https://ui-avatars.com/api/?name=Sustainable+X&background=a855f7&color=fff', xp: 1920, co2Saved: 65 },
        ];
    }

    getCampusRankings() {
        return [
            { rank: 1, name: 'MIT', logo: '🏛️', totalCO2: 12450, members: 324 },
            { rank: 2, name: 'Stanford', logo: '🌲', totalCO2: 11230, members: 298 },
            { rank: 3, name: 'Berkeley', logo: '🐻', totalCO2: 9800, members: 256 },
        ];
    }

    // ===== IMPACT STATS (Mock) =====
    getImpactStats() {
        return {
            totalCO2Saved: 1250,
            totalItemsTraded: 843,
            totalUsersActive: 1245,
            treesEquivalent: 62,
        };
    }

    // ===== TUTORIALS (Mock) =====
    private _mockTutorials = [
        {
            id: 'tutorial-1', title: 'Upcycle a T-Shirt', description: 'Learn to transform old t-shirts into tote bags', thumbnail: 'https://images.unsplash.com/photo-1621955964441-c173e01c135b?w=400', duration: '15 min', difficulty: 'Easy' as const, category: 'Clothing', author: 'EcoEmma', authorAvatar: 'https://ui-avatars.com/api/?name=EcoEmma', steps: [
                { title: 'Gather materials', content: 'Collect an old t-shirt, scissors, and sewing supplies' },
                { title: 'Cut sleeves', content: 'Remove both sleeves by cutting along the seam' },
                { title: 'Sew edges', content: 'Sew the bottom of the shirt closed' },
                { title: 'Add handles', content: 'The armholes become handles!' }
            ], xpReward: 50, icon: '👕', level: 'Beginner' as const, color: '#22c55e', estimatedTime: '15 minutes'
        },
        {
            id: 'tutorial-2', title: 'Jar Planter DIY', description: 'Turn glass jars into beautiful planters', thumbnail: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400', duration: '20 min', difficulty: 'Medium' as const, category: 'Home & Garden', author: 'GreenThumb', authorAvatar: 'https://ui-avatars.com/api/?name=GreenThumb', steps: [
                { title: 'Clean jar', content: 'Wash and dry the jar thoroughly' },
                { title: 'Add drainage', content: 'Add pebbles to the bottom for drainage' },
                { title: 'Paint decoration', content: 'Optional: paint or decorate the jar' },
                { title: 'Add soil and plant', content: 'Fill with soil and add your plant' }
            ], xpReward: 75, icon: '🪴', level: 'Intermediate' as const, color: '#3b82f6', estimatedTime: '20 minutes'
        },
    ];

    getMockTutorials() {
        return this._mockTutorials;
    }

    getTutorialById(id: string) {
        return this._mockTutorials.find(t => t.id === id) || null;
    }

    // ===== CHARITY PARTNERS (Mock) =====
    private _mockCharityPartners = [
        { id: 'charity-1', name: 'Trees for Future', description: 'Plant trees worldwide', logo: '🌳', impact: '1 tree per 50 coins', minDonation: 50, category: 'environment' },
        { id: 'charity-2', name: 'Ocean Cleanup', description: 'Remove plastic from oceans', logo: '🌊', impact: '1lb plastic per 25 coins', minDonation: 25, category: 'environment' },
        { id: 'charity-3', name: 'Local Food Bank', description: 'Feed hunger in your community', logo: '🍎', impact: '1 meal per 10 coins', minDonation: 10, category: 'community' },
    ];

    getCharityPartners() {
        return this._mockCharityPartners;
    }

    getCharityById(id: string) {
        return this._mockCharityPartners.find(c => c.id === id) || null;
    }

    donateToCharity(charityId: string, coins: number) {
        this._mockUser.coins = Math.max(0, this._mockUser.coins - coins);
        console.log('[DemoManager] Donated', coins, 'to charity', charityId);
        return { success: true, remainingCoins: this._mockUser.coins };
    }

    // ===== GIVE BACK PAGE DATA =====

    // Community-wide donation stats
    getGiveBackStats() {
        return {
            totalDonations: 24850,
            treesPlanted: 342,
            mealsProvided: 1560,
            plasticRemoved: 890, // lbs
            co2Offset: 6840, // kg
            activeDonors: 523,
            weeklyGoal: 30000,
            weeklyProgress: 21500,
        };
    }

    // Recent community donations for live feed
    getRecentDonations() {
        return [
            { id: 'd1', userName: 'Priya S.', avatar: '👩🏽', action: 'planted a tree', charity: 'Trees for Future', coins: 50, timeAgo: '2 min ago' },
            { id: 'd2', userName: 'Rahul M.', avatar: '👨🏻', action: 'donated a meal', charity: 'Local Food Bank', coins: 10, timeAgo: '5 min ago' },
            { id: 'd3', userName: 'Sneha K.', avatar: '👩🏻', action: 'cleaned the ocean', charity: 'Ocean Cleanup', coins: 25, timeAgo: '8 min ago' },
            { id: 'd4', userName: 'Vikram A.', avatar: '👨🏽', action: 'planted 2 trees', charity: 'Trees for Future', coins: 100, timeAgo: '12 min ago' },
            { id: 'd5', userName: 'Ananya R.', avatar: '👩🏾', action: 'donated 5 meals', charity: 'Local Food Bank', coins: 50, timeAgo: '15 min ago' },
            { id: 'd6', userName: 'Arjun K.', avatar: '👨🏾', action: 'cleaned the ocean', charity: 'Ocean Cleanup', coins: 75, timeAgo: '20 min ago' },
            { id: 'd7', userName: 'Meera P.', avatar: '👩🏽', action: 'planted a tree', charity: 'Trees for Future', coins: 50, timeAgo: '25 min ago' },
            { id: 'd8', userName: 'Dev J.', avatar: '👨🏻', action: 'donated 10 meals', charity: 'Local Food Bank', coins: 100, timeAgo: '30 min ago' },
        ];
    }

    // User's personal donation history
    getUserDonationHistory() {
        return {
            totalDonated: 175,
            treesPlanted: 2,
            mealsProvided: 5,
            plasticRemoved: 2, // lbs
            lastDonation: new Date(Date.now() - 86400000),
            streak: 3,
        };
    }

    // Enhanced charity data with goals
    getCharityGoals() {
        return [
            {
                id: 'charity-1',
                name: 'Trees for Future',
                description: 'Plant trees worldwide to fight climate change',
                longDescription: 'Partner with local communities to plant native trees, restore ecosystems, and create sustainable livelihoods.',
                logo: '🌳',
                impact: '1 tree per 50 coins',
                impactMetric: 'trees planted',
                minDonation: 50,
                category: 'environment',
                goal: 500,
                current: 342,
                color: 'green',
                featured: true,
            },
            {
                id: 'charity-2',
                name: 'Ocean Cleanup',
                description: 'Remove plastic from oceans',
                longDescription: 'Deploy advanced technology to remove millions of pounds of plastic from our oceans and rivers.',
                logo: '🌊',
                impact: '1lb plastic per 25 coins',
                impactMetric: 'lbs removed',
                minDonation: 25,
                category: 'environment',
                goal: 1000,
                current: 890,
                color: 'blue',
                featured: false,
                almostThere: true,
            },
            {
                id: 'charity-3',
                name: 'Local Food Bank',
                description: 'Feed hunger in your community',
                longDescription: 'Provide nutritious meals to families in need across college towns and local communities.',
                logo: '🍎',
                impact: '1 meal per 10 coins',
                impactMetric: 'meals provided',
                minDonation: 10,
                category: 'community',
                goal: 2000,
                current: 1560,
                color: 'orange',
                featured: false,
                popular: true,
            },
        ];
    }

    // Charity partner stories - what they're doing with donations
    getCharityStories() {
        return [
            {
                id: 's1',
                charityId: 'charity-1',
                charityName: 'Trees for Future',
                charityLogo: '🌳',
                thumbnail: '🌱',
                title: 'Just planted 50 trees in Kerala!',
                timeAgo: '2h ago',
                viewed: false,
            },
            {
                id: 's2',
                charityId: 'charity-2',
                charityName: 'Ocean Cleanup',
                charityLogo: '🌊',
                thumbnail: '🐢',
                title: 'Beach cleanup in Goa - 200kg collected!',
                timeAgo: '5h ago',
                viewed: false,
            },
            {
                id: 's3',
                charityId: 'charity-3',
                charityName: 'Local Food Bank',
                charityLogo: '🍎',
                thumbnail: '👨‍👩‍👧',
                title: 'Fed 150 families this week',
                timeAgo: '1d ago',
                viewed: true,
            },
            {
                id: 's4',
                charityId: 'charity-1',
                charityName: 'Trees for Future',
                charityLogo: '🌳',
                thumbnail: '🌿',
                title: 'New nursery in Tamil Nadu',
                timeAgo: '2d ago',
                viewed: true,
            },
        ];
    }


    // ===== ADMIN METHODS =====

    // Update user profile fields
    adminUpdateUser(updates: Partial<User>) {
        this._mockUser = { ...this._mockUser, ...updates };
        console.log('[Admin] Updated user:', updates);
        this.notifyListeners();
        return this._mockUser;
    }

    // Set specific user field
    adminSetUserField(field: keyof User, value: any) {
        (this._mockUser as any)[field] = value;
        console.log('[Admin] Set user field:', field, '=', value);
        this.notifyListeners();
        return this._mockUser;
    }

    // Add XP and handle level up
    adminAddXP(amount: number) {
        this._mockUser.xp = (this._mockUser.xp || 0) + amount;
        // Simple level calculation (every 1000 XP = 1 level)
        const newLevel = Math.floor(this._mockUser.xp / 1000) + 1;
        if (newLevel !== this._mockUser.level) {
            this._mockUser.level = newLevel;
            this._mockUser.levelTitle = this.getLevelTitle(newLevel);
        }
        this.notifyListeners();
        return this._mockUser;
    }

    private getLevelTitle(level: number): string {
        const titles = ['Seedling', 'Sapling', 'Tree', 'Grove', 'Forest', 'Rainforest', 'Ecosystem'];
        return titles[Math.min(level - 1, titles.length - 1)];
    }

    // Add/remove badges
    adminAddBadge(badge: string) {
        if (!this._mockUser.badges.includes(badge)) {
            this._mockUser.badges.push(badge);
        }
        this.notifyListeners();
        return this._mockUser.badges;
    }

    adminRemoveBadge(badge: string) {
        this._mockUser.badges = this._mockUser.badges.filter(b => b !== badge);
        this.notifyListeners();
        return this._mockUser.badges;
    }

    // Get all available badges
    getAllBadges() {
        return [
            { id: 'early-adopter', name: 'Early Adopter', icon: '🌟', description: 'Joined during beta' },
            { id: 'eco-warrior', name: 'Eco Warrior', icon: '🌍', description: '10+ items traded' },
            { id: 'scanner-pro', name: 'Scanner Pro', icon: '📸', description: '50+ items scanned' },
            { id: 'streak-master', name: 'Streak Master', icon: '🔥', description: '7-day streak' },
            { id: 'trader-elite', name: 'Trader Elite', icon: '💎', description: '25+ trades completed' },
            { id: 'upcycler', name: 'Upcycler', icon: '♻️', description: 'Completed upcycle project' },
            { id: 'carbon-hero', name: 'Carbon Hero', icon: '🌲', description: 'Saved 100kg CO₂' },
            { id: 'campus-legend', name: 'Campus Legend', icon: '🏆', description: 'Top 10 on leaderboard' },
            { id: 'generous-soul', name: 'Generous Soul', icon: '❤️', description: 'Donated to charity' },
            { id: 'first-trade', name: 'First Trade', icon: '🤝', description: 'Completed first trade' },
        ];
    }

    // Add/update listing
    adminAddListing(listing: any) {
        this._mockListings.push({ ...listing, id: `listing-${Date.now()}` });
        return this._mockListings;
    }

    adminUpdateListing(id: string, updates: any) {
        const index = this._mockListings.findIndex(l => l.id === id);
        if (index !== -1) {
            this._mockListings[index] = { ...this._mockListings[index], ...updates };
        }
        return this._mockListings[index];
    }

    adminDeleteListing(id: string) {
        this._mockListings = this._mockListings.filter(l => l.id !== id);
        return this._mockListings;
    }

    // Update trade status
    adminUpdateTrade(id: string, updates: any) {
        const index = this._mockTrades.findIndex(t => t.id === id);
        if (index !== -1) {
            this._mockTrades[index] = { ...this._mockTrades[index], ...updates };
        }
        return this._mockTrades[index];
    }

    // Get all data for admin panel
    adminGetAllData() {
        return {
            user: this._mockUser,
            listings: this._mockListings,
            trades: this._mockTrades,
            rewards: this._mockRewards,
            redeemedRewards: this._redeemedRewards,
            messages: this._mockMessages,
            transactions: this._mockTransactions,
        };
    }

    // Reset specific data
    adminResetCoins(amount: number = 450) {
        this._mockUser.coins = amount;
        return this._mockUser.coins;
    }

    adminResetXP(amount: number = 2800) {
        this._mockUser.xp = amount;
        this._mockUser.level = Math.floor(amount / 1000) + 1;
        this._mockUser.levelTitle = this.getLevelTitle(this._mockUser.level);
        return this._mockUser;
    }

    // Add other methods that might be called by legacy pages
    // to prevent runtime errors
}

const DemoManager = new DemoManagerService();
export default DemoManager;
