import simpleGit from 'simple-git';
import * as fs from 'fs';
import * as path from 'path';
const git = simpleGit();

export async function setupLocalRepo() {
    try {
        // Initialize a new Git repository
        await git.init();
        console.log('Initialized a new Git repository.');

        // Add all files to staging
        await git.add('.');
        console.log('Added files to staging.');

        // Commit changes
        await git.commit('Initial commit for local repo');
        console.log('Committed changes.');

        // List the current branches
        const branches = await git.branch();
        console.log('Current branches:', branches.all);
    } catch (error) {
        console.error('Failed to set up local repo:', error);
    }
}

//setupLocalRepo();

export async function initializeRepository() {
  try {
      await git.init().cwd('/home/kipr/Documents/KISS'); // Initialize the repository in the specified directory
      console.log('Git repository initialized successfully');
  } catch (error) {
      console.error('Error initializing repository:', error);
  }
}