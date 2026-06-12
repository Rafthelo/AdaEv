const auditMiddleware = (req, res, next) => {
  const originalJson = res.json.bind(res);

  res.json = async function (body) {
    try {
      const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
      const isSuccess  = res.statusCode < 400;

      if (isMutation && isSuccess && req.user) {
        const auditService = require('../modules/audit/audit.service');
        const entity = extractEntity(req.baseUrl || req.path);

        await auditService.log({
          user_id:    req.user.id,
          action:     `${entity}:${req.method.toLowerCase()}`,
          entity,
          entity_id:  body?.data?.id || req.params?.id || null,
          new_values: body?.data || null,
          ip_address: req.ip,
          user_agent: req.headers['user-agent'] || null,
        });
      }
    } catch (err) {
      console.error('Audit middleware error:', err.message);
    }

    return originalJson(body);
  };

  next();
};

const extractEntity = (path) => {
  const parts = path.replace('/api/v1/', '').replace('/api/', '').split('/');
  return parts[0] || 'unknown';
};

module.exports = auditMiddleware;