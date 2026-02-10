// src/scripts/debug-imports.ts
console.log('Checking for mongoose...');

// Try to require mongoose
try {
    // @ts-ignore
    const mongoose = require('mongoose');
    console.log('❌ mongoose found via require:', mongoose.version);
} catch (e) {
    console.log('✅ mongoose not found via require');
}

// Check global
// @ts-ignore
if (global.mongoose) {
    console.log('❌ mongoose found in global scope');
} else {
    console.log('✅ mongoose not found in global scope');
}

import { createClient } from '@supabase/supabase-js';
console.log('✅ Supabase import successful');

console.log('Checking imports...');
try {
    // @ts-ignore
    const { JOB_DATA } = require('../data/jobs');
    console.log('✅ JOB_DATA required successfully. Length:', JOB_DATA?.length);
} catch (error) {
    console.error('❌ Failed to require JOB_DATA:', error);
}

try {
    // @ts-ignore
    const COMPLETE_QUESTION_BANK = require('../data/ossc-cgl/index');
    console.log('✅ COMPLETE_QUESTION_BANK required successfully.');
} catch (error) {
    console.error('❌ Failed to require COMPLETE_QUESTION_BANK:', error);
}
