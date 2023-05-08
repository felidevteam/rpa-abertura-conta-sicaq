export type AbsoluteFilePath = string;

export type DiscordMessagePayload = {
    content: string,
    username: string | null,
    avatarUrl: string | null,
    files: AbsoluteFilePath[] | null
}
