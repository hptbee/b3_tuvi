import { execFileSync } from 'node:child_process';
import { readFileSync, appendFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

// Browser integration/configuration changes opt in; component/domain edits use lower levels.
export function requiresBrowser(paths, manual = false) {
    return manual || paths.some(file => /^frontend\/(?:e2e\/|playwright\.config\.(?:[cm]?js|ts)$|package(?:-lock)?\.json$)/.test(file));
}

export function comparison(eventName, event, git) {
    const sha = value => typeof value === 'string' && /^[a-f0-9]{40}$/.test(value);
    if (eventName === 'workflow_dispatch') return { manual: event.inputs?.browser_e2e === 'true', paths: [] };
    let base, head;
    if (eventName === 'pull_request') {
        base = event.pull_request?.base?.sha;
        head = event.pull_request?.head?.sha;
    } else if (eventName === 'push') {
        base = event.before;
        head = event.after;
        if (/^0{40}$/.test(head || '')) return { manual: false, paths: [] }; // Branch deletion has no browser build.
        if (/^0{40}$/.test(base || '')) {
            const branch = event.repository?.default_branch;
            if (typeof branch !== 'string' || !/^[\w./-]+$/.test(branch)) throw new Error('Missing default branch for new-branch comparison');
            base = git(['merge-base', `refs/remotes/origin/${branch}`, head]).trim();
        }
    } else throw new Error(`Unsupported browser routing event: ${eventName}`);
    if (!sha(base) || !sha(head)) throw new Error('Missing or invalid browser comparison SHAs');
    return { manual: false, paths: git(['diff', '--name-only', '-z', base, head, '--']).split('\0').filter(Boolean) };
}

export function run(env = process.env) {
    const event = JSON.parse(readFileSync(env.GITHUB_EVENT_PATH, 'utf8'));
    const git = args => execFileSync('git', args, { encoding: 'utf8' });
    const selected = comparison(env.GITHUB_EVENT_NAME, event, git);
    const enabled = requiresBrowser(selected.paths, selected.manual);
    const message = enabled ? 'Browser E2E selected for browser integration/configuration or explicit manual request.'
        : 'Browser E2E NOT RUN — no exceptional browser scope selected; this is not a browser PASS. Lower-level CI checks remain required.';
    console.log(message);
    if (env.GITHUB_OUTPUT) appendFileSync(env.GITHUB_OUTPUT, `run_browser=${enabled}\n`);
    if (env.GITHUB_STEP_SUMMARY) appendFileSync(env.GITHUB_STEP_SUMMARY, `${message}\n`);
    return enabled;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) run();
