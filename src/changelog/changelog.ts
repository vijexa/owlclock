
const LAST_READ_CHANGELOG_VERSION = 'lastReadChangelogVersion';

export function getLastReadChangelogVersion(): string {
    const version = localStorage.getItem(LAST_READ_CHANGELOG_VERSION);
    return version ?? '';
}

export function saveLastReadChangelogVersion(version: string) {
    localStorage.setItem(LAST_READ_CHANGELOG_VERSION, version);
}
