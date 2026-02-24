const ORG  = 's-baee1eda-5a65-4d10-9844-711d588eabc2';
const BASE = `https://app.salsify.com/api/v1/orgs/${ORG}`;

module.exports = async function handler(req, res) {
  const apiKey = process.env.SALSIFY_API_KEY || 'rNkazt_wFkU1u_i0W-W_9lTd_EVwckBkuItFoS577ew';
  const { filter = '', per_page = 20, cursor } = req.query;

  let url = `${BASE}/products?per_page=${per_page}`;
  if (filter) url += `&filter=${encodeURIComponent(filter)}`;
  if (cursor) url += `&cursor=${encodeURIComponent(cursor)}`;

  try {
    const upstream = await fetch(url, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    const data = await upstream.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
