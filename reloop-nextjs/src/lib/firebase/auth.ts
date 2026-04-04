import {
    signInWithPopup,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    User as FirebaseUser
} from "firebase/auth";
import { auth } from "./client";
import { DBService } from "./db";

export const AuthService = {
    async signInWithGoogle() {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            // Create/Update user in Firestore
            await DBService.createUserProfile({
                uid: result.user.uid,
                name: result.user.displayName || 'User',
                email: result.user.email || '',
                avatar: result.user.photoURL || '',
                level: 1,
                coins: 0,
                xp: 0,
                levelTitle: 'Seedling',
                itemsTraded: 0,
                co2Saved: 0,
                badges: []
            });

            return result.user;
        } catch (error) {
            console.error("Google Sign In Error", error);
            throw error;
        }
    },

    async logout() {
        await firebaseSignOut(auth);
    }
};
