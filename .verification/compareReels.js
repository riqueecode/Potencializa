require('dotenv').config({ quiet: true });

async function main() {
  const userId = process.env.INSTAGRAM_USER_ID;
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!userId || !accessToken) {
    console.log(JSON.stringify({ error: 'missing-config' }, null, 2));
    return;
  }

  const url = new URL(`https://graph.instagram.com/v25.0/${encodeURIComponent(userId)}/media`);
  url.searchParams.set('fields', [
    'id',
    'media_type',
    'media_product_type',
    'media_url',
    'thumbnail_url',
    'permalink',
    'timestamp',
    'caption',
    'username',
    'owner',
    'shortcode',
    'children',
    'video_versions',
    'is_shared_to_feed'
  ].join(','));
  url.searchParams.set('access_token', accessToken);
  url.searchParams.set('limit', '10');

  const response = await fetch(url);
  const payload = await response.json();
  const items = Array.isArray(payload.data) ? payload.data : [];

  const summary = items.map((item) => ({
    id: item.id || null,
    media_type: item.media_type || null,
    media_product_type: item.media_product_type || null,
    media_url: item.media_url || null,
    thumbnail_url: item.thumbnail_url || null,
    permalink: item.permalink || null,
    timestamp: item.timestamp || null,
    caption: item.caption || null,
    username: item.username || null,
    owner: item.owner || null,
    shortcode: item.shortcode || null,
    children: item.children || null,
    video_versions: item.video_versions || null,
    is_shared_to_feed: item.is_shared_to_feed ?? null,
    has_media_url: Object.prototype.hasOwnProperty.call(item, 'media_url'),
    has_thumbnail_url: Object.prototype.hasOwnProperty.call(item, 'thumbnail_url'),
    has_owner: Boolean(item.owner),
    has_username: Boolean(item.username)
  }));

  console.log(JSON.stringify({
    count: summary.length,
    first: summary[0],
    second: summary[1],
    all: summary.slice(0, 5)
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
