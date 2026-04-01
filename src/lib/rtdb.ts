'use client';

import { getDatabase } from 'firebase/database';
import { app } from '@/lib/firebase';

export const rtdb = getDatabase(app);
