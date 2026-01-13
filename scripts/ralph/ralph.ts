#!/usr/bin/env npx tsx
/**
 * Ralph - Autonomous Feature Development Agent
 * Daily Event Insurance (Sierra Fred Carey)
 */

import { execSync, spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const RALPH_DIR = path.dirname(new URL(import.meta.url).pathname);
const PROJECT_DIR = path.resolve(RALPH_DIR, '../..');
const PARENT_TASK_FILE = path.join(RALPH_DIR, 'parent-task-id.txt');
const PROGRESS_FILE = path.join(RALPH_DIR, 'progress.txt');

interface Task {
  id: string;
  title: string;
  status: string;
  dependsOn?: string[];
}

function log(message: string) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
  fs.appendFileSync(PROGRESS_FILE, `[${timestamp}] ${message}\n`);
}

function getParentTaskId(): string {
  if (!fs.existsSync(PARENT_TASK_FILE)) {
    throw new Error(`Parent task ID file not found: ${PARENT_TASK_FILE}\nCreate the parent task first with 'amp task create'`);
  }
  return fs.readFileSync(PARENT_TASK_FILE, 'utf-8').trim();
}

function getSubtasks(parentId: string): Task[] {
  try {
    const result = execSync(
      `amp task list --parentID ${parentId} --limit 50 --json`,
      { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024, cwd: PROJECT_DIR }
    );
    return JSON.parse(result);
  } catch (error) {
    log(`Error fetching subtasks: ${error}`);
    return [];
  }
}

function findNextTask(tasks: Task[]): Task | null {
  const completedIds = new Set(
    tasks.filter(t => t.status === 'completed').map(t => t.id)
  );

  for (const task of tasks) {
    if (task.status === 'completed') continue;
    if (task.status === 'in-progress') continue;

    const deps = task.dependsOn || [];
    const allDepsComplete = deps.every(depId => completedIds.has(depId));

    if (allDepsComplete) {
      return task;
    }
  }

  return null;
}

function runAmpOnTask(taskId: string): Promise<boolean> {
  return new Promise((resolve) => {
    log(`Starting amp on task: ${taskId}`);
    
    const amp = spawn('amp', ['task', 'run', taskId], {
      stdio: 'inherit',
      shell: true,
      cwd: PROJECT_DIR
    });

    amp.on('close', (code) => {
      if (code === 0) {
        log(`Task ${taskId} completed successfully`);
        resolve(true);
      } else {
        log(`Task ${taskId} failed with code ${code}`);
        resolve(false);
      }
    });

    amp.on('error', (error) => {
      log(`Error running amp: ${error}`);
      resolve(false);
    });
  });
}

async function main() {
  const maxIterations = parseInt(process.argv[2] || '10', 10);
  
  // Initialize progress file
  if (!fs.existsSync(PROGRESS_FILE)) {
    fs.writeFileSync(PROGRESS_FILE, `# Ralph Progress Log
Project: Daily Event Insurance (Sierra Fred Carey)
Started: ${new Date().toISOString()}

## Codebase Patterns
- Next.js 16, React 19, TypeScript 5, Tailwind CSS 4
- Framer Motion for animations
- Drizzle ORM with PostgreSQL (Neon)
- Stripe for payments
- NextAuth for authentication
- GoHighLevel CRM integration
- Supabase integration
---
`);
  }

  log(`Ralph starting with max ${maxIterations} iterations`);
  log(`Project directory: ${PROJECT_DIR}`);

  const parentId = getParentTaskId();
  log(`Parent task ID: ${parentId}`);

  for (let i = 0; i < maxIterations; i++) {
    log(`\n=== Iteration ${i + 1}/${maxIterations} ===`);

    const tasks = getSubtasks(parentId);
    
    if (tasks.length === 0) {
      log('No subtasks found. Exiting.');
      break;
    }

    const completedCount = tasks.filter(t => t.status === 'completed').length;
    log(`Progress: ${completedCount}/${tasks.length} tasks completed`);

    if (completedCount === tasks.length) {
      log('All tasks completed! Marking parent as complete.');
      execSync(`amp task update ${parentId} --status completed`, { cwd: PROJECT_DIR });
      console.log('<promise>COMPLETE</promise>');
      break;
    }

    const nextTask = findNextTask(tasks);
    
    if (!nextTask) {
      log('No ready tasks found (all blocked or in-progress). Waiting...');
      await new Promise(r => setTimeout(r, 5000));
      continue;
    }

    log(`Next task: ${nextTask.title} (${nextTask.id})`);
    
    const success = await runAmpOnTask(nextTask.id);
    
    if (!success) {
      log(`Task failed. Continuing to next iteration...`);
    }
  }

  log('Ralph finished.');
}

main().catch(console.error);
