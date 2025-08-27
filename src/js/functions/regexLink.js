export function getPlatform(url) {
    if (!url) return null

    // convertir a minúsculas para evitar problemas de mayúsculas
    url = url.toLowerCase()

    // Linkedin
    const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\//
    if (linkedinRegex.test(url)) return "linkedin"

    // Twitter / X
    const twitterRegex = /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\//
    if (twitterRegex.test(url)) return "twitter"

    // Instagram
    const instagramRegex = /^(https?:\/\/)?(www\.)?instagram\.com\//
    if (instagramRegex.test(url)) return "instagram"

    // Facebook
    const facebookRegex = /^(https?:\/\/)?(www\.)?facebook\.com\//
    if (facebookRegex.test(url)) return "facebook"

    // YouTube
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//
    if (youtubeRegex.test(url)) return "youtube"

    // TikTok
    const tiktokRegex = /^(https?:\/\/)?(www\.)?tiktok\.com\//
    if (tiktokRegex.test(url)) return "tiktok"

    const discordRegex = /^(https?:\/\/)?(www\.)?(discord\.gg|discord\.com|discordapp\.com)\//i;
    if (discordRegex.test(url)) return "discord"

    // Si no coincide con ninguna
    return "other"
}
