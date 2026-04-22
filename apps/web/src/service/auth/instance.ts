import { postEmailSignIn, postGoogleSignIn, postRefreshToken, postSignOut, postSignUp } from "@/api/auth";
import { docsCacheClear } from "@/query/cache";
import type { EmailSignInRequestParams } from "@/schema/api/auth/emailSignIn";
import type { GoogleSignInRequestParams } from "@/schema/api/auth/googleSignIn";
import type { SignUpRequestParams } from "@/schema/api/auth/signUp";
import { authResponseSchema } from "@/schema/api/auth/auth";
import type { z } from "zod";

export class Auth {
    private _refreshPromise: Promise<z.infer<typeof authResponseSchema>> | null = null;

    public get accessToken(): string | null {
        return localStorage.getItem('accessToken');
    }

    public get refreshToken(): string | null {
        return localStorage.getItem('refreshToken');
    }

    public get isLogined(): boolean {
        return !!this.accessToken;
    }

    public set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    public set refreshToken(token: string) {
        localStorage.setItem('refreshToken', token);
    }

    removeAccessToken = () => {
        localStorage.removeItem('accessToken');
    }

    removeRefreshToken = () => {
        localStorage.removeItem('refreshToken');
    }

    signIn = async (params: GoogleSignInRequestParams | EmailSignInRequestParams) => {
        if ('code' in params) {
            const { accessToken, refreshToken } = await postGoogleSignIn(params);
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
        } else {
            const { accessToken, refreshToken } = await postEmailSignIn(params);
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
        }
    }

    signOut = async () => {
        try {
            if (this.refreshToken) await postSignOut(this.refreshToken);
        } finally {
            this.removeAccessToken();
            this.removeRefreshToken();
            docsCacheClear();
            localStorage.setItem(
                'redirectTo',
                window.location.pathname + window.location.search
            );
            window.location.href = '/';
        }

    }

    signUp = async (params: SignUpRequestParams) => {
        const { accessToken, refreshToken } = await postSignUp(params);
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    refresh = async () => {
        if (!this.refreshToken) {
            throw new Error('Refresh token not found');
        }

        if (!this._refreshPromise) {
            this._refreshPromise = postRefreshToken(this.refreshToken);
        }

        try {
            const { accessToken, refreshToken } = await this._refreshPromise;

            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
        } catch (error) {
            console.error(error);
            this.signOut();
        } finally {
            this._refreshPromise = null;
        }
    }
}

export const auth = new Auth();