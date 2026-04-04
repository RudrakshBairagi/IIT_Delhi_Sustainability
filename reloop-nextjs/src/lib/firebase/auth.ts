import { DBService } from "./db";
import { isAllowedEduEmail, getAllowedDomainsMessage } from "@/lib/utils/auth-helpers";
import DemoManager from "@/lib/demo-manager";

export class EduEmailError extends Error {
    constructor(email: string) {
        super(`Only institutional emails allowed (${getAllowedDomainsMessage()}). You tried to sign in with: ${email}`);
        this.name = 'EduEmailError';
    }
}

export const AuthService = {
    async signInWithGoogle() {
        // Mock successful sign in
        DemoManager.setMode(true);
        return DemoManager.getMockUser();
    },

    async signInWithEmail(email: string, password: string) {
        if (!isAllowedEduEmail(email)) {
            throw new EduEmailError(email);
        }
        DemoManager.setMode(true);
        return DemoManager.getMockUser();
    },

    async registerWithEmail(email: string, password: string, name: string, hostel?: string, room?: string) {
        if (!isAllowedEduEmail(email)) {
            throw new EduEmailError(email);
        }
        DemoManager.setMode(true);
        DemoManager.adminUpdateUser({ email, name, hostel, room });
        return DemoManager.getMockUser();
    },

    async logout() {
        DemoManager.resetAll();
    },

    async sendPasswordResetEmail(email: string) {
        if (!isAllowedEduEmail(email)) {
            throw new EduEmailError(email);
        }
        console.log(`Mock reset email sent to ${email}`);
    }
};
