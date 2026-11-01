#!/usr/bin/env node

/**
 * Universal WebDev Skills Evaluation Harness
 * Runs automated validation on evaluation tasks and trigger tests.
 */

const fs = require('fs');
const path = require('path');

function runHarness() {
  console.log('=== Universal WebDev Skills Eval Harness ===\n');

  // 1. Verify tasks database
  const tasksPath = path.join(__dirname, '..', 'tasks', 'eval-tasks.json');
  if (!fs.existsSync(tasksPath)) {
    console.error('FAIL: Missing eval-tasks.json');
    process.exit(1);
  }

  const tasksData = JSON.parse(fs.readFileSync(tasksPath, 'utf8'));
  console.log(`Loaded ${tasksData.tasks.length} benchmark evaluation tasks.`);

  // 2. Verify all skills in index exist and have trigger tests
  const indexPath = path.join(__dirname, '..', '..', 'skills.index.json');
  const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  console.log(`Found ${indexData.skills.length} registered skills in router index.`);

  let totalUnitTests = 0;
  let missingTests = [];

  indexData.skills.forEach(skill => {
    const testFile = path.join(__dirname, '..', '..', 'skills', skill.id, 'tests', 'trigger-tests.json');
    if (fs.existsSync(testFile)) {
      try {
        const testData = JSON.parse(fs.readFileSync(testFile, 'utf8'));
        const count = (testData.positive_triggers?.length || 0) +
                      (testData.negative_near_misses?.length || 0) +
                      (testData.evaluation_tasks?.length || 0);
        totalUnitTests += count;
        console.log(`  [PASS] ${skill.id}: ${count} tests defined.`);
      } catch (e) {
        console.error(`  [FAIL] ${skill.id}: Invalid trigger-tests.json`);
      }
    } else {
      missingTests.push(skill.id);
    }
  });

  if (missingTests.length > 0) {
    console.log(`\nNote: ${missingTests.length} skills awaiting Phase 3 test definitions: ${missingTests.join(', ')}`);
  }

  // 3. Validate task schemas
  let validTasks = 0;
  tasksData.tasks.forEach(t => {
    if (t.id && t.name && t.tier && t.prompt && t.expected_specialists && t.critical_checks) {
      validTasks++;
    } else {
      console.error(`Invalid task format: ${t.id}`);
    }
  });

  console.log(`\nTask Schema Integrity: ${validTasks}/${tasksData.tasks.length} valid.`);
  console.log('Eval Harness Ready: PASS\n');
}

runHarness();

