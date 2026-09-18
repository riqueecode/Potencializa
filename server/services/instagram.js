const INSTAGRAM_API_VERSION = "v25.0";
const INSTAGRAM_API_HOST = "https://graph.instagram.com";
const INSTAGRAM_MEDIA_FIELDS = [
  "id",
  "media_type",
  "media_product_type",
  "media_url",
  "thumbnail_url",
  "permalink",
  "caption",
  "timestamp",
].join(",");

export class InstagramApiError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "InstagramApiError";
    this.status = details.status;
    this.metaError = details.metaError;
  }
}

function getMetaErrorDetails(payload) {
  const error = payload?.error;

  if (!error) {
    return undefined;
  }

  return {
    code: error.code,
    type: error.type,
    message: error.message,
    error_subcode: error.error_subcode,
  };
}

export async function fetchInstagramReels() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const instagramUserId = process.env.INSTAGRAM_USER_ID;

  if (!accessToken || !instagramUserId) {
    throw new InstagramApiError(
      "Credenciais do Instagram ainda não configuradas.",
      { status: 500 }
    );
  }

  const url = new URL(
    `${INSTAGRAM_API_HOST}/${INSTAGRAM_API_VERSION}/${encodeURIComponent(
      instagramUserId
    )}/media`
  );
  url.searchParams.set("fields", INSTAGRAM_MEDIA_FIELDS);
  url.searchParams.set("access_token", accessToken);
  url.searchParams.set("limit", "25");

  let response;
  let payload;

  try {
    response = await fetch(url);
    payload = await response.json();
  } catch (error) {
    throw new InstagramApiError(
      "Não foi possível comunicar com a API do Instagram.",
      { status: 502, cause: error }
    );
  }

  if (!response.ok || payload?.error) {
    throw new InstagramApiError(
      "A API do Instagram recusou a solicitação.",
      {
        status: response.status || 502,
        metaError: getMetaErrorDetails(payload),
      }
    );
  }

  return (Array.isArray(payload?.data) ? payload.data : [])
    .filter((media) => media.media_product_type === "REELS")
    .sort(
      (first, second) =>
        new Date(second.timestamp || 0) - new Date(first.timestamp || 0)
    )
    .slice(0, 5)
    .map((media) => ({
      id: media.id,
      media_url: media.media_url || null,
      thumbnail_url: media.thumbnail_url || null,
      permalink: media.permalink || null,
      caption: media.caption || null,
      timestamp: media.timestamp || null,
    }));
}
