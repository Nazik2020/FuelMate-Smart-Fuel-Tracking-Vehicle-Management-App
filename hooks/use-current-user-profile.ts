import { auth, db } from "@/config/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

interface UserDocument {
  username?: string;
  usernameLower?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  photoURL?: string;
  createdAt?:
    | {
        toDate?: () => Date;
      }
    | Date
    | null;
}

interface UseCurrentUserProfileState {
  user: User | null;
  profile: UserDocument | null;
  displayName: string | null;
  email: string | null;
}

const normalizeDisplayValue = (value?: string | null) => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

const capitalizeFallback = (value?: string | null) => {
  const normalized = normalizeDisplayValue(value);
  if (!normalized) {
    return null;
  }

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const deriveDisplayName = (user: User | null, profile: UserDocument | null) => {
  return (
    normalizeDisplayValue(profile?.username) ??
    capitalizeFallback(profile?.usernameLower) ??
    normalizeDisplayValue(profile?.firstName) ??
    capitalizeFallback(user?.email?.split("@")[0] ?? null) ??
    null
  );
};

const deriveEmail = (user: User | null, profile: UserDocument | null) => {
  return normalizeDisplayValue(profile?.email) ?? user?.email ?? null;
};

export function useCurrentUserProfile() {
  const [state, setState] = useState<UseCurrentUserProfileState>(() => ({
    user: null,
    profile: null,
    displayName: null,
    email: null,
  }));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!isMounted) {
        return;
      }

      if (!firebaseUser) {
        setState({ user: null, profile: null, displayName: null, email: null });
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const snapshot = await getDoc(doc(db, "users", firebaseUser.uid));
        const profileData = (
          snapshot.exists() ? snapshot.data() : null
        ) as UserDocument | null;

        if (!isMounted) {
          return;
        }

        setState({
          user: firebaseUser,
          profile: profileData,
          displayName: deriveDisplayName(firebaseUser, profileData),
          email: deriveEmail(firebaseUser, profileData),
        });
      } catch (_error) {
        if (!isMounted) {
          return;
        }

        setState({
          user: firebaseUser,
          profile: null,
          displayName: deriveDisplayName(firebaseUser, null),
          email: deriveEmail(firebaseUser, null),
        });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return { ...state, loading };
}

export type CurrentUserProfile = ReturnType<typeof useCurrentUserProfile>;
