const BLOCKED_KEYWORDS = ["badword", "unsafe", "secret", "confidential"];

export function applySafetyFilter(text: string): string {
    let filteredText = text;
    for (const keyword of BLOCKED_KEYWORDS) {
        const regex = new RegExp(`\\b${keyword}\\b`, "gi");
        filteredText = filteredText.replace(regex, "[REDACTED]");
    }
    return filteredText;
}
