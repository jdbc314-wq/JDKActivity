// netlify/functions/sync.js
// JDKActivity — Netlify Blobs sync endpoint
// Deploy this file at: netlify/functions/sync.js
//
// Endpoints:
//   GET  /.netlify/functions/sync        → lire les données
//   POST /.netlify/functions/sync        → sauvegarder les données
//   DELETE /.netlify/functions/sync      → supprimer les données
//
// Sécurité : header Authorization: Bearer <TON_TOKEN>
// Génère ton token sur : app.netlify.com → User Settings → Applications → Personal Access Tokens

const { getStore } = require('@netlify/blobs');

const STORE_NAME   = 'jdkactivity';
const BLOB_KEY     = 'userdata';
const AUTH_TOKEN   = process.env.nfp_KfcLhvPtWbUdeWeMugCyVFCpYWb6xuQp159d; // variable d'env Netlify

function unauthorized(msg = 'Non autorisé') {
  return {
    statusCode: 401,
    headers: corsHeaders(),
    body: JSON.stringify({ error: msg }),
  };
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };
}

function checkAuth(event) {
  if (!AUTH_TOKEN) return true; // pas de token configuré → accès libre (dev)
  const header = event.headers?.authorization || event.headers?.Authorization || '';
  return header === `Bearer ${AUTH_TOKEN}`;
}

exports.handler = async (event) => {
  // Preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders(), body: '' };
  }

  // Auth check
  if (!checkAuth(event)) return unauthorized();

  const store = getStore(STORE_NAME);

  // ── GET : lire les données ─────────────────────────────────────────
  if (event.httpMethod === 'GET') {
    try {
      const data = await store.get(BLOB_KEY, { type: 'json' });
      if (!data) {
        return {
          statusCode: 404,
          headers: corsHeaders(),
          body: JSON.stringify({ error: 'Aucune donnée', empty: true }),
        };
      }
      return {
        statusCode: 200,
        headers: corsHeaders(),
        body: JSON.stringify({ ok: true, data }),
      };
    } catch (e) {
      return {
        statusCode: 500,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'Erreur lecture : ' + e.message }),
      };
    }
  }

  // ── POST : sauvegarder les données ────────────────────────────────
  if (event.httpMethod === 'POST') {
    try {
      const payload = JSON.parse(event.body || '{}');
      if (!payload || typeof payload !== 'object') {
        return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ error: 'Payload invalide' }) };
      }
      payload._savedAt = new Date().toISOString();
      await store.setJSON(BLOB_KEY, payload);
      return {
        statusCode: 200,
        headers: corsHeaders(),
        body: JSON.stringify({ ok: true, savedAt: payload._savedAt }),
      };
    } catch (e) {
      return {
        statusCode: 500,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'Erreur sauvegarde : ' + e.message }),
      };
    }
  }

  // ── DELETE : effacer les données ──────────────────────────────────
  if (event.httpMethod === 'DELETE') {
    try {
      await store.delete(BLOB_KEY);
      return {
        statusCode: 200,
        headers: corsHeaders(),
        body: JSON.stringify({ ok: true, message: 'Données supprimées' }),
      };
    } catch (e) {
      return {
        statusCode: 500,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'Erreur suppression : ' + e.message }),
      };
    }
  }

  return {
    statusCode: 405,
    headers: corsHeaders(),
    body: JSON.stringify({ error: 'Méthode non supportée' }),
  };
};

