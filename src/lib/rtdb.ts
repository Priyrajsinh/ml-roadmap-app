'use client';

import { getDatabase } from 'firebase/database';
import { auth } from '@/lib/firebase';

// Realtime Database instance derived from the already-initialized Firebase app.
// The default database URL is https://{projectId}-default-rtdb.firebaseio.com
export const rtdb = getDatabase(auth.app);
