// ============================================================
// AuthService — Microsoft/Xbox authentication flow.
// Uses official Microsoft OAuth2 for Minecraft accounts.
// Stores credentials only in OS-backed secure storage.
// ============================================================

import type { AuthCredentials, StoredAccount } from '../types';

const MS_AUTH_URL = 'https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize';
const MS_TOKEN_URL = 'https://login.microsoftonline.com/consumers/oauth2/v2.0/token';
const XBOX_AUTH_URL = 'https://user.auth.xboxlive.com/user/authenticate';
const XSTS_AUTH_URL = 'https://xsts.auth.xboxlive.com/xsts/authorize';
const MC_AUTH_URL = 'https://api.minecraftservices.com/authentication/login_with_xbox';
const MC_PROFILE_URL = 'https://api.minecraftservices.com/minecraft/profile';
const MC_OWNERSHIP_URL = 'https://api.minecraftservices.com/entitlements/mcstore';

let _fetch: typeof fetch = globalThis.fetch.bind(globalThis);

export function setFetch(f: typeof fetch) {
  _fetch = f;
}

/** Start the Microsoft OAuth2 flow. Returns the authorization URL. */
export function getMicrosoftAuthUrl(clientId: string, redirectUri: string): string {
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: 'XboxLive.signin offline_access',
    response_mode: 'query',
  });
  return `${MS_AUTH_URL}?${params.toString()}`;
}

/** Exchange auth code for Microsoft token */
export async function exchangeCodeForToken(
  code: string,
  clientId: string,
  redirectUri: string
): Promise<{ accessToken: string; refreshToken: string }> {
  const body = new URLSearchParams({
    client_id: clientId,
    code,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
  });

  const response = await _fetch(MS_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) throw new Error(`Microsoft token exchange failed: ${response.status}`);
  const data = await response.json();
  return { accessToken: data.access_token, refreshToken: data.refresh_token };
}

/** Authenticate with Xbox Live */
export async function authenticateWithXbox(
  msAccessToken: string
): Promise<{ xboxToken: string; userHash: string }> {
  const response = await _fetch(XBOX_AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      Properties: {
        AuthMethod: 'RPS',
        SiteName: 'user.auth.xboxlive.com',
        RpsTicket: `d=${msAccessToken}`,
      },
      RelyingParty: 'http://auth.xboxlive.com',
      TokenType: 'JWT',
    }),
  });

  if (!response.ok) throw new Error(`Xbox authentication failed: ${response.status}`);
  const data = await response.json();
  return { xboxToken: data.Token, userHash: data.DisplayClaims.xui[0].uhs };
}

/** Authenticate with XSTS (Xbox Security Token Service) */
export async function authenticateWithXSTS(
  xboxToken: string
): Promise<{ xstsToken: string; userHash: string }> {
  const response = await _fetch(XSTS_AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      Properties: {
        SandboxId: 'RETAIL',
        UserTokens: [xboxToken],
      },
      RelyingParty: 'rp://api.minecraftservices.com/',
      TokenType: 'JWT',
    }),
  });

  if (!response.ok) throw new Error(`XSTS authentication failed: ${response.status}`);
  const data = await response.json();
  return { xstsToken: data.Token, userHash: data.DisplayClaims.xui[0].uhs };
}

/** Authenticate with Minecraft using XSTS token */
export async function authenticateWithMinecraft(
  xstsToken: string,
  userHash: string
): Promise<string> {
  const response = await _fetch(MC_AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identityToken: `XBL3.0 x=${userHash};${xstsToken}`,
    }),
  });

  if (!response.ok) throw new Error(`Minecraft authentication failed: ${response.status}`);
  const data = await response.json();
  return data.access_token;
}

/** Get Minecraft profile */
export async function getMinecraftProfile(
  accessToken: string
): Promise<{ uuid: string; username: string }> {
  const response = await _fetch(MC_PROFILE_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) throw new Error(`Failed to get Minecraft profile: ${response.status}`);
  const data = await response.json();
  return { uuid: data.id, username: data.name };
}

/** Check game ownership */
export async function checkGameOwnership(accessToken: string): Promise<boolean> {
  const response = await _fetch(MC_OWNERSHIP_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) return false;
  const data = await response.json();
  return (data.items?.length ?? 0) > 0;
}

/** Create auth credentials object */
export function createAuthCredentials(
  accessToken: string,
  username: string,
  uuid: string
): AuthCredentials {
  return {
    accessToken,
    username,
    uuid,
    userType: 'msa',
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };
}

/** Check if credentials are expired */
export function isCredentialsExpired(creds: AuthCredentials): boolean {
  return Date.now() > creds.expiresAt;
}

/** Store account info (no tokens stored — only for display) */
export function createStoredAccount(
  username: string,
  uuid: string
): StoredAccount {
  return {
    id: 'acct_' + Date.now().toString(36),
    username,
    uuid,
    userType: 'msa',
    addedAt: new Date().toISOString(),
  };
}