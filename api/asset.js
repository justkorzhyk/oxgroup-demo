const ORG  = 's-baee1eda-5a65-4d10-9844-711d588eabc2';
const BASE = `https://app.salsify.com/api/v1/orgs/${ORG}`;

module.exports = async function handler(req, res) {
  const apiKey = process.env.SALSIFY_API_KEY || 'rNkazt_wFkU1u_i0W-W_9lTd_EVwckBkuItFoS577ew';
  const { id } = req.query;

  if (!id) return res.status(400).json({ error: 'Missing id' });

  try {
    const upstream = await fetch(`${BASE}/digital_assets/${id}`, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    const data = await upstream.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ url: data['salsify:url'] || null });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
