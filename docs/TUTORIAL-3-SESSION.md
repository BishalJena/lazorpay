# Tutorial 3: Session Persistence

> Learn how to keep users logged in across browser sessions for a seamless experience.

## Overview

This tutorial covers:
1. How LazorKit handles sessions
2. Auto-reconnect on page load
3. Session storage and management
4. Logout and session clearing

---

## How Sessions Work

When a user connects with a passkey:

```
1. User authenticates with biometric
2. LazorKit stores session data in localStorage:
   - Credential ID
   - Wallet address
   - Session tokens
3. On next visit, LazorKit checks for existing session
4. If valid, user is auto-connected (may prompt for biometric again)
```

**Result**: Users don't have to "Connect" every time they visit.

---

## Default Behavior

LazorKit handles session persistence automatically. When you use the `useWallet` hook:

```tsx
const { isConnected, wallet } = useWallet();

// On page load:
// - If session exists → isConnected may become true automatically
// - If no session → isConnected is false, user needs to connect
```

---

## Controlling Session Behavior

### Check Connection on Mount

```tsx
"use client";

import { useWallet } from "@lazorkit/wallet";
import { useEffect, useState } from "react";

function SessionStatus() {
  const { isConnected, wallet } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch
  if (!mounted) return null;

  return (
    <div>
      {isConnected ? (
        <p>Welcome back! Wallet: {wallet?.smartWallet.slice(0, 8)}...</p>
      ) : (
        <p>Please connect to continue.</p>
      )}
    </div>
  );
}
```

### Force Re-authentication

Sometimes you want users to re-authenticate even with a valid session:

```tsx
const { connect, disconnect } = useWallet();

const handleSecureAction = async () => {
  // Disconnect first to clear session
  await disconnect();
  
  // Force fresh authentication
  await connect();
  
  // Now proceed with sensitive action
};
```

---

## Session Storage Details

LazorKit stores session data in the browser's localStorage. The exact keys may vary, but typically include:

| Key | Contents |
|-----|----------|
| Credential ID | WebAuthn credential identifier |
| Wallet Address | The smart wallet PDA |
| Session Token | Authentication state |

**Security Note**: The private key is NEVER stored in localStorage. It remains in the device's Secure Enclave.

---

## Complete Session Manager Component

Here's a component that demonstrates session management:

```tsx
// components/SessionManager.tsx
"use client";

import { useWallet } from "@lazorkit/wallet";
import { useEffect, useState } from "react";

export function SessionManager() {
  const { isConnected, isConnecting, wallet, connect, disconnect } = useWallet();
  
  const [sessionInfo, setSessionInfo] = useState({
    hasStoredSession: false,
  });

  // Check for stored session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = () => {
    // Check if any LazorKit session data exists
    const hasSession = Object.keys(localStorage).some(
      key => key.includes("lazor") || key.includes("wallet")
    );
    setSessionInfo({ hasStoredSession: hasSession });
  };

  const handleReconnect = async () => {
    try {
      await connect();
      checkSession();
    } catch (error) {
      console.error("Reconnection failed:", error);
    }
  };

  const handleClearSession = async () => {
    try {
      await disconnect();
      
      // Clear any stored session data
      Object.keys(localStorage).forEach(key => {
        if (key.includes("lazor") || key.includes("wallet")) {
          localStorage.removeItem(key);
        }
      });
      
      checkSession();
    } catch (error) {
      console.error("Failed to clear session:", error);
    }
  };

  return (
    <div>
      <h3>Session Status</h3>
      
      <div>
        <p>Connected: {isConnected ? "Yes ✅" : "No ❌"}</p>
        <p>Stored Session: {sessionInfo.hasStoredSession ? "Found" : "None"}</p>
        {wallet && <p>Wallet: {wallet.smartWallet}</p>}
      </div>

      <div>
        {!isConnected && (
          <button onClick={handleReconnect} disabled={isConnecting}>
            {isConnecting ? "Connecting..." : "Connect / Restore Session"}
          </button>
        )}

        <button onClick={handleClearSession}>
          Logout & Clear Session
        </button>
      </div>
    </div>
  );
}
```

---

## Session Expiry

LazorKit sessions eventually expire for security. When a session expires:

1. `isConnected` becomes `false`
2. User needs to re-authenticate with biometric
3. The same wallet is reconnected (no new wallet created)

Handle this gracefully:

```tsx
const { isConnected } = useWallet();

useEffect(() => {
  if (!isConnected) {
    // Session may have expired
    // Show login prompt or auto-reconnect
  }
}, [isConnected]);
```

---

## Best Practices

### 1. Avoid Hydration Mismatches

```tsx
const [mounted, setMounted] = useState(false);

useEffect(() => setMounted(true), []);

// Always check mounted before rendering conditional content
if (!mounted) return <LoadingSkeleton />;
```

### 2. Handle Connection Errors

```tsx
const handleConnect = async () => {
  try {
    await connect();
  } catch (error) {
    if (error.message.includes("cancelled")) {
      // User dismissed the prompt
    } else {
      // Actual error - show message
    }
  }
};
```

### 3. Clear Session on Logout

```tsx
const handleLogout = async () => {
  await disconnect();
  // Optionally clear local data
  // Redirect to login page
  router.push("/login");
};
```

---

## Troubleshooting

**Session not persisting?**
- Check if localStorage is available (not in incognito mode with blocks)
- Verify cookies/storage aren't being cleared by browser

**Auto-connect not working?**
- Session may have expired
- Browser may have cleared storage
- Try manual connect

**"Already connected" issues?**
- Call `disconnect()` before `connect()` if needed
- Check `isConnected` state before connecting

---

## Summary

| Feature | How It Works |
|---------|--------------|
| Session Storage | localStorage (automatic) |
| Auto-reconnect | LazorKit checks on provider mount |
| Session Expiry | Handled automatically |
| Logout | Call `disconnect()` |
| Full Clear | `disconnect()` + clear localStorage |

---

## Previous Tutorials

- [Tutorial 1: Passkey Authentication](./TUTORIAL-1-PASSKEY.md)
- [Tutorial 2: Gasless Transactions](./TUTORIAL-2-GASLESS.md)
