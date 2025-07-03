const fs = require('fs');
const path = require('path');

/**
 * Test to verify the GitHub Actions workflow tag generation fix
 * This simulates how docker/metadata-action would process our tag configuration
 */
describe('GitHub Actions Docker Tag Generation', () => {
  const mockSha = 'd9a65a5';
  const registry = 'ghcr.io';
  const imageName = 'jacob-essa/projekt-narzedzia';

  function isValidDockerTag(tag) {
    const parts = tag.split(':');
    if (parts.length !== 2) return false;
    
    const [, tagName] = parts;
    
    // Docker tag validation rules
    if (tagName.length === 0 || tagName.length > 128) return false;
    if (tagName.startsWith('.') || tagName.startsWith('-')) return false;
    if (tagName.includes('..')) return false;
    if (!/^[a-z0-9._-]+$/.test(tagName)) return false;
    
    return true;
  }

  function generateTags(eventType, branch, isPullRequest, isDefaultBranch, prNumber = null) {
    const tags = [];
    
    // Our fixed tag configuration:
    
    // type=ref,event=branch
    if (eventType === 'push' && branch && !isPullRequest) {
      tags.push(`${registry}/${imageName}:${branch}`);
    }

    // type=ref,event=pr,prefix=pr-
    if (eventType === 'pull_request' && prNumber) {
      tags.push(`${registry}/${imageName}:pr-${prNumber}`);
    }

    // type=sha,prefix={{branch}}-,enable={{is_default_branch}}
    if (isDefaultBranch && branch) {
      tags.push(`${registry}/${imageName}:${branch}-${mockSha}`);
    }

    // type=sha,prefix=sha-,enable=${{ github.event_name == 'pull_request' }}
    if (isPullRequest) {
      tags.push(`${registry}/${imageName}:sha-${mockSha}`);
    }

    // type=raw,value=latest,enable={{is_default_branch}}
    if (isDefaultBranch) {
      tags.push(`${registry}/${imageName}:latest`);
    }

    return tags;
  }

  it('should generate valid tags for push to main branch', () => {
    const tags = generateTags('push', 'main', false, true);
    
    expect(tags).toEqual([
      'ghcr.io/jacob-essa/projekt-narzedzia:main',
      'ghcr.io/jacob-essa/projekt-narzedzia:main-d9a65a5',
      'ghcr.io/jacob-essa/projekt-narzedzia:latest'
    ]);

    tags.forEach(tag => {
      expect(isValidDockerTag(tag)).toBe(true);
    });
  });

  it('should generate valid tags for push to feature branch', () => {
    const tags = generateTags('push', 'feature-branch', false, false);
    
    expect(tags).toEqual([
      'ghcr.io/jacob-essa/projekt-narzedzia:feature-branch'
    ]);

    tags.forEach(tag => {
      expect(isValidDockerTag(tag)).toBe(true);
    });
  });

  it('should generate valid tags for pull request (the previously problematic case)', () => {
    const tags = generateTags('pull_request', '', true, false, 123);
    
    expect(tags).toEqual([
      'ghcr.io/jacob-essa/projekt-narzedzia:pr-123',
      'ghcr.io/jacob-essa/projekt-narzedzia:sha-d9a65a5'
    ]);

    tags.forEach(tag => {
      expect(isValidDockerTag(tag)).toBe(true);
    });

    // Verify no tags start with dash after colon (the original bug)
    tags.forEach(tag => {
      const tagPart = tag.split(':')[1];
      expect(tagPart.startsWith('-')).toBe(false);
    });
  });

  it('should generate valid tags for pull request with branch context', () => {
    const tags = generateTags('pull_request', 'feature-branch', true, false, 456);
    
    expect(tags).toEqual([
      'ghcr.io/jacob-essa/projekt-narzedzia:pr-456',
      'ghcr.io/jacob-essa/projekt-narzedzia:sha-d9a65a5'
    ]);

    tags.forEach(tag => {
      expect(isValidDockerTag(tag)).toBe(true);
    });
  });

  it('should not generate the problematic tag that caused the original issue', () => {
    // Simulate the old problematic configuration
    const problematicTag = `${registry}/${imageName}:-${mockSha}`;
    
    expect(isValidDockerTag(problematicTag)).toBe(false);
    
    // Verify our new configuration doesn't generate such tags
    const allScenarios = [
      generateTags('push', 'main', false, true),
      generateTags('push', 'feature', false, false),
      generateTags('pull_request', '', true, false, 123),
      generateTags('pull_request', 'feature', true, false, 456)
    ];

    allScenarios.flat().forEach(tag => {
      expect(tag).not.toBe(problematicTag);
      expect(isValidDockerTag(tag)).toBe(true);
    });
  });

  it('should verify workflow file exists and contains the fixed configuration', () => {
    const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'Build and deploy docker image.yml');
    
    expect(fs.existsSync(workflowPath)).toBe(true);
    
    const workflowContent = fs.readFileSync(workflowPath, 'utf8');
    
    // Verify the fixed tag configuration is present
    expect(workflowContent).toContain('type=ref,event=pr,prefix=pr-');
    expect(workflowContent).toContain('type=sha,prefix=sha-,enable=${{ github.event_name == \'pull_request\' }}');
    expect(workflowContent).toContain('type=sha,prefix={{branch}}-,enable={{is_default_branch}}');
    
    // Verify the old problematic configuration is not present
    expect(workflowContent).not.toContain('type=sha,prefix={{branch}}-\n');
  });
});