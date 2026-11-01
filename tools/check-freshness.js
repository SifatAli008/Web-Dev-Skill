#!/usr/bin/env node

/**
 * Universal WebDev Skills Freshness Checker
 * Validates that all skills have a last_verified date <= 180 days old.
 */

const fs = require('fs');
const path = require('path');

const INDEX_PATH = path.join(__dirname, '..', 'skills.index.json');
const MAX_DAYS = 180;

function checkFreshness() {
  console.log('=== Checking Skill Freshness (<= 180 days) ===\n');

  const indexData = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'));
  const now = new Date();
  let staleCount = 0;

  indexData.skills.forEach(skill => {
    const verifiedDate = new Date(skill.last_verified);
    const diffTime = Math.abs(now - verifiedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (isNaN(verifiedDate.getTime())) {
      console.error(`[FAIL] ${skill.id}: Invalid date format: ${skill.last_verified}`);
      staleCount++;
    } else if (diffDays > MAX_DAYS) {
      console.error(`[WARN] ${skill.id}: Stale! Verified ${diffDays} days ago (limit: ${MAX_DAYS})`);
      staleCount++;
    } else {
      console.log(`[PASS] ${skill.id}: Verified ${diffDays} days ago (${skill.last_verified})`);
    }
  });

  if (staleCount > 0) {
    console.error(`\nFreshness check failed: ${staleCount} skills require re-verification.`);
    process.exit(1);
  } else {
    console.log('\nAll skills verified within freshness threshold: SUCCESS\n');
  }
}

checkFreshness();
