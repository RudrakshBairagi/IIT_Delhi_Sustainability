import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    getDoc,
    query,
    orderBy,
    where,
    serverTimestamp,
    setDoc,
    onSnapshot,
    limit,
    Unsubscribe,
    runTransaction
} from "firebase/firestore";
import { db } from "./client";
import { Listing, User, Trade } from "@/types";

export const DBService = {
    // USERS
    async createUserProfile(user: User) {
        // Ensure user document exists or update it
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
            ...user,
            lastLogin: serverTimestamp()
        }, { merge: true });
    },

    async getUserProfile(uid: string): Promise<User | null> {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as User;
        }
        return null;
    },

    // LISTINGS
    async createListing(listingData: Omit<Listing, 'id' | 'createdAt'>) {
        try {
            // Generate ID client-side to save a write operation
            const newRef = doc(collection(db, "listings"));
            await setDoc(newRef, {
                ...listingData,
                id: newRef.id,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            return newRef.id;
        } catch (error) {
            console.error("Error creating listing:", error);
            throw error;
        }
    },

    async getListings(): Promise<Listing[]> {
        try {
            const q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Listing[];
        } catch (error) {
            console.error("Error fetching listings:", error);
            return [];
        }
    },

    async getListingById(id: string): Promise<Listing | null> {
        try {
            const docRef = doc(db, "listings", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as Listing;
            }
            return null;
        } catch (error) {
            console.error("Error fetching listing:", error);
            return null;
        }
    },

    async getUserListings(userId: string): Promise<Listing[]> {
        try {
            const q = query(
                collection(db, "listings"),
                where("seller.id", "==", userId),
                orderBy("createdAt", "desc")
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Listing[];
        } catch (error) {
            console.error("Error fetching user listings:", error);
            return [];
        }
    },

    async deleteListing(listingId: string, userId: string): Promise<boolean> {
        try {
            // Verify ownership before deleting
            const listing = await this.getListingById(listingId);
            if (!listing || listing.seller.id !== userId) {
                console.error("Unauthorized: Cannot delete listing");
                return false;
            }

            const docRef = doc(db, "listings", listingId);
            await deleteDoc(docRef);
            return true;
        } catch (error) {
            console.error("Error deleting listing:", error);
            return false;
        }
    },

    async updateListingStatus(listingId: string, status: 'available' | 'sold' | 'pending'): Promise<boolean> {
        try {
            const docRef = doc(db, "listings", listingId);
            await updateDoc(docRef, { status, updatedAt: serverTimestamp() });
            return true;
        } catch (error) {
            console.error("Error updating listing status:", error);
            return false;
        }
    },

    // MESSAGES & CONVERSATIONS
    async getConversations(userId: string) {
        try {
            const q = query(
                collection(db, "conversations"),
                where("participants", "array-contains", userId),
                orderBy("lastMessageAt", "desc")
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching conversations:", error);
            return [];
        }
    },

    async getMessages(conversationId: string) {
        try {
            const q = query(
                collection(db, "conversations", conversationId, "messages"),
                orderBy("timestamp", "asc")
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching messages:", error);
            return [];
        }
    },

    async sendMessage(conversationId: string, senderId: string, text: string) {
        try {
            const messagesRef = collection(db, "conversations", conversationId, "messages");
            await addDoc(messagesRef, {
                senderId,
                text,
                timestamp: serverTimestamp()
            });
            // Update conversation's lastMessage
            const convRef = doc(db, "conversations", conversationId);
            await updateDoc(convRef, {
                lastMessage: text,
                lastMessageAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    },

    async createConversation(participant1: string, participant2: string, listingId?: string, listingTitle?: string) {
        try {
            // Updated to single-write pattern
            const newRef = doc(collection(db, "conversations"));
            await setDoc(newRef, {
                id: newRef.id,
                participants: [participant1, participant2],
                listingId: listingId || null,
                listingTitle: listingTitle || null,
                lastMessage: '',
                lastMessageAt: serverTimestamp(),
                createdAt: serverTimestamp()
            });
            return newRef.id;
        } catch (error) {
            console.error("Error creating conversation:", error);
            throw error;
        }
    },

    // NOTIFICATIONS
    async getNotifications(userId: string) {
        try {
            const q = query(
                collection(db, "notifications"),
                where("userId", "==", userId),
                orderBy("createdAt", "desc")
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching notifications:", error);
            return [];
        }
    },

    async markNotificationRead(notificationId: string) {
        try {
            const notifRef = doc(db, "notifications", notificationId);
            await updateDoc(notifRef, { read: true });
        } catch (error) {
            console.error("Error marking notification read:", error);
        }
    },

    // TRANSACTIONS (Trade History)
    async getUserTransactions(userId: string) {
        try {
            const q = query(
                collection(db, "transactions"),
                where("participants", "array-contains", userId),
                orderBy("createdAt", "desc")
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching transactions:", error);
            return [];
        }
    },

    // REAL-TIME MESSAGE SUBSCRIPTION
    subscribeToMessages(
        conversationId: string,
        callback: (messages: any[]) => void
    ): Unsubscribe {
        const q = query(
            collection(db, "conversations", conversationId, "messages"),
            orderBy("timestamp", "asc")
        );
        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(messages);
        });
    },

    // FIND OR CREATE CONVERSATION
    async findOrCreateConversation(
        userId: string,
        sellerId: string,
        listingId?: string,
        listingTitle?: string
    ): Promise<string> {
        try {
            // Check if conversation exists
            const q = query(
                collection(db, "conversations"),
                where("participants", "array-contains", userId)
            );
            const snapshot = await getDocs(q);

            // Find existing conversation with both participants
            const existing = snapshot.docs.find(doc => {
                const data = doc.data();
                return data.participants.includes(sellerId);
            });

            if (existing) {
                return existing.id;
            }

            // Create new conversation
            return await this.createConversation(userId, sellerId, listingId, listingTitle);
        } catch (error) {
            console.error("Error finding/creating conversation:", error);
            throw error;
        }
    },

    // TRADES
    async createTrade(tradeData: Omit<Trade, 'id' | 'createdAt'>): Promise<string> {
        try {
            // Updated to single-write pattern
            const newRef = doc(collection(db, "trades"));
            await setDoc(newRef, {
                ...tradeData,
                id: newRef.id,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                status: 'pending'
            });
            return newRef.id;
        } catch (error) {
            console.error("Error creating trade:", error);
            throw error;
        }
    },

    async getUserTrades(userId: string): Promise<Trade[]> {
        try {
            // Get trades where user is seller
            const sellerQuery = query(
                collection(db, "trades"),
                where("sellerId", "==", userId),
                orderBy("createdAt", "desc")
            );
            const sellerSnapshot = await getDocs(sellerQuery);

            // Get trades where user is trader (buyer)
            const traderQuery = query(
                collection(db, "trades"),
                where("traderId", "==", userId),
                orderBy("createdAt", "desc")
            );
            const traderSnapshot = await getDocs(traderQuery);

            const allTrades = [
                ...sellerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Trade)),
                ...traderSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Trade))
            ];

            // Sort by createdAt descending
            return allTrades.sort((a, b) => {
                const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
                const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
                return bTime - aTime;
            });
        } catch (error) {
            console.error("Error fetching trades:", error);
            return [];
        }
    },

    async updateTradeStatus(
        tradeId: string,
        status: 'accepted' | 'declined' | 'completed',
        additionalData?: Record<string, any>
    ) {
        try {
            const tradeRef = doc(db, "trades", tradeId);
            await updateDoc(tradeRef, {
                status,
                ...(status === 'completed' ? { completedAt: serverTimestamp() } : {}),
                ...additionalData
            });
        } catch (error) {
            console.error("Error updating trade status:", error);
            throw error;
        }
    },

    // COIN TRANSFER (Atomic Transaction)
    async transferCoins(fromUserId: string, toUserId: string, amount: number) {
        try {
            await runTransaction(db, async (transaction) => {
                const fromUserRef = doc(db, "users", fromUserId);
                const toUserRef = doc(db, "users", toUserId);

                const fromUserDoc = await transaction.get(fromUserRef);
                const toUserDoc = await transaction.get(toUserRef);

                if (!fromUserDoc.exists() || !toUserDoc.exists()) {
                    throw new Error("One or both users not found");
                }

                const fromUserData = fromUserDoc.data() as User;
                const toUserData = toUserDoc.data() as User;

                const currentFromBalance = fromUserData.coins || 0;

                if (currentFromBalance < amount) {
                    throw new Error("Insufficient coins");
                }

                const newFromBalance = currentFromBalance - amount;
                const newToBalance = (toUserData.coins || 0) + amount;

                transaction.update(fromUserRef, { coins: newFromBalance });
                transaction.update(toUserRef, { coins: newToBalance });
            });

            return { success: true };
        } catch (error) {
            console.error("Error transferring coins:", error);
            throw error;
        }
    }
};
