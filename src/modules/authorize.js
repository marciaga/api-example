import expressJwt from 'express-jwt';

export const authorize = (roles = []) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('The app started without a JWT secret.');
  }
  // roles param can be a single role string (e.g. Role.User or 'User')
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  if (typeof roles === 'string') {
    roles = [roles]; /* eslint-disable-line */ // special case
  }

  return [
    // authenticate JWT token and attach user to request object (req.user)
    // { sub, iat role }
    expressJwt({
      secret,
      algorithms: ['HS256'],
    }),
    // authorize based on user role
    (req, res, next) => {
      if (roles.length && !roles.includes(req.user.role)) {
        // user's role is not authorized
        return res.status(401).json({ message: 'Unauthorized' });
      }
      // authentication and authorization successful
      next();
    },
  ];
};
